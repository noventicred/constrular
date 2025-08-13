import { Search, Menu, Phone, MapPin, ChevronDown, ChevronRight, X, Package, Info, MessageCircle, Truck, RefreshCw, Headphones, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
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
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
            <Link to={isAdmin ? "/admin" : "/"} className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-primary">
                ConstrutorPro
              </h1>
            </Link>
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                    <User className="h-4 w-4" />
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Minha Conta
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Painel Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => {
                    console.log('Desktop logout clicked');
                    try {
                      const { error } = await signOut();
                      console.log('Logout result:', { error });
                      if (error) {
                        console.error('Logout error:', error);
                        toast({
                          title: 'Erro',
                          description: error.message,
                          variant: 'destructive',
                        });
                      } else {
                        console.log('Logout successful, navigating to home');
                        toast({
                          title: 'Sucesso',
                          description: 'Logout realizado com sucesso!',
                        });
                        navigate('/');
                      }
                    } catch (err) {
                      console.error('Logout exception:', err);
                    }
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate('/auth')}>
                <User className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            )}
            
            <Cart />
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-background to-muted/20">
                <SheetHeader className="p-6 border-b bg-primary/5">
                  <SheetTitle className="text-xl font-bold text-primary">Menu</SheetTitle>
                </SheetHeader>
                
                <div className="p-0">
                  {/* Mobile Search */}
                  <div className="p-6 border-b bg-muted/30">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar produtos..."
                        className="pl-10 bg-background/80 border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Mobile Categories */}
                  <div className="p-6 border-b">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/20"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Todas as Categorias</span>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-primary transition-transform ${isCategoriesOpen ? 'rotate-90' : ''}`} />
                    </Button>
                    
                    {isCategoriesOpen && (
                      <div className="mt-4 ml-8 space-y-2 animate-fade-in">
                        {categories.map((category, index) => (
                          <button
                            key={index}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-primary/5 w-full text-left"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="p-6 space-y-1">
                    <Link 
                      to="/produtos" 
                      className="flex items-center gap-3 p-4 text-lg font-medium hover:text-primary transition-colors rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-5 w-5 text-primary" />
                      Produtos
                    </Link>
                    <button 
                      className="flex items-center gap-3 p-4 text-lg font-medium hover:text-primary transition-colors rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 w-full text-left"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Info className="h-5 w-5 text-primary" />
                      Sobre Nós
                    </button>
                    <button 
                      className="flex items-center gap-3 p-4 text-lg font-medium hover:text-primary transition-colors rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 w-full text-left"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Contato
                    </button>
                    <button 
                      className="flex items-center gap-3 p-4 text-lg font-medium hover:text-primary transition-colors rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 w-full text-left"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Truck className="h-5 w-5 text-primary" />
                      Entrega
                    </button>
                    <button 
                      className="flex items-center gap-3 p-4 text-lg font-medium hover:text-primary transition-colors rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 w-full text-left"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <RefreshCw className="h-5 w-5 text-primary" />
                      Trocas e Devoluções
                    </button>
                    <button 
                      className="flex items-center gap-3 p-4 text-lg font-medium hover:text-primary transition-colors rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 w-full text-left"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Headphones className="h-5 w-5 text-primary" />
                      Atendimento
                    </button>
                  </div>

                  {/* Mobile Account */}
                  <div className="p-6 border-t bg-muted/30">
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground mb-3">
                          Conectado como: {user.email}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full gap-3 h-12 text-lg font-semibold"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate(isAdmin ? '/admin' : '/');
                          }}
                        >
                          <User className="h-5 w-5" />
                          Minha Conta
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="outline" 
                            className="w-full gap-3 h-12 text-lg font-semibold"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate('/admin');
                            }}
                          >
                            <Settings className="h-5 w-5" />
                            Painel Admin
                          </Button>
                        )}
                        <Button 
                          variant="construction" 
                          className="w-full gap-3 h-12 text-lg font-semibold"
                          onClick={async () => {
                            console.log('Mobile logout clicked');
                            setIsMobileMenuOpen(false);
                            try {
                              const { error } = await signOut();
                              console.log('Mobile logout result:', { error });
                              if (error) {
                                console.error('Mobile logout error:', error);
                                toast({
                                  title: 'Erro',
                                  description: error.message,
                                  variant: 'destructive',
                                });
                              } else {
                                console.log('Mobile logout successful, navigating to home');
                                navigate('/');
                              }
                            } catch (err) {
                              console.error('Mobile logout exception:', err);
                            }
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          Sair
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="construction" 
                        className="w-full gap-3 h-12 text-lg font-semibold"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/auth');
                        }}
                      >
                        <User className="h-5 w-5" />
                        Entrar
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 border-t pt-4 hidden md:block">
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
              
              <div className="flex items-center gap-6 text-sm">
                <Link to="/produtos" className="hover:text-primary transition-colors">Produtos</Link>
                <button className="hover:text-primary transition-colors">Sobre Nós</button>
                <button className="hover:text-primary transition-colors">Contato</button>
                <button className="hover:text-primary transition-colors">Entrega</button>
                <button className="hover:text-primary transition-colors">Trocas e Devoluções</button>
                <button className="hover:text-primary transition-colors">Atendimento</button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">Ofertas</span> até 50% OFF
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;