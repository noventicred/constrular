import { useState, useEffect } from "react";
import {
  Filter,
  Grid,
  List,
  ShoppingCart,
  Star,
  Sliders,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PixBadge } from "@/components/ui/pix-badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/hooks/useSettings";
import { useAdvancedSearch } from "@/hooks/useAdvancedSearch";
import { formatCurrency } from "@/lib/formatters";
import { getProductImageUrl, createImageProps } from "@/lib/imageUtils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import FloatingCart from "@/components/FloatingCart";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount: number | null;
  image_url: string | null;
  category_id: string | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean | null;
  is_special_offer: boolean | null;
  sku: string | null;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
  };
}

const Produtos = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { getWhatsAppNumber, getSetting } = useSettings();

  // Use the advanced search hook
  const {
    products,
    loading,
    filters,
    updateFilters,
    resetFilters,
    searchSuggestions,
    totalResults,
  } = useAdvancedSearch();

  useEffect(() => {
    fetchCategories();

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get("filter");
    const categoryParam = urlParams.get("categoria");
    const searchParam = urlParams.get("search");

    if (filterParam === "ofertas") {
      updateFilters({ onlyOffers: true });
    }

    if (categoryParam) {
      updateFilters({ category: categoryParam });
    }

    if (searchParam) {
      updateFilters({ searchTerm: decodeURIComponent(searchParam) });
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const url = new URL(window.location.href);

    if (filters.onlyOffers) {
      url.searchParams.set("filter", "ofertas");
    } else {
      url.searchParams.delete("filter");
    }

    if (filters.category !== "todas") {
      url.searchParams.set("categoria", filters.category);
    } else {
      url.searchParams.delete("categoria");
    }

    if (filters.searchTerm) {
      url.searchParams.set("search", encodeURIComponent(filters.searchTerm));
    } else {
      url.searchParams.delete("search");
    }

    window.history.replaceState({}, "", url.toString());
  }, [filters.onlyOffers, filters.category, filters.searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .is("parent_id", null)
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Count active filters for UI
  const activeFiltersCount = [
    filters.category !== "todas",
    filters.onlyOffers,
    !filters.inStock,
    filters.minRating > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000,
  ].filter(Boolean).length;

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        brand: "",
        price: product.price,
        image: getProductImageUrl(product.image_url),
      };

      addItem(cartItem);

      toast({
        title: "✅ Produto adicionado!",
        description: (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(product.price)} • Agora no seu carrinho
              </p>
            </div>
          </div>
        ),
        duration: 3000,
      });

      setTimeout(() => {
        const cartButton = document.querySelector(
          "[data-cart-trigger]"
        ) as HTMLButtonElement;
        if (cartButton) {
          cartButton.click();
        }
      }, 800);
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppOrder = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    const storeName = getSetting("store_name") || "Minha Loja";
    const productUrl = `${window.location.origin}/produto/${product.id}`;

    const message =
      `Olá! Gostaria de fazer um pedido desse item específico:\n\n` +
      `*${product.name}*\n` +
      `SKU: ${product.sku || product.id}\n` +
      `Preço: ${formatCurrency(product.price)}\n` +
      `Loja: ${storeName}\n\n` +
      `Link do produto: ${productUrl}\n\n` +
      `Aguardo informações sobre disponibilidade e formas de pagamento!`;

    const phoneNumber = getWhatsAppNumber();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  // Generate SEO data
  const seoTitle = filters.searchTerm
    ? `${filters.searchTerm} - Material de Construção | Nova Casa Construção`
    : filters.category !== "todas"
    ? `${
        categories.find((c) => c.id === filters.category)?.name || "Categoria"
      } - Material de Construção | Nova Casa Construção`
    : "Produtos - Material de Construção | Nova Casa Construção";

  const seoDescription = filters.searchTerm
    ? `Encontre ${filters.searchTerm} e outros materiais de construção com os melhores preços. ${totalResults} produtos encontrados.`
    : `Loja completa de material de construção. Cimento, tijolos, tintas, ferramentas e muito mais. ${totalResults} produtos disponíveis.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: totalResults,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      "@type": "Product",
      position: index + 1,
      name: product.name,
      description: product.description,
      image: getProductImageUrl(product.image_url),
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "BRL",
        availability: product.in_stock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
      aggregateRating:
        product.rating && product.reviews
          ? {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews,
            }
          : undefined,
    })),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO
          title="Carregando Produtos - Nova Casa Construção"
          description="Carregando produtos de material de construção..."
        />
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`loading-skeleton-${i}`}
                className="h-96 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={seoTitle}
        description={seoDescription}
        structuredData={structuredData}
        type="website"
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        {/* Advanced Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={filters.searchTerm}
            onChange={(value) => updateFilters({ searchTerm: value })}
            suggestions={searchSuggestions}
            onSuggestionSelect={(suggestion) =>
              updateFilters({ searchTerm: suggestion })
            }
            showFilters
            activeFiltersCount={activeFiltersCount}
            onFiltersClick={() => setShowAdvancedFilters(true)}
            className="mb-4"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger className="w-full sm:flex-1">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={filters.onlyOffers ? "default" : "outline"}
            onClick={() => updateFilters({ onlyOffers: !filters.onlyOffers })}
            className="whitespace-nowrap sm:w-auto w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            {filters.onlyOffers ? "Mostrar Todos" : "Só Ofertas"}
          </Button>
        </div>

        {/* Sort and View Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilters({ sortBy: value })}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancia">Relevância</SelectItem>
              <SelectItem value="preco-menor">Menor Preço</SelectItem>
              <SelectItem value="preco-maior">Maior Preço</SelectItem>
              <SelectItem value="nome">Nome A-Z</SelectItem>
              <SelectItem value="avaliacao">Melhor Avaliação</SelectItem>
              <SelectItem value="desconto">Maior Desconto</SelectItem>
              <SelectItem value="mais-vendido">Mais Vendidos</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg self-start sm:self-auto">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none flex-1 sm:flex-none"
            >
              <Grid className="h-4 w-4" />
              <span className="ml-2 sm:hidden">Grade</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none flex-1 sm:flex-none"
            >
              <List className="h-4 w-4" />
              <span className="ml-2 sm:hidden">Lista</span>
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {filters.searchTerm
              ? `Resultados para "${filters.searchTerm}"`
              : filters.onlyOffers
              ? "Ofertas Especiais"
              : filters.category !== "todas"
              ? categories.find((c) => c.id === filters.category)?.name ||
                "Categoria Selecionada"
              : "Todos os Produtos"}
          </h1>
          <p className="text-muted-foreground">
            {totalResults}{" "}
            {totalResults === 1 ? "produto encontrado" : "produtos encontrados"}
            {filters.onlyOffers ? " em oferta" : ""}
          </p>
        </div>

        {/* Advanced Filters Sheet */}
        <Sheet open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <SheetContent className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle>Filtros Avançados</SheetTitle>
              <SheetDescription>
                Refine sua busca com filtros específicos
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Price Range */}
              <div>
                <Label className="text-base font-medium">
                  Faixa de Preço: {formatCurrency(filters.priceRange[0])} -{" "}
                  {formatCurrency(filters.priceRange[1])}
                </Label>
                <div className="space-y-2 mt-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      updateFilters({
                        priceRange: [
                          Number(e.target.value),
                          filters.priceRange[1],
                        ],
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      updateFilters({
                        priceRange: [
                          filters.priceRange[0],
                          Number(e.target.value),
                        ],
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <Separator />

              {/* Stock Filter */}
              <div className="flex items-center justify-between">
                <Label htmlFor="stock-filter" className="text-base font-medium">
                  Apenas em estoque
                </Label>
                <Switch
                  id="stock-filter"
                  checked={filters.inStock}
                  onCheckedChange={(checked) =>
                    updateFilters({ inStock: checked })
                  }
                />
              </div>

              <Separator />

              {/* Rating Filter */}
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Avaliação mínima: {filters.minRating}{" "}
                  {filters.minRating > 0 ? "★" : ""}
                </Label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) =>
                    updateFilters({ minRating: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3"
                />
              </div>

              <Separator />

              {/* Reset Filters */}
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {products.map((product) => (
              <Card
                key={product.id}
                className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(`/produto/${product.id}`)}
              >
                <CardContent className="p-5">
                  {/* Product Image */}
                  <div className="aspect-square mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
                    <img
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Discount Badge - Top Left */}
                    {product.original_price &&
                      product.original_price !== product.price && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xs px-2 py-1 shadow-xl border-0 rounded-lg">
                          -
                          {Math.round(
                            ((product.original_price - product.price) /
                              product.original_price) *
                              100
                          )}
                          %
                        </Badge>
                      )}

                    {/* Stock Badge - Top Right */}
                    <Badge
                      className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 border-0 rounded-lg shadow-lg ${
                        product.in_stock
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                          : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                      }`}
                    >
                      {product.in_stock ? "Em Estoque" : "Indisponível"}
                    </Badge>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                        {product.categories?.name || "Produto"}
                      </p>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                    </div>

                    {/* Rating */}
                    {product.rating &&
                    product.reviews &&
                    product.rating > 0 &&
                    product.reviews > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={`star-${i}`}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating!)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {product.rating} ({product.reviews} avaliações)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                          Seja o primeiro a avaliar
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="space-y-2">
                      {product.original_price &&
                      product.original_price !== product.price ? (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground line-through font-medium">
                            De: {formatCurrency(product.original_price)}
                          </div>
                          <PixBadge
                            price={product.price}
                            originalPrice={product.original_price}
                            className="text-base font-extrabold shadow-xl"
                          />
                        </div>
                      ) : (
                        <div className="text-2xl md:text-3xl font-bold text-primary">
                          {formatCurrency(product.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0">
                  <div className="w-full space-y-2">
                    <Button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!product.in_stock}
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock
                        ? "Adicionar ao Carrinho"
                        : "Indisponível"}
                    </Button>

                    <Button
                      onClick={(e) => handleWhatsAppOrder(e, product)}
                      disabled={!product.in_stock}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-0"
                    >
                      <WhatsAppIcon className="h-4 w-4 mr-2" />
                      Comprar pelo WhatsApp
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Não encontramos produtos que correspondam aos seus critérios de
                busca.
                {filters.searchTerm
                  ? " Tente usar palavras-chave diferentes ou "
                  : ""}
                {filters.category !== "todas" || filters.onlyOffers
                  ? " Tente remover alguns filtros ou "
                  : ""}
                navegar pelas categorias.
              </p>
              <div className="space-y-3">
                {filters.searchTerm ? (
                  <Button
                    variant="outline"
                    onClick={() => updateFilters({ searchTerm: "" })}
                    className="mr-3"
                  >
                    Limpar busca
                  </Button>
                ) : null}
                {activeFiltersCount > 0 ? (
                  <Button variant="outline" onClick={resetFilters}>
                    Remover filtros
                  </Button>
                ) : null}
                <Button onClick={() => navigate("/produtos")}>
                  Ver todos os produtos
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Produtos;
