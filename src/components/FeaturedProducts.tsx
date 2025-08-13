import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    name: "Cimento CP II-E-32 50kg",
    brand: "Votorantim",
    price: 32.90,
    originalPrice: 39.90,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 156,
    discount: 18,
    inStock: true
  },
  {
    id: 2,
    name: "Tijolo 6 Furos 14x19x29cm",
    brand: "Cerâmica São José",
    price: 0.89,
    originalPrice: 1.20,
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 89,
    discount: 26,
    inStock: true
  },
  {
    id: 3,
    name: "Tinta Acrílica Premium 18L",
    brand: "Suvinil",
    price: 189.90,
    originalPrice: 249.90,
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 234,
    discount: 24,
    inStock: true
  },
  {
    id: 4,
    name: "Furadeira de Impacto 650W",
    brand: "Bosch",
    price: 299.90,
    originalPrice: 399.90,
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 67,
    discount: 25,
    inStock: false
  },
  {
    id: 5,
    name: "Tubo PVC 100mm 6m",
    brand: "Tigre",
    price: 89.90,
    originalPrice: 109.90,
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 123,
    discount: 18,
    inStock: true
  },
  {
    id: 6,
    name: "Fio Flexível 2,5mm 100m",
    brand: "Prysmian",
    price: 159.90,
    originalPrice: 189.90,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 98,
    discount: 16,
    inStock: true
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-16">
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
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  )}
                  
                  {/* Stock Status */}
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      product.inStock 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {product.inStock ? 'Em Estoque' : 'Indisponível'}
                  </Badge>
                  
                  {/* Wishlist Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  disabled={!product.inStock}
                  variant={product.inStock ? "default" : "outline"}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver Todos os Produtos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;