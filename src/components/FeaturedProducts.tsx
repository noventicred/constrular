import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PixBadge } from "@/components/ui/pix-badge";
import { Star, ShoppingCart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
import { getProductImageUrl, createImageProps } from "@/lib/imageUtils";

interface Product {
  id: string;
  name: string;
  brand?: string | null;
  sku?: string | null;
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
  const [productComments, setProductComments] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getWhatsAppNumber, getSetting } = useSettings();

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

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand || '',
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
        // Simular clique no botão do carrinho para abrir
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
                        <h3 className="font-bold text-base md:text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2 text-gray-900 dark:text-white leading-tight">
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
                       <div className="space-y-3 mt-4">
                         {product.original_price && product.original_price !== product.price ? (
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
                           <div className="bg-gradient-to-r from-construction-orange to-primary bg-clip-text text-transparent text-2xl md:text-3xl font-black tracking-tight">
                             {formatCurrency(product.price)}
                           </div>
                         )}
                       </div>
                    </div>
                     
                     {/* Action Buttons */}
                     <div className="space-y-3 mt-6">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-2 transition-all duration-300 transform group-hover:scale-105 rounded-xl shadow-lg hover:shadow-xl text-sm md:text-base"
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