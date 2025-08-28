import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PixBadge } from "@/components/ui/pix-badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Percent, Clock, ShoppingCart, Star, MessageCircle } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/hooks/useSettings";
import { formatCurrency } from "@/lib/formatters";
import { getProductImageUrl, createImageProps } from "@/lib/imageUtils";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku?: string | null;
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
  const [productComments, setProductComments] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getWhatsAppNumber, getSetting } = useSettings();
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

      // Buscar comentários para cada produto
      if (data && data.length > 0) {
        const commentsData: Record<string, number> = {};
        
        for (const product of data) {
          const { data: comments } = await supabase
            .from('product_comments')
            .select('rating')
            .eq('product_id', product.id);
          
          if (comments && comments.length > 0) {
            const averageRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;
            commentsData[product.id] = averageRating;
          } else {
            commentsData[product.id] = 0;
          }
        }
        
        setProductComments(commentsData);
      }
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

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        brand: '',
        price: product.price,
        image: getProductImageUrl(product.image_url)
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

  const handleWhatsAppOrder = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    const storeName = getSetting('store_name') || 'Minha Loja';
    const productUrl = `${window.location.origin}/produto/${product.id}`;
    
    const message = `Olá! Gostaria de fazer um pedido desse item específico:\n\n` +
                   `*${product.name}*\n` +
                   `SKU: ${product.sku || product.id}\n` +
                   `Preço: ${formatCurrency(product.price)}\n` +
                   `Loja: ${storeName}\n\n` +
                   `Link do produto: ${productUrl}\n\n` +
                   `Aguardo informações sobre disponibilidade e formas de pagamento!`;
    
    const phoneNumber = getWhatsAppNumber();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
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
    <section className="py-12 md:py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Percent className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />
            Ofertas Especiais
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Aproveite nossos descontos exclusivos por tempo limitado
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 rounded-full bg-white shadow-lg border-2 hover:bg-gray-50 hidden lg:flex items-center justify-center"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 rounded-full bg-white shadow-lg border-2 hover:bg-gray-50 hidden lg:flex items-center justify-center"
            onClick={scrollNext}
          >
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden py-2" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6 px-1">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex-none w-72 md:w-80 lg:w-80 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Card 
                    className="group relative overflow-hidden bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full cursor-pointer"
                    onClick={() => navigate(`/produto/${product.id}`)}
                  >
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative h-48 md:h-56 overflow-hidden rounded-t-2xl">
                        <img
                          {...createImageProps(
                            product.image_url,
                            product.name,
                            "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          )}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Discount Badge - Top Left */}
                        {product.original_price && product.original_price !== product.price && (
                          <Badge className="absolute top-3 left-3 md:top-4 md:left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-xs md:text-sm px-2 md:px-3 py-1 shadow-xl border-0 rounded-lg">
                            -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                          </Badge>
                        )}
                        
                        {/* Stock Badge - Top Right */}
                        <Badge 
                          className={`absolute top-3 right-3 md:top-4 md:right-4 text-xs md:text-sm font-semibold px-2 md:px-3 py-1 border-0 rounded-lg shadow-lg ${
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
                            <h3 className="font-bold text-base md:text-lg mb-1 group-hover:text-construction-orange transition-colors line-clamp-2 text-gray-900 dark:text-white leading-tight">
                              {product.name}
                            </h3>
                          </div>
                          
                          {/* Rating */}
                          {productComments[product.id] > 0 ? (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${
                                      i < Math.floor(productComments[product.id])
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                {productComments[product.id].toFixed(1)}
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
                           <div className="space-y-3 mt-3">
                             {product.original_price && product.original_price !== product.price ? (
                               <div className="space-y-2">
                                 <div className="text-sm text-muted-foreground line-through">
                                   De: {formatCurrency(product.original_price)}
                                 </div>
                                 <PixBadge 
                                   price={product.price} 
                                   originalPrice={product.original_price}
                                 />
                               </div>
                             ) : (
                               <div className="text-xl md:text-2xl font-bold text-construction-orange">
                                 {formatCurrency(product.price)}
                               </div>
                             )}
                           </div>
                        </div>
                          
                          {/* Action Buttons */}
                          <div className="space-y-3 mt-6">
                           <Button 
                             className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 transition-all duration-300 transform group-hover:scale-105 rounded-xl shadow-lg hover:shadow-xl text-sm md:text-base"
                             disabled={!product.in_stock}
                             onClick={(e) => handleAddToCart(e, product)}
                           >
                             <ShoppingCart className="h-4 w-4 mr-2" />
                             {product.in_stock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                           </Button>
                           
                           <Button 
                             className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 transition-all duration-300 transform group-hover:scale-105 rounded-xl shadow-lg hover:shadow-xl text-sm md:text-base border-0"
                             disabled={!product.in_stock}
                             onClick={(e) => handleWhatsAppOrder(e, product)}
                           >
                             <MessageCircle className="h-4 w-4 mr-2" />
                             Comprar pelo WhatsApp
                           </Button>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile scroll indicator */}
          <div className="flex justify-center mt-4 lg:hidden">
            <div className="text-xs text-muted-foreground">
              ← Deslize para ver mais ofertas →
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 md:mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="group text-sm md:text-base"
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