import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";
import heroImage from "@/assets/construction-hero.jpg";

const Hero = () => {
  return (
    <section className="relative w-full h-[850px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`
        }}
      />
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          {/* Left content */}
          <div className="space-y-6 md:space-y-8 lg:col-span-2">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                Tudo para sua
                <span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                  Construção
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-lg mx-auto lg:mx-0">
                Os melhores materiais de construção com preços imbatíveis. 
                Qualidade garantida e entrega rápida para toda São Paulo.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-base md:text-lg px-6 md:px-8">
                Ver Ofertas
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
                Catálogo Completo
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 justify-items-center lg:justify-items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Truck className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-white">Entrega Rápida</h3>
                  <p className="text-xs md:text-sm text-white/80">Em até 24h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-white">Garantia Total</h3>
                  <p className="text-xs md:text-sm text-white/80">Produtos certificados</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-white">Pagamento Fácil</h3>
                  <p className="text-xs md:text-sm text-white/80">Até 12x sem juros</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating offer card */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white p-4 md:p-6 rounded-lg shadow-xl border">
          <div className="text-xl md:text-2xl xl:text-3xl font-bold text-primary">50% OFF</div>
          <div className="text-xs md:text-sm text-muted-foreground">Em tintas selecionadas</div>
          <Button variant="construction" size="sm" className="mt-2 text-xs md:text-sm">
            Ver Ofertas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;