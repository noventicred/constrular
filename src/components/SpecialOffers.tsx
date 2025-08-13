import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Percent, Clock } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "Mega Promoção Cimento",
    description: "Até 30% OFF em todos os cimentos",
    discount: "30% OFF",
    image: "/placeholder.svg",
    validUntil: "Válido até 31/12",
    bgColor: "bg-red-500"
  },
  {
    id: 2,
    title: "Kit Ferramentas",
    description: "3 ferramentas por R$ 199",
    discount: "Super Oferta",
    image: "/placeholder.svg",
    validUntil: "Oferta especial",
    bgColor: "bg-green-500"
  },
  {
    id: 3,
    title: "Tintas Premium",
    description: "Compre 2 leve 3 em tintas selecionadas",
    discount: "Leve 3",
    image: "/placeholder.svg",
    validUntil: "Por tempo limitado",
    bgColor: "bg-blue-500"
  }
];

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Percent className="h-6 w-6 text-construction-orange" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Ofertas Especiais
            </h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Aproveite nossos descontos exclusivos por tempo limitado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <Card 
              key={offer.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className={`absolute top-4 left-4 ${offer.bgColor} text-white font-bold px-3 py-1`}>
                    {offer.discount}
                  </Badge>
                  <div className="absolute bottom-4 right-4 bg-white/90 rounded-full p-2">
                    <Clock className="h-4 w-4 text-construction-orange" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-construction-orange transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {offer.description}
                  </p>
                  <p className="text-sm text-construction-orange font-medium mb-4">
                    {offer.validUntil}
                  </p>
                  <Button className="w-full group-hover:scale-105 transition-transform">
                    Ver Oferta
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;