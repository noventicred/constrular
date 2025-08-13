import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Percent, Clock, ShoppingCart, Star } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

const products = [
  {
    id: 1,
    name: "Cimento Portland CP II-E-32",
    description: "Saco 50kg - Ideal para obras em geral",
    originalPrice: 25.90,
    salePrice: 18.13,
    discount: 30,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 245,
    inStock: true,
    category: "Cimento"
  },
  {
    id: 2,
    name: "Kit Ferramentas Básicas",
    description: "Martelo + Furadeira + Chaves de fenda",
    originalPrice: 299.90,
    salePrice: 199.90,
    discount: 33,
    image: "/placeholder.svg",
    rating: 4.6,
    reviews: 128,
    inStock: true,
    category: "Ferramentas"
  },
  {
    id: 3,
    name: "Tinta Acrílica Premium",
    description: "18L - Branco Neve - Cobertura superior",
    originalPrice: 179.90,
    salePrice: 119.93,
    discount: 33,
    image: "/placeholder.svg",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    category: "Tintas"
  },
  {
    id: 4,
    name: "Tijolo Cerâmico 6 Furos",
    description: "9x14x19cm - Milheiro",
    originalPrice: 890.00,
    salePrice: 623.00,
    discount: 30,
    image: "/placeholder.svg",
    rating: 4.7,
    reviews: 67,
    inStock: true,
    category: "Tijolos"
  },
  {
    id: 5,
    name: "Argamassa Colante AC-I",
    description: "Saco 20kg - Para pisos e azulejos",
    originalPrice: 45.90,
    salePrice: 32.13,
    discount: 30,
    image: "/placeholder.svg",
    rating: 4.5,
    reviews: 156,
    inStock: true,
    category: "Argamassa"
  },
  {
    id: 6,
    name: "Parafusadeira com Bateria",
    description: "18V Li-ion + Kit 50 bits",
    originalPrice: 249.90,
    salePrice: 174.93,
    discount: 30,
    image: "/placeholder.svg",
    rating: 4.8,
    reviews: 93,
    inStock: true,
    category: "Ferramentas"
  }
];

const SpecialOffers = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Percent className="h-6 w-6 text-construction-orange" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Ofertas Especiais
            </h2>
          </div>
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
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1">
                          {product.discount}% OFF
                        </Badge>
                        <div className="absolute bottom-4 right-4 bg-white/90 rounded-full p-2">
                          <Clock className="h-4 w-4 text-construction-orange" />
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews})
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-2 group-hover:text-construction-orange transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {product.description}
                        </p>
                        
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Economize {formatPrice(product.originalPrice - product.salePrice)}
                            </Badge>
                          </div>
                          <span className="text-2xl font-bold text-construction-orange">
                            {formatPrice(product.salePrice)}
                          </span>
                        </div>
                        
                        <Button className="w-full group-hover:scale-105 transition-transform">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar ao Carrinho
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
      </div>
    </section>
  );
};

export default SpecialOffers;