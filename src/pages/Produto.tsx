import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  ArrowLeft,
  Plus,
  Minus,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
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
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);

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
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        brand: product.brand || 'Marca não informada',
        price: product.price,
        image: product.image_url
      });
    }
    
    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.name} adicionado ao carrinho.`,
    });
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
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="p-0 h-auto font-normal text-muted-foreground hover:text-primary"
          >
            Início
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/produtos")}
            className="p-0 h-auto font-normal text-muted-foreground hover:text-primary"
          >
            Produtos
          </Button>
          <span className="text-muted-foreground">/</span>
          {product.category && (
            <>
              <span className="text-muted-foreground">{product.category}</span>
              <span className="text-muted-foreground">/</span>
            </>
          )}
          <span className="font-medium">{product.name}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              )}
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.sku && (
                <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({comments.length} avaliações)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.original_price)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                ou 10x de {formatCurrency(product.price / 10)} sem juros
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Badge className={product.in_stock ? 'bg-green-500' : 'bg-red-500'}>
                {product.in_stock ? 'Em Estoque' : 'Indisponível'}
              </Badge>
              {product.in_stock && (
                <span className="text-sm text-muted-foreground">
                  Últimas unidades disponíveis
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Quantidade:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Frete Grátis</p>
                    <p className="text-sm text-muted-foreground">Para compras acima de R$ 199</p>
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
                          {(comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length).toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-1">
                          {renderStars(comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length)}
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
    </div>
  );
};

export default Produto;