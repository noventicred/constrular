import { useState, useEffect } from "react";
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
  HardHat,
  Settings
} from "lucide-react";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

// Mapeamento de ícones para categorias
const iconMap: Record<string, any> = {
  "Cimento & Argamassa": HardHat,
  "Tijolos & Blocos": Home,
  "Tintas & Vernizes": Paintbrush,
  "Ferramentas": Hammer,
  "Hidráulica": Wrench,
  "Elétrica": Zap,
  "Madeiras": TreePine,
  "Transporte": Truck,
  "Pisos & Revestimentos": Home,
  "Iluminação": Zap,
};

// Cores para categorias
const colorMap: Record<string, string> = {
  "Cimento & Argamassa": "bg-gray-600",
  "Tijolos & Blocos": "bg-red-600",
  "Tintas & Vernizes": "bg-green-600",
  "Ferramentas": "bg-amber-600",
  "Hidráulica": "bg-slate-600",
  "Elétrica": "bg-yellow-600",
  "Madeiras": "bg-amber-700",
  "Transporte": "bg-stone-600",
  "Pisos & Revestimentos": "bg-neutral-600",
  "Iluminação": "bg-orange-500",
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null) // Only get top-level categories
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as categorias.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi]);

  if (loading) {
    return (
      <section className="py-16 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Categorias
            </h2>
            <p className="text-muted-foreground">
              Carregando categorias...
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          <div className="overflow-hidden py-2" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6 px-1">
              {categories.map((category, index) => {
                const Icon = iconMap[category.name] || Settings;
                const colorClass = colorMap[category.name] || "bg-gray-600";
                return (
                  <div
                    key={category.id}
                    className="flex-none w-32 md:w-36 animate-fade-in hover-scale"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-construction-orange/30 h-28 md:h-32">
                      <CardContent className="p-4 md:p-5 text-center h-full flex flex-col justify-center items-center">
                        {category.image_url ? (
                          <img 
                            src={category.image_url} 
                            alt={category.name}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                          />
                        ) : (
                          <div className={`w-12 h-12 md:w-14 md:h-14 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg aspect-square`}>
                            <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                          </div>
                        )}
                        <h3 className="font-semibold text-xs md:text-sm text-center leading-tight line-clamp-2">
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