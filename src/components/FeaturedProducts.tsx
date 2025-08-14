import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";

interface Product {
  id: string;
  name: string;
  brand?: string | null;
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

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    console.log('🎯 Clicou para adicionar produto:', product);
    
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        price: product.price,
        image: product.image_url || "/placeholder.svg"
      };
      
      console.log('📝 Item do carrinho preparado:', cartItem);
      addItem(cartItem);
      
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      console.error('❌ Erro ao adicionar produto ao carrinho:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Os mais vendidos com os melhores preços
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card 
                className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full cursor-pointer"
                onClick={() => navigate(`/produto/${product.id}`)}
              >
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Discount Badge */}
                    {product.discount && product.discount > 0 && (
                      <Badge className="absolute top-3 left-3 md:top-4 md:left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm md:text-base px-3 md:px-4 py-1 md:py-2 shadow-xl border-0 rounded-xl">
                        -{product.discount}%
                      </Badge>
                    )}
                    
                    {/* Stock Badge */}
                    <Badge 
                      className={`absolute top-3 right-3 md:top-4 md:right-4 text-xs md:text-sm font-semibold px-2 md:px-3 py-1 border-0 rounded-xl shadow-lg ${
                        product.in_stock
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                      }`}
                    >
                      {product.in_stock ? 'Em Estoque' : 'Indisponível'}
                    </Badge>
                  </div>
                  
                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="font-bold text-base md:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2 text-gray-900 dark:text-white leading-tight">
                          {product.name}
                        </h3>
                      </div>
                      
                      {/* Rating */}
                      {product.rating && product.reviews && product.rating > 0 && product.reviews > 0 ? (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating!)
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {product.rating} ({product.reviews} avaliações)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                            Seja o primeiro a avaliar
                          </span>
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl md:text-2xl font-bold text-primary">
                            {formatCurrency(product.price)}
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatCurrency(product.original_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-2 transition-all duration-300 transform group-hover:scale-105 rounded-xl shadow-lg hover:shadow-xl text-sm md:text-base"
                      disabled={!product.in_stock}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.in_stock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 md:mt-12">
          <Button variant="outline" size="lg" onClick={() => navigate("/produtos")} className="text-sm md:text-base">
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;