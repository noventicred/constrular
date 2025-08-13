import { useState } from "react";
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

// Mock product data - in a real app this would come from an API
const products = {
  1: {
    id: 1,
    name: "Cimento CP II-E-32 50kg",
    brand: "Votorantim",
    price: 32.90,
    originalPrice: 39.90,
    rating: 4.8,
    reviews: 156,
    discount: 18,
    inStock: true,
    sku: "CIM-VOT-50KG",
    category: "Cimento & Argamassa",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    description: "Cimento Portland CP II-E-32 da Votorantim, ideal para obras em geral. Oferece alta resistência e durabilidade, perfeito para fundações, pilares, vigas e lajes. Formulação especial que garante excelente aderência e trabalhabilidade.",
    specifications: {
      "Peso": "50kg",
      "Tipo": "CP II-E-32",
      "Marca": "Votorantim",
      "Resistência": "32 MPa",
      "Validade": "3 meses",
      "Origem": "Nacional"
    },
    benefits: [
      "Alta resistência e durabilidade",
      "Excelente aderência",
      "Boa trabalhabilidade",
      "Certificado ABNT",
      "Ideal para diversas aplicações"
    ]
  }
};

const productReviews = [
  {
    id: 1,
    user: "João Silva",
    avatar: "/placeholder.svg",
    rating: 5,
    date: "15/01/2024",
    title: "Excelente qualidade",
    comment: "Cimento de primeira qualidade, usei na minha obra e o resultado foi excepcional. Muito boa aderência e secagem uniforme.",
    helpful: 12,
    notHelpful: 1
  },
  {
    id: 2,
    user: "Maria Santos",
    avatar: "/placeholder.svg",
    rating: 4,
    date: "10/01/2024",
    title: "Bom custo-benefício",
    comment: "Produto chegou bem embalado e dentro do prazo. A qualidade está dentro do esperado para o preço pago.",
    helpful: 8,
    notHelpful: 0
  },
  {
    id: 3,
    user: "Carlos Mendes",
    avatar: "/placeholder.svg",
    rating: 5,
    date: "05/01/2024",
    title: "Recomendo!",
    comment: "Já comprei várias vezes e sempre com a mesma qualidade. Entrega rápida e produto bem conservado.",
    helpful: 15,
    notHelpful: 2
  },
  {
    id: 4,
    user: "Ana Costa",
    avatar: "/placeholder.svg",
    rating: 4,
    date: "02/01/2024",
    title: "Produto conforme descrito",
    comment: "Cimento chegou conforme a descrição, bem embalado. Usei para fazer uma laje e ficou perfeito.",
    helpful: 6,
    notHelpful: 0
  }
];

const Produto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const product = products[Number(id) as keyof typeof products];
  
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
        brand: product.brand,
        price: product.price,
        image: product.images[0]
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
          <span className="text-muted-foreground">{product.category}</span>
          <span className="text-muted-foreground">/</span>
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
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} avaliações)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                ou 10x de R$ {(product.price / 10).toFixed(2)} sem juros
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Badge className={product.inStock ? 'bg-green-500' : 'bg-red-500'}>
                {product.inStock ? 'Em Estoque' : 'Indisponível'}
              </Badge>
              {product.inStock && (
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
                  disabled={!product.inStock}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="specifications">Especificações</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações ({product.reviews})</TabsTrigger>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Especificações Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
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
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-1">
                        {product.rating}
                      </div>
                      <div className="flex justify-center mb-1">
                        {renderStars(product.rating)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.reviews} avaliações
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2 mb-1">
                          <span className="text-sm w-8">{stars}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 rounded-full h-2" 
                              style={{ 
                                width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {productReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.user}</span>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="font-semibold">{review.title}</span>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">
                            {review.comment}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Útil ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              ({review.notHelpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Produto;