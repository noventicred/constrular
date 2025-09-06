import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PixBadge } from "@/components/ui/pix-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  ThumbsUp,
  ThumbsDown,
  CheckCircle
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
import { getProductImageUrl, getProductImageUrls, createImageProps } from "@/lib/imageUtils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import FloatingCart from "@/components/FloatingCart";
import { Skeleton } from "@/components/ui/skeleton";

// Product type interface matching Supabase
interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews_count?: number;
  discount?: number;
  in_stock: boolean;
  sku?: string;
  category?: string;
  image_url: string;
  description: string;
  specifications?: Record<string, string>;
  benefits?: string[];
  category_id?: string;
  created_at?: string;
  updated_at?: string;
  is_featured?: boolean;
  is_special_offer?: boolean;
}

interface ProductComment {
  id: string;
  author_name: string;
  comment_text: string;
  rating: number;
  likes: number;
  dislikes: number;
  created_at: string;
}

const Produto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { getWhatsAppNumber, getSetting } = useSettings();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);

  
  // Calcular rating baseado nos comentários
  const averageRating = comments.length > 0 
    ? comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length 
    : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Buscar produto
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) {
          console.error('Erro ao carregar produto:', productError);
          toast({
            title: "Erro",
            description: "Não foi possível carregar o produto.",
            variant: "destructive",
          });
          return;
        }

        setProduct(productData);

        // Buscar comentários
        const { data: commentsData, error: commentsError } = await supabase
          .from('product_comments')
          .select('*')
          .eq('product_id', id)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Erro ao carregar comentários:', commentsError);
        } else {
          setComments(commentsData || []);
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PromoBanner />
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <div className="grid grid-cols-4 gap-2">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="aspect-square" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <PromoBanner />
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button onClick={() => navigate("/produtos")}>
            Voltar aos produtos
          </Button>
        </div>
        <Footer />
      </div>
    );
  }


  const handleAddToCart = () => {
    try {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          brand: product.brand || 'Marca não informada',
          price: product.price,
          image: getProductImageUrl(product.image_url)
        });
      }
      
      // Notificação melhorada
      toast({
        title: "✅ Produto adicionado!",
        description: (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <p className="font-semibold">{quantity}x {product.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(product.price)} cada • Agora no seu carrinho
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

  const handleWhatsAppOrder = () => {
    const storeName = getSetting('store_name') || 'Minha Loja';
    const currentUrl = window.location.href;
    
    const message = `Olá! Gostaria de fazer um pedido desse item específico:\n\n` +
                   `*${product.name}*\n` +
                   `SKU: ${product.sku || 'N/A'}\n` +
                   `Preço: ${formatCurrency(product.price)}\n` +
                   `Loja: ${storeName}\n\n` +
                   `Link do produto: ${currentUrl}\n\n` +
                   `Aguardo informações sobre disponibilidade e formas de pagamento!`;
    
    const phoneNumber = getWhatsAppNumber();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const renderStars = (rating: number, size: string = "h-4 w-4") => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`${size} ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Header />
      
      <main className="container mx-auto px-4 py-8 overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm overflow-hidden">
          <div className="flex items-center gap-2 min-w-0 flex-shrink">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="p-0 h-auto font-normal text-muted-foreground hover:text-primary shrink-0"
            >
              Início
            </Button>
            <span className="text-muted-foreground shrink-0">/</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/produtos")}
              className="p-0 h-auto font-normal text-muted-foreground hover:text-primary shrink-0"
            >
              Produtos
            </Button>
            <span className="text-muted-foreground shrink-0">/</span>
            {product.category && (
              <>
                <span className="text-muted-foreground shrink-0">{product.category}</span>
                <span className="text-muted-foreground shrink-0">/</span>
              </>
            )}
            <span className="font-medium truncate">{product.name}</span>
          </div>
        </div>

        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 overflow-hidden">
          {/* Product Images */}
          <div className="space-y-4 min-w-0">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                {...createImageProps(
                  (() => {
                    const imageUrls = getProductImageUrls(product.image_url);
                    return imageUrls[selectedImage] || imageUrls[0];
                  })(),
                  product.name,
                  "w-full h-full object-cover"
                )}
              />
            </div>
            
            {/* Multiple Image Thumbnails */}
            {(() => {
              const imageUrls = getProductImageUrls(product.image_url);
              if (imageUrls.length > 1) {
                return (
                  <div className="grid grid-cols-4 gap-2">
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={url} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Product Info */}
          <div className="space-y-6 min-w-0">
            <div>
              {product.brand && (
                <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">{product.name}</h1>
              <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(averageRating)}
              </div>
              <span className="text-sm font-medium">
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
              </span>
              <span className="text-sm text-muted-foreground">({comments.length} avaliações)</span>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              {/* Original Price (if exists) */}
              {product.original_price && product.original_price !== product.price && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-medium">De:</span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </Badge>
                </div>
              )}

              {/* Current Price */}
              <div className="space-y-3">
                <div className="text-center md:text-left">
                  <span className="text-4xl md:text-5xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                {/* PIX Badge - Only when there's discount */}
                {product.original_price && product.original_price !== product.price && (
                  <div className="w-full">
                    <PixBadge
                      price={product.price}
                      originalPrice={product.original_price}
                      className="w-full text-lg"
                    />
                  </div>
                )}
              </div>

              {/* Payment Options */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 text-center">
                  ou <span className="font-semibold text-gray-800">10x de {formatCurrency(product.price / 10)}</span> sem juros
                </p>
                <p className="text-xs text-gray-500 text-center">
                  💳 Cartão de crédito • Parcelamento sem juros
                </p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <Badge className={`${product.in_stock ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`}>
                {product.in_stock ? '✅ Em Estoque' : '❌ Indisponível'}
              </Badge>
              {product.in_stock && (
                <span className="text-sm text-green-700 font-medium">
                  🚚 Entrega rápida • Últimas unidades disponíveis
                </span>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-base font-semibold text-gray-800">Quantidade:</label>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl border border-gray-200 p-1 max-w-40">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center font-bold text-lg min-w-[3rem] text-gray-800">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl" 
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  {product.in_stock ? (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-3" />
                      Produto Indisponível
                    </>
                  )}
                 </Button>
                 
                 <Button 
                   className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0" 
                   onClick={handleWhatsAppOrder}
                   disabled={!product.in_stock}
                 >
                   <WhatsAppIcon className="h-5 w-5 mr-3" />
                   Comprar pelo WhatsApp
                 </Button>
                 
                 {product.in_stock && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-green-700 font-bold">
                      <CheckCircle className="h-4 w-4" />
                      Compra 100% Segura e Protegida
                    </div>
                    <p className="text-xs text-green-600">
                      ✓ Entrega rápida ✓ Garantia ✓ Suporte especializado
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Frete Grátis</p>
                    <p className="text-sm text-muted-foreground">Para compras acima de R$ 299</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Compra Protegida</p>
                    <p className="text-sm text-muted-foreground">Garantia de 30 dias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações ({comments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Descrição do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                
                {product.benefits && product.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Principais Benefícios:</h4>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Reviews Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações dos Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {comments.length > 0 ? (
                    <div className="flex items-center gap-6 mb-6">
                      <div className="text-center">
                         <div className="text-4xl font-bold text-primary mb-1">
                           {averageRating.toFixed(1)}
                         </div>
                         <div className="flex justify-center mb-1">
                           {renderStars(averageRating)}
                         </div>
                        <div className="text-sm text-muted-foreground">
                          {comments.length} avaliação{comments.length !== 1 ? 'ões' : ''}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = comments.filter(comment => comment.rating === stars).length;
                          const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
                          
                          return (
                            <div key={stars} className="flex items-center gap-2 mb-1">
                              <span className="text-sm w-8">{stars}</span>
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 rounded-full h-2" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-8">
                                {Math.round(percentage)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Este produto ainda não possui avaliações.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              {comments.length > 0 && (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {comment.author_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{comment.author_name}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {renderStars(comment.rating, "h-3 w-3")}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {comment.comment_text}
                        </p>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span className="text-sm">{comment.likes}</span>
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              <span className="text-sm">{comment.dislikes}</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Produto;