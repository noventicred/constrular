import { Search, Menu, Phone, MapPin, ChevronDown, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
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
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                
                <div className="p-6 space-y-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar produtos..."
                      className="pl-10"
                    />
                  </div>

                  {/* Mobile Categories */}
                  <div className="space-y-4">
                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 h-auto"
                        onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      >
                        <span className="text-lg font-medium">Todas as Categorias</span>
                        <ChevronRight className={`h-5 w-5 transition-transform ${isCategoriesOpen ? 'rotate-90' : ''}`} />
                      </Button>
                      
                      {isCategoriesOpen && (
                        <div className="mt-4 ml-4 space-y-3 animate-fade-in">
                          {categories.map((category, index) => (
                            <a
                              key={index}
                              href="#"
                              className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="space-y-4 border-t pt-4">
                      <a 
                        href="/produtos" 
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Produtos
                      </a>
                      <a 
                        href="#" 
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sobre Nós
                      </a>
                      <a 
                        href="#" 
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Contato
                      </a>
                      <a 
                        href="#" 
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Entrega
                      </a>
                      <a 
                        href="#" 
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Trocas e Devoluções
                      </a>
                      <a 
                        href="#" 
                        className="block text-lg font-medium hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Atendimento
                      </a>
                    </div>

                    {/* Mobile Account */}
                    <div className="border-t pt-4">
                      <Button 
                        variant="construction" 
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Minha Conta
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
                <a href="/produtos" className="hover:text-primary transition-colors">Produtos</a>
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