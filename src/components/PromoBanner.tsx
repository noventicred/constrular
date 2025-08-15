import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Truck, Shield, CreditCard } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const PromoBanner = () => {
  const { getShowPromoBanner, getBannerText } = useSettings();

  if (!getShowPromoBanner()) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-construction-orange to-construction-orange/80 text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 text-sm font-medium">
          {getBannerText(1) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{getBannerText(1)}</span>
            </div>
          )}
          {getBannerText(2) && (
            <div className="hidden md:flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>{getBannerText(2)}</span>
            </div>
          )}
          {getBannerText(3) && (
            <div className="hidden lg:flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>{getBannerText(3)}</span>
            </div>
          )}
          {getBannerText(4) && (
            <div className="hidden lg:flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>{getBannerText(4)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;