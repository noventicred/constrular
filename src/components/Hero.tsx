import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";
import heroImage from "@/assets/construction-hero.jpg";
const Hero = () => {
  return <section className="relative w-full h-[850px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`
    }} />
      
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
            
          </div>
        </div>
        
        {/* Floating offer card */}
        
      </div>
    </section>;
};
export default Hero;