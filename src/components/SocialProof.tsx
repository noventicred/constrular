import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Award, Headphones } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Clientes Satisfeitos",
    description: "Desde 2010"
  },
  {
    icon: Star,
    value: "4.9",
    label: "Avaliação Média",
    description: "Baseado em 12.000+ reviews"
  },
  {
    icon: Award,
    value: "15",
    label: "Anos de Mercado",
    description: "Experiência comprovada"
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Suporte",
    description: "Atendimento especializado"
  }
];

const SocialProof = () => {
  return (
    <section className="py-16 bg-construction-blue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Confiança que Constrói
          </h2>
          <p className="text-lg text-blue-100">
            Mais de uma década ajudando você a construir seus sonhos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-construction-orange" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-blue-100">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-construction-orange border-2 border-white"></div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-sm">Mais de 10.000 projetos realizados com sucesso</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;