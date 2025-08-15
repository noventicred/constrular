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
  "Cimento & Argamassa": "bg-primary",
  "Tijolos & Blocos": "bg-primary",
  "Tintas & Vernizes": "bg-primary",
  "Ferramentas": "bg-primary",
  "Hidráulica": "bg-primary",
  "Elétrica": "bg-primary",
  "Madeiras": "bg-primary",
  "Transporte": "bg-primary",
  "Pisos & Revestimentos": "bg-primary",
  "Iluminação": "bg-primary",
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    dragFree: true,
    containScroll: 'trimSnaps',
    align: 'start'
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
      <section className="py-12 md:py-20 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-48 h-8 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-80 h-4 bg-muted/70 rounded mx-auto animate-pulse" />
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex gap-6 px-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-none">
                  <div className="w-40 h-48 bg-gradient-to-br from-muted via-muted/70 to-muted rounded-2xl animate-pulse" 
                       style={{ animationDelay: `${i * 100}ms` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Explore nossas categorias
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Categorias
          </h2>
          <p className="text-muted-foreground/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Encontre o que precisa para sua obra com facilidade
          </p>
        </div>

        <div className="relative group">
          {/* Enhanced Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-xl bg-background/95 backdrop-blur-sm shadow-2xl border border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-110 transition-all duration-300 hidden lg:flex items-center justify-center group-hover:opacity-100 opacity-80"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-xl bg-background/95 backdrop-blur-sm shadow-2xl border border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-110 transition-all duration-300 hidden lg:flex items-center justify-center group-hover:opacity-100 opacity-80"
            onClick={scrollNext}
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </Button>

          {/* Modern Carousel Container */}
          <div className="overflow-hidden py-4" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6 lg:gap-8 px-2">
              {categories.map((category, index) => {
                const Icon = iconMap[category.name] || Settings;
                const colorClass = colorMap[category.name] || "bg-primary";
                return (
                  <div
                    key={category.id}
                    className="flex-none w-[160px] md:w-[180px] lg:w-[200px] animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Card 
                      className="group/card hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-700 cursor-pointer hover:-translate-y-3 border border-border/50 hover:border-primary/30 h-[200px] md:h-[220px] lg:h-[240px] bg-gradient-to-br from-background via-background/95 to-muted/20 hover:from-primary/5 hover:via-primary/3 hover:to-primary/8 backdrop-blur-sm relative overflow-hidden"
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      <CardContent className="p-6 text-center h-full flex flex-col justify-center items-center relative">
                        {/* Animated background patterns */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform group-hover/card:scale-110" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-3xl opacity-0 group-hover/card:opacity-100 transition-all duration-500 delay-100" />
                        
                        {/* Icon/Image container with enhanced styling */}
                        <div className="relative mb-5 group-hover/card:mb-4 transition-all duration-500">
                          {category.image_url ? (
                            <div className="relative">
                              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-1">
                                <img 
                                  src={category.image_url} 
                                  alt={category.name}
                                  className="w-full h-full rounded-xl object-cover group-hover/card:scale-105 transition-all duration-500 shadow-lg"
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-all duration-700 blur-lg" />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className={`w-20 h-20 md:w-24 md:h-24 ${colorClass} rounded-2xl flex items-center justify-center group-hover/card:scale-105 transition-all duration-500 shadow-lg relative overflow-hidden`}>
                                {/* Enhanced shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 delay-200" />
                                <Icon className="h-9 w-9 md:h-11 md:w-11 text-white relative z-10 drop-shadow-sm" />
                              </div>
                              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-all duration-700 blur-lg" />
                            </div>
                          )}
                          
                          {/* Enhanced pulse rings */}
                          <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20 scale-100 group-hover/card:scale-125 group-hover/card:ring-primary/40 opacity-0 group-hover/card:opacity-100 transition-all duration-700" />
                          <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/30 scale-100 group-hover/card:scale-150 opacity-0 group-hover/card:opacity-60 transition-all duration-1000 delay-200" />
                        </div>
                        
                        {/* Enhanced category name */}
                        <h3 className="font-bold text-sm md:text-base lg:text-lg text-center leading-tight line-clamp-2 text-foreground/90 group-hover/card:text-primary transition-colors duration-500 relative z-10 mb-2">
                          {category.name}
                        </h3>
                        
                        {/* Subtitle effect */}
                        <p className="text-xs text-muted-foreground/60 opacity-0 group-hover/card:opacity-100 transition-all duration-500 delay-100 transform translate-y-2 group-hover/card:translate-y-0">
                          Explorar produtos
                        </p>
                        
                        {/* Enhanced bottom accent */}
                        <div className="absolute bottom-0 left-1/2 w-0 h-1.5 bg-gradient-to-r from-primary via-primary/80 to-secondary group-hover/card:w-full group-hover/card:left-0 transition-all duration-700 rounded-t-full" />
                        <div className="absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r from-primary/60 to-secondary/60 group-hover/card:w-full group-hover/card:left-0 transition-all duration-700 delay-100" />
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced mobile scroll indicator */}
          <div className="flex justify-center mt-8 lg:hidden">
            <div className="flex items-center gap-3 text-sm text-muted-foreground/80 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50 shadow-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary/70 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
              <span className="font-medium">Deslize para ver mais</span>
              <ChevronRight className="h-4 w-4 text-primary/60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;