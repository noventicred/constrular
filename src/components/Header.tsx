import { Search, Menu, Phone, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Cart from "./Cart";

const categories = [
  {
    name: "Cimento & Argamassa",
    icon: HardHat,
    color: "bg-blue-600"
  },
  {
    name: "Tijolos & Blocos",
    icon: Home,
    color: "bg-red-600"
  },
  {
    name: "Tintas & Vernizes",
    icon: Paintbrush,
    color: "bg-green-600"
  },
  {
    name: "Ferramentas",
    icon: Hammer,
    color: "bg-yellow-600"
  },
  {
    name: "Hidráulica",
    icon: Wrench,
    color: "bg-cyan-600"
  },
  {
    name: "Elétrica",
    icon: Zap,
    color: "bg-purple-600"
  },
  {
    name: "Madeiras",
    icon: TreePine,
    color: "bg-amber-700"
  },
  {
    name: "Transporte",
    icon: Truck,
    color: "bg-gray-600"
  },
  {
    name: "Pisos & Revestimentos",
    icon: Home,
    color: "bg-indigo-600"
  },
  {
    name: "Iluminação",
    icon: Zap,
    color: "bg-pink-600"
  }
];

const Header = () => {
  return (
    <header className="bg-background border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-construction-gray text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>Retire na Loja ou Receba em Casa</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Frete Grátis para São Paulo em compras acima de R$ 299</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              ConstrutorPro
            </h1>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Busque por cimento, tijolo, tinta..."
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Minha Conta
            </Button>
            
            <Cart />
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="construction" size="sm" className="gap-2">
                    Todas as Categorias
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-background border shadow-lg z-50" align="start">
                  {categories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <DropdownMenuItem key={index} className="cursor-pointer p-3 hover:bg-muted">
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="#" className="hover:text-primary transition-colors">Cimento e Argamassa</a>
                <a href="#" className="hover:text-primary transition-colors">Tijolos e Blocos</a>
                <a href="#" className="hover:text-primary transition-colors">Tintas</a>
                <a href="#" className="hover:text-primary transition-colors">Ferramentas</a>
                <a href="#" className="hover:text-primary transition-colors">Hidráulica</a>
                <a href="#" className="hover:text-primary transition-colors">Elétrica</a>
              </div>
            </div>
            
            <div className="hidden md:block text-sm text-muted-foreground">
              <span className="text-primary font-medium">Ofertas</span> até 50% OFF
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;