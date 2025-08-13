import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, Award, Headphones, Trophy, Shield, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Clientes Satisfeitos",
    description: "Construtores confiando em nós"
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
    <section className="py-20 bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-construction-orange/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-construction-orange/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-construction-orange/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-construction-orange/10 rounded-full px-6 py-3 mb-6">
            <Trophy className="h-5 w-5 text-construction-orange" />
            <span className="text-sm font-semibold text-construction-orange">Líderes do Mercado</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Mais de uma década construindo
            <br />
            <span className="text-construction-orange">confiança e qualidade</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Nossa experiência e dedicação fazem a diferença em cada projeto
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="group bg-white/90 backdrop-blur-sm border border-construction-orange/10 shadow-lg hover:shadow-2xl hover:shadow-construction-orange/20 transition-all duration-500 hover:-translate-y-3 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8 text-center relative">
                {/* Orange gradient background for icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-construction-orange to-orange-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="text-4xl lg:text-5xl font-bold mb-3 text-gray-900 group-hover:text-construction-orange transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="font-bold text-lg mb-2 text-gray-800">{stat.label}</div>
                <div className="text-sm text-gray-600 leading-relaxed">{stat.description}</div>
                
                {/* Orange hover effect line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-construction-orange to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border border-construction-orange/20 shadow-xl hover:shadow-2xl hover:shadow-construction-orange/10 transition-all duration-500 overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="flex -space-x-3 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-construction-orange to-orange-400 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold"
                      >
                        {i === 3 ? <Star className="h-5 w-5 fill-current" /> : String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-construction-orange" />
                    ))}
                  </div>
                </div>
                
                <div className="text-center lg:text-left flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Avaliação 5 estrelas de nossos clientes
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    "Mais de 10.000 projetos realizados com sucesso. Nossa qualidade e atendimento 
                    fazem a diferença em cada obra."
                  </p>
                  <div className="flex items-center gap-6 justify-center lg:justify-start">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-construction-orange/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-construction-orange" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Garantia de Qualidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-construction-orange/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-construction-orange" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Entrega no Prazo</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;