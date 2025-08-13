import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Todas as Categorias",
  "Cimento & Argamassa",
  "Tijolos & Blocos", 
  "Tintas & Vernizes",
  "Ferramentas",
  "Hidráulica",
  "Elétrica",
  "Madeiras",
  "Transporte",
  "Pisos & Revestimentos",
  "Iluminação",
];

const products = [
  {
    id: 1,
    name: "Cimento Portland CP II-E-32",
    brand: "Votorantim",
    price: 25.90,
    originalPrice: 29.90,
    image: "/api/placeholder/300/300",
    category: "Cimento & Argamassa",
    discount: 13
  },
  {
    id: 2,
    name: "Tijolo Cerâmico 6 Furos",
    brand: "Cerâmica São João",
    price: 0.89,
    originalPrice: null,
    image: "/api/placeholder/300/300",
    category: "Tijolos & Blocos",
    discount: null
  },
  {
    id: 3,
    name: "Tinta Acrílica Premium Branca 18L",
    brand: "Suvinil",
    price: 189.90,
    originalPrice: 219.90,
    image: "/api/placeholder/300/300",
    category: "Tintas & Vernizes",
    discount: 14
  },
  {
    id: 4,
    name: "Furadeira de Impacto 1/2\" 650W",
    brand: "Bosch",
    price: 299.90,
    originalPrice: 349.90,
    image: "/api/placeholder/300/300",
    category: "Ferramentas",
    discount: 14
  },
  {
    id: 5,
    name: "Tubo PVC 100mm 6m",
    brand: "Tigre",
    price: 45.90,
    originalPrice: null,
    image: "/api/placeholder/300/300",
    category: "Hidráulica",
    discount: null
  },
  {
    id: 6,
    name: "Cabo Flexível 2,5mm² 100m",
    brand: "Prysmian",
    price: 189.90,
    originalPrice: 209.90,
    image: "/api/placeholder/300/300",
    category: "Elétrica",
    discount: 10
  },
];

const Produtos = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todas as Categorias");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");

  const filteredProducts = products.filter(product => 
    selectedCategory === "Todas as Categorias" || product.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Produtos</h1>
          <p className="text-muted-foreground">
            Encontre os melhores materiais de construção para sua obra
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevância</SelectItem>
                <SelectItem value="menor-preco">Menor preço</SelectItem>
                <SelectItem value="maior-preco">Maior preço</SelectItem>
                <SelectItem value="nome">Nome A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} produtos encontrados
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Discount Badge */}
                {product.discount && (
                  <Badge className="mb-2 bg-red-500 hover:bg-red-600">
                    -{product.discount}%
                  </Badge>
                )}

                {/* Product Info */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-1">
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" variant="construction">
                  Adicionar ao Carrinho
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Carregar mais produtos
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Produtos;