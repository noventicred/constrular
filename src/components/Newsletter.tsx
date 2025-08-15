import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Gift, ArrowRight } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-construction-orange to-construction-orange/80 text-white overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="p-6 md:p-8 lg:p-12">
                <div className="flex items-center gap-2 md:gap-3 mb-4">
                  <Gift className="h-6 w-6 md:h-8 md:w-8" />
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                    Ofertas Exclusivas
                  </h2>
                </div>
                <p className="text-sm md:text-base lg:text-lg mb-6 text-primary-foreground/90">
                  Cadastre-se e receba ofertas especiais, dicas de construção e lançamentos em primeira mão.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <Input 
                      placeholder="Seu melhor e-mail"
                      className="pl-10 md:pl-12 h-10 md:h-12 bg-white text-gray-900 border-0 text-sm md:text-base"
                    />
                  </div>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="bg-white text-construction-orange hover:bg-gray-100 hover-scale h-10 md:h-12 text-sm md:text-base px-4 md:px-6"
                  >
                    Cadastrar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <p className="text-xs md:text-sm text-primary-foreground/80 mt-3">
                  🎁 Ganhe 10% de desconto na primeira compra
                </p>
              </div>
              
              <div className="hidden lg:block p-6 md:p-8">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold">15%</div>
                    <div className="text-xs md:text-sm">Desconto Médio</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold">2x</div>
                    <div className="text-xs md:text-sm">Por Semana</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold">30K+</div>
                    <div className="text-xs md:text-sm">Inscritos</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 text-center">
                    <div className="text-xl md:text-2xl font-bold">VIP</div>
                    <div className="text-xs md:text-sm">Acesso</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Newsletter;