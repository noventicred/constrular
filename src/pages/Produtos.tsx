import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
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
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
  };
}

const Produtos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
  const [offerFilter, setOfferFilter] = useState(false);
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar parâmetros da URL ao carregar a página
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const categoryParam = urlParams.get('categoria');
    
    if (filterParam === 'ofertas') {
      setOfferFilter(true);
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    fetchData();
  }, []);

  // Atualizar URL quando filtros mudarem
  useEffect(() => {
    const url = new URL(window.location.href);
    
    // Gerenciar parâmetro de ofertas
    if (offerFilter) {
      url.searchParams.set('filter', 'ofertas');
    } else {
      url.searchParams.delete('filter');
    }
    
    // Gerenciar parâmetro de categoria
    if (selectedCategory && selectedCategory !== 'todas') {
      url.searchParams.set('categoria', selectedCategory);
    } else {
      url.searchParams.delete('categoria');
    }
    
    // Atualizar URL sem recarregar a página
    window.history.replaceState({}, '', url.toString());
  }, [offerFilter, selectedCategory]);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .eq('in_stock', true)
          .limit(50)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('name', { ascending: true })
      ]);

      if (productsResponse.error) throw productsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on category, search term, and offers
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "todas" || 
      (product.categories?.id === selectedCategory);
    
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Se offerFilter está ativo, só mostrar produtos marcados como oferta especial
    if (offerFilter) {
      return matchesCategory && matchesSearch && product.is_special_offer === true;
    }
    
    // Se não há filtro de oferta, aplicar apenas categoria e busca
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "preco-menor":
        return a.price - b.price;
      case "preco-maior":
        return b.price - a.price;
      case "nome":
        return a.name.localeCompare(b.name);
      case "avaliacao":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        brand: '',
        price: product.price,
        image: product.image_url || "/placeholder.svg"
      };
      
      addItem(cartItem);
      
      // Notificação melhorada
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

      // Pequeno delay para mostrar a notificação antes de abrir o carrinho
      setTimeout(() => {
        const cartButton = document.querySelector('[data-cart-trigger]') as HTMLButtonElement;
        if (cartButton) {
          cartButton.click();
        }
      }, 800);
      
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        {/* Filters and Search */}
        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
            
            {/* Offer Filter */}
            <Button
              variant={offerFilter ? "default" : "outline"}
              onClick={() => setOfferFilter(!offerFilter)}
              className="whitespace-nowrap sm:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              {offerFilter ? "Mostrar Todos" : "Só Ofertas"}
            </Button>
          </div>

          {/* Sort and View Mode */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevância</SelectItem>
                <SelectItem value="preco-menor">Menor Preço</SelectItem>
                <SelectItem value="preco-maior">Maior Preço</SelectItem>
                <SelectItem value="nome">Nome A-Z</SelectItem>
                <SelectItem value="avaliacao">Melhor Avaliação</SelectItem>
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
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">
            {offerFilter ? 'Ofertas Especiais' : 
             selectedCategory !== 'todas' ? 
               `Categoria: ${categories.find(c => c.id === selectedCategory)?.name || 'Selecionada'}` : 
               'Todos os Produtos'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {sortedProducts.length} produtos encontrados
            {offerFilter && ' em oferta'}
            {selectedCategory !== 'todas' && !offerFilter && ` na categoria`}
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {sortedProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/produto/${product.id}`)}
            >
              <CardContent className="p-5">
                {/* Product Image */}
                <div className="aspect-square mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Badges Container */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Discount Badge */}
                  {product.discount && product.discount > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-3 py-1 text-sm font-bold rounded-full">
                      -{product.discount}%
                    </Badge>
                  )}

                  {/* Stock Badge */}
                  <Badge 
                    className={`border-0 px-3 py-1 text-sm font-medium rounded-full ${
                      product.in_stock 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                    }`}
                  >
                    {product.in_stock ? 'Em Estoque' : 'Indisponível'}
                  </Badge>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
                      {product.categories?.name || 'Produto'}
                    </p>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                  </div>
                  
                  {/* Rating */}
                  {product.rating && product.reviews && product.rating > 0 && product.reviews > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating!) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
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
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.original_price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-sm text-green-600 font-medium">
                          -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-5 pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg" 
                  variant="construction"
                  disabled={!product.in_stock}
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.in_stock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {offerFilter 
                ? 'Nenhuma oferta encontrada.'
                : 'Nenhum produto encontrado.'
              }
            </p>
          </div>
        )}
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Produtos;