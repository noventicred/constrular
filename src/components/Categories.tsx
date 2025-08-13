import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Hammer, 
  Paintbrush, 
  Wrench, 
  Zap, 
  Home, 
  TreePine,
  Truck,
  HardHat
} from "lucide-react";
import { useCallback } from "react";

const categories = [
  {
    name: "Cimento & Argamassa",
    icon: HardHat,
    color: "bg-blue-600"
  },
  {
    name: "Tijolos & Blocos",
    icon: Home,
    color: "bg-red-600"
  },
  {
    name: "Tintas & Vernizes",
    icon: Paintbrush,
    color: "bg-green-600"
  },
  {
    name: "Ferramentas",
    icon: Hammer,
    color: "bg-yellow-600"
  },
  {
    name: "Hidráulica",
    icon: Wrench,
    color: "bg-cyan-600"
  },
  {
    name: "Elétrica",
    icon: Zap,
    color: "bg-purple-600"
  },
  {
    name: "Madeiras",
    icon: TreePine,
    color: "bg-amber-700"
  },
  {
    name: "Transporte",
    icon: Truck,
    color: "bg-gray-600"
  },
  {
    name: "Pisos & Revestimentos",
    icon: Home,
    color: "bg-indigo-600"
  },
  {
    name: "Iluminação",
    icon: Zap,
    color: "bg-pink-600"
  }
];

const Categories = () => {
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

  return (
    <section className="py-16 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Categorias
          </h2>
          <p className="text-muted-foreground">
            Encontre o que precisa para sua obra
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
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={index}
                    className="flex-none w-32 md:w-36 animate-fade-in hover-scale"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-construction-orange/30 h-24 md:h-28">
                      <CardContent className="p-3 md:p-4 text-center h-full flex flex-col justify-center">
                        <div className={`w-12 h-12 md:w-14 md:h-14 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-xs md:text-sm text-center leading-tight line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center">
                          {category.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile scroll indicator */}
          <div className="flex justify-center mt-4 md:hidden">
            <div className="text-xs text-muted-foreground">
              ← Deslize para ver mais →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;