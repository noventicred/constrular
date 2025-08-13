import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";
import heroImage from "@/assets/construction-hero.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-background to-muted">
      {/* Hero Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Tudo para sua
                <span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                  Construção
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Os melhores materiais de construção com preços imbatíveis. 
                Qualidade garantida e entrega rápida para toda São Paulo.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8">
                Ver Ofertas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Catálogo Completo
              </Button>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Entrega Rápida</h3>
                  <p className="text-sm text-muted-foreground">Em até 24h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Garantia Total</h3>
                  <p className="text-sm text-muted-foreground">Produtos certificados</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Pagamento Fácil</h3>
                  <p className="text-sm text-muted-foreground">Até 12x sem juros</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right content - Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Materiais de construção - Cimento, tijolos e ferramentas"
                className="w-full h-[600px] object-cover"
              />
            </div>
            
            {/* Floating offer card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl border">
              <div className="text-3xl font-bold text-primary">50% OFF</div>
              <div className="text-sm text-muted-foreground">Em tintas selecionadas</div>
              <Button variant="construction" size="sm" className="mt-2">
                Ver Ofertas
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;