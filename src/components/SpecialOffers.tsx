import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Percent, Clock, ShoppingCart, Star } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount: number | null;
  image_url: string | null;
  rating: number | null;
  reviews: number | null;
  in_stock: boolean | null;
  is_special_offer: boolean | null;
}

const SpecialOffers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_special_offer', true)
        .eq('in_stock', true)
        .limit(20)
        .order('discount', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching special offers:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as ofertas especiais.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Percent className="h-8 w-8 text-orange-500" />
              Ofertas Especiais
            </h2>
            <p className="text-lg text-muted-foreground">Carregando ofertas...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if there are no special offers
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Percent className="h-8 w-8 text-orange-500" />
            Ofertas Especiais
          </h2>
          <p className="text-lg text-muted-foreground">
            Aproveite nossos descontos exclusivos por tempo limitado
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border-2 hover:bg-gray-50 hidden md:flex items-center justify-center"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border-2 hover:bg-gray-50 hidden md:flex items-center justify-center"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden py-2" ref={emblaRef}>
            <div className="flex gap-6 px-1">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex-none w-80 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Card 
                    className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full cursor-pointer"
                    onClick={() => navigate(`/produto/${product.id}`)}
                  >
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden rounded-t-2xl">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Discount Badge */}
                        {product.discount && product.discount > 0 && (
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-base px-4 py-2 shadow-xl border-0 rounded-xl">
                            -{product.discount}%
                          </Badge>
                        )}
                        
                        {/* Stock Badge */}
                        <Badge 
                          className={`absolute top-4 right-4 text-sm font-semibold px-3 py-1 border-0 rounded-xl shadow-lg ${
                            product.in_stock
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                          }`}
                        >
                          {product.in_stock ? 'Em Estoque' : 'Indisponível'}
                        </Badge>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="space-y-2 flex-1">
                          <div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-2 text-gray-900 dark:text-white leading-tight">
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
                              <span className="text-2xl font-bold text-orange-600">
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
                          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 transition-all duration-300 transform group-hover:scale-105 rounded-xl shadow-lg hover:shadow-xl"
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
          </div>

          {/* Mobile scroll indicator */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="text-xs text-muted-foreground">
              ← Deslize para ver mais ofertas →
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="group"
            onClick={() => navigate("/produtos?filter=ofertas")}
          >
            Ver Todas as Ofertas
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;