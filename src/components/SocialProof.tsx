import { Card, CardContent } from "@/components/ui/card";
import { Truck, Shield, CreditCard, Headphones, Award, Star, Users, CheckCircle } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Entregamos em toda região metropolitana em até 24h",
    highlight: "Frete Grátis*"
  },
  {
    icon: Shield,
    title: "Garantia Total",
    description: "Todos os produtos com garantia de fábrica completa",
    highlight: "100% Seguro"
  },
  {
    icon: CreditCard,
    title: "Parcelamento",
    description: "Parcele suas compras em até 12x sem juros",
    highlight: "Sem Juros"
  },
  {
    icon: Headphones,
    title: "Suporte Expert",
    description: "Atendimento especializado para suas obras",
    highlight: "24/7 Online"
  }
];

const testimonials = [
  {
    name: "João Silva",
    role: "Construtor",
    comment: "Preços justos e entrega sempre no prazo. Já fiz mais de 10 obras com eles.",
    rating: 5
  },
  {
    name: "Maria Santos",
    role: "Arquiteta",
    comment: "Qualidade excepcional dos materiais. Recomendo para todos os meus clientes.",
    rating: 5
  },
  {
    name: "Pedro Costa",
    role: "Engenheiro",
    comment: "Atendimento nota 10! Sempre me ajudam a escolher os melhores produtos.",
    rating: 5
  }
];

const SocialProof = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-orange-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-construction-orange/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-construction-orange/5 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        {/* Benefits Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-construction-orange/10 rounded-full px-6 py-3 mb-6">
            <Award className="h-5 w-5 text-construction-orange" />
            <span className="text-sm font-semibold text-construction-orange">Por que escolher a gente?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Sua obra merece o
            <br />
            <span className="text-construction-orange">melhor atendimento</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Oferecemos mais do que produtos - oferecemos uma experiência completa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="group bg-white border border-gray-200 shadow-lg hover:shadow-2xl hover:shadow-construction-orange/10 transition-all duration-500 hover:-translate-y-3 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-construction-orange to-orange-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="inline-block bg-construction-orange/10 text-construction-orange text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {benefit.highlight}
                </div>
                
                <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-construction-orange transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-construction-orange to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-5xl font-bold text-construction-orange mb-2">15K+</div>
            <div className="text-gray-600">Clientes Satisfeitos</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-construction-orange mb-2">4.9</div>
            <div className="text-gray-600">Avaliação Média</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-construction-orange mb-2">24h</div>
            <div className="text-gray-600">Entrega Rápida</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            O que nossos clientes dizem
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current text-construction-orange" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-construction-orange to-orange-400 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-gray-700">Compra Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-gray-700">SSL Certificado</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Atendimento Humano</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;