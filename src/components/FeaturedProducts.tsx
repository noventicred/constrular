import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  rating: number | null;
  reviews: number | null;
  discount: number | null;
  in_stock: boolean | null;
  description: string | null;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('in_stock', true)
        .limit(12)
        .order('rating', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: parseInt(product.id),
      name: product.name,
      brand: '',
      price: product.price,
      image: product.image_url || "/placeholder.svg"
    });
    
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  if (loading) {
    return (
      <section className="py-16 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-lg text-muted-foreground">
              Carregando produtos...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-muted-foreground">
            Os mais vendidos com os melhores preços
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card key={product.id} className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in cursor-pointer" style={{ animationDelay: `${index * 100}ms` }} onClick={() => navigate(`/produto/${product.id}`)}>
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                  <img 
                    src={product.image_url || "/placeholder.svg"} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Discount Badge */}
                  {product.discount && product.discount > 0 && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-3 py-1 text-sm font-bold shadow-lg">
                      -{product.discount}%
                    </Badge>
                  )}
                  
                  {/* Stock Status */}
                  <Badge 
                    className={`absolute top-3 right-3 border-0 px-3 py-1 text-sm font-medium shadow-lg ${
                      product.in_stock 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    }`}
                  >
                    {product.in_stock ? 'Em Estoque' : 'Indisponível'}
                  </Badge>
                  
                  {/* Wishlist Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white shadow-lg rounded-full h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="h-4 w-4 text-gray-700" />
                  </Button>
                </div>
                
                <div className="p-5">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Rating */}
                    {product.rating && product.reviews && product.rating > 0 && product.reviews > 0 && (
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
                    )}
                    
                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.original_price)}
                          </span>
                        )}
                      </div>
                      {product.original_price && product.original_price > product.price && (
                        <p className="text-xs text-green-600 font-medium">
                          Economia de {formatCurrency(product.original_price - product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-5 pt-0">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg" 
                  disabled={!product.in_stock}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.in_stock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={() => navigate("/produtos")}>
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;