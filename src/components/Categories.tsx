import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Hammer, 
  Paintbrush, 
  Wrench, 
  Zap, 
  Home, 
  TreePine,
  Truck,
  HardHat
} from "lucide-react";

const categories = [
  {
    name: "Cimento & Argamassa",
    icon: HardHat,
    description: "Cimentos, argamassas e aditivos",
    color: "bg-blue-500"
  },
  {
    name: "Tijolos & Blocos",
    icon: Home,
    description: "Tijolos, blocos e cerâmicas",
    color: "bg-red-500"
  },
  {
    name: "Tintas & Vernizes",
    icon: Paintbrush,
    description: "Tintas, vernizes e texturas",
    color: "bg-green-500"
  },
  {
    name: "Ferramentas",
    icon: Hammer,
    description: "Ferramentas manuais e elétricas",
    color: "bg-yellow-500"
  },
  {
    name: "Hidráulica",
    icon: Wrench,
    description: "Tubos, conexões e registros",
    color: "bg-cyan-500"
  },
  {
    name: "Elétrica",
    icon: Zap,
    description: "Fios, cabos e componentes",
    color: "bg-purple-500"
  },
  {
    name: "Madeiras",
    icon: TreePine,
    description: "Madeiras e compensados",
    color: "bg-amber-600"
  },
  {
    name: "Transporte",
    icon: Truck,
    description: "Carrinho, baldes e recipientes",
    color: "bg-gray-500"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-muted/30 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Categorias de Produtos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre tudo que precisa para sua obra, desde o alicerce até o acabamento
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Produtos
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;