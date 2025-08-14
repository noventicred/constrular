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
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/produtos?categoria=${categoryId}`);
  };

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
    <section className="py-8 md:py-16 animate-fade-in bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Categorias
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Encontre o que precisa para sua obra com facilidade
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons - Only visible on desktop */}
          <Button
            variant="outline"
            size="sm"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border-2 hover:bg-white hover:scale-110 transition-all duration-300 hidden lg:flex items-center justify-center"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-xl border-2 hover:bg-white hover:scale-110 transition-all duration-300 hidden lg:flex items-center justify-center"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-hidden py-2" ref={emblaRef}>
            <div className="flex gap-3 md:gap-4 lg:gap-6 px-2">
              {categories.map((category, index) => {
                const Icon = iconMap[category.name] || Settings;
                const colorClass = colorMap[category.name] || "bg-primary";
                return (
                  <div
                    key={category.id}
                    className="flex-none w-[120px] sm:w-[140px] md:w-36 lg:w-40 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card 
                      className="group hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 border-2 hover:border-primary/40 h-[140px] sm:h-[150px] md:h-36 lg:h-40 bg-gradient-to-br from-white to-gray-50/50 hover:from-primary/5 hover:to-primary/10 backdrop-blur-sm"
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      <CardContent className="p-3 md:p-4 lg:p-5 text-center h-full flex flex-col justify-center items-center relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Icon/Image container */}
                        <div className="relative mb-3 md:mb-4">
                          {category.image_url ? (
                            <div className="relative">
                              <img 
                                src={category.image_url} 
                                alt={category.name}
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl object-cover mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          ) : (
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 ${colorClass} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg ring-2 ring-white/50 group-hover:shadow-xl relative overflow-hidden`}>
                              {/* Shimmer effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                              <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white relative z-10" />
                            </div>
                          )}
                          
                          {/* Pulse ring */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        </div>
                        
                        {/* Category name */}
                        <h3 className="font-bold text-xs sm:text-sm md:text-base text-center leading-tight line-clamp-2 text-gray-800 group-hover:text-primary transition-colors duration-300 relative z-10">
                          {category.name}
                        </h3>
                        
                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-primary to-primary/60 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-t-full" />
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile scroll indicator */}
          <div className="flex justify-center mt-6 lg:hidden">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
              Deslize para ver mais categorias
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;