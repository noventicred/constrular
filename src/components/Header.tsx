import { Search, Menu, Phone, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Cart from "./Cart";

const categories = [
  "Cimento & Argamassa",
  "Tijolos & Blocos",
  "Tintas & Vernizes",
  "Ferramentas",
  "Hidráulica",
  "Elétrica",
  "Madeiras",
  "Transporte",
  "Pisos & Revestimentos",
  "Iluminação",
  "Acessórios",
  "Segurança"
];

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="construction" size="sm" className="gap-2">
                      Todas as Categorias
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 bg-background border shadow-lg z-50 grid grid-cols-2 gap-1 p-2" align="start">
                    {categories.map((category, index) => (
                      <DropdownMenuItem key={index} className="cursor-pointer p-3 hover:bg-muted rounded-md">
                        <span className="text-sm font-medium w-full">{category}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="#" className="hover:text-primary transition-colors">Sobre Nós</a>
                <a href="#" className="hover:text-primary transition-colors">Contato</a>
                <a href="#" className="hover:text-primary transition-colors">Entrega</a>
                <a href="#" className="hover:text-primary transition-colors">Trocas e Devoluções</a>
                <a href="#" className="hover:text-primary transition-colors">Atendimento</a>
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