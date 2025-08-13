import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Truck, Shield, CreditCard } from "lucide-react";

const PromoBanner = () => {
  return (
    <section className="bg-gradient-to-r from-construction-orange to-construction-orange/80 text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Entrega em até 24h</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Frete Grátis acima de R$ 299</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Compra 100% Segura</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>12x sem juros</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;