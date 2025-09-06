import {
  Search,
  Menu,
  Phone,
  MapPin,
  ChevronDown,
  X,
  Package,
  Info,
  MessageCircle,
  Truck,
  RefreshCw,
  User,
  LogOut,
  Settings,
  ShoppingCart,
} from "lucide-react";
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
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
import { getProductImageUrl } from "@/lib/imageUtils";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, description, image_url")
        .is("parent_id", null)
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const searchProducts = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .ilike("name", `%${query}%`)
        .eq("in_stock", true)
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        const results = await searchProducts(searchTerm);
        setSearchResults(results);
        setIsSearchOpen(true);
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleProductClick = (productId: string) => {
    setSearchTerm("");
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/produto/${productId}`);
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/produtos?categoria=${categoryId}`);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      {/* Top Bar - Desktop Only */}
      <div className="hidden md:block bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Sorocaba, SP</span>
              </div>
              <span>🚚 Entrega em até 24h</span>
            </div>
            <div className="text-primary font-medium">
              Ofertas até 50% OFF
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Nova Casa Construção"
              className="h-16 md:h-20 w-auto"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setIsSearchOpen(true);
                  }
                }}
              />

              {/* Search Results */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-primary font-bold text-sm">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {searchTerm.length >= 2 && (
                    <button
                      className="w-full p-4 text-center text-sm text-primary hover:bg-gray-50 transition-colors border-t"
                      onClick={() => {
                        navigate(`/produtos?search=${encodeURIComponent(searchTerm)}`);
                        setSearchTerm("");
                        setIsSearchOpen(false);
                      }}
                    >
                      Ver todos os resultados para "{searchTerm}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* User Menu - Desktop */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-32 truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/minha-conta")}>
                    <User className="mr-2 h-4 w-4" />
                    Minha Conta
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Painel Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        const { error } = await signOut();
                        if (error) {
                          toast({
                            title: "Erro",
                            description: error.message,
                            variant: "destructive",
                          });
                        } else {
                          toast({
                            title: "Sucesso",
                            description: "Logout realizado com sucesso!",
                          });
                          navigate("/");
                        }
                      } catch (err) {
                        toast({
                          title: "Erro inesperado",
                          description: "Tente novamente mais tarde.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className="hidden md:flex gap-2"
                onClick={() => navigate("/auth")}
              >
                <User className="h-4 w-4" />
                Entrar
              </Button>
            )}

            {/* Cart Button */}
            <Button
              variant="outline"
              className="relative"
              onClick={() => navigate("/carrinho")}
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="hidden md:inline ml-2">Carrinho</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="p-6 space-y-4">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar produtos..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    >
                      <span>Categorias</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    {isCategoriesOpen && (
                      <div className="ml-4 space-y-1">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            className="block w-full text-left text-sm text-muted-foreground hover:text-primary py-2"
                            onClick={() => handleCategoryClick(category.id, category.name)}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <Link
                      to="/produtos"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 text-primary" />
                      Produtos
                    </Link>
                    <Link
                      to="/sobre-nos"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Info className="h-4 w-4 text-primary" />
                      Sobre Nós
                    </Link>
                    <Link
                      to="/contato"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="h-4 w-4 text-primary" />
                      Contato
                    </Link>
                    <Link
                      to="/entrega"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Truck className="h-4 w-4 text-primary" />
                      Entrega
                    </Link>
                    <Link
                      to="/trocas-e-devolucoes"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <RefreshCw className="h-4 w-4 text-primary" />
                      Trocas e Devoluções
                    </Link>
                  </div>

                  {/* User Section */}
                  <div className="border-t pt-4">
                    {user ? (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground mb-3">
                          {user.email}
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate("/minha-conta");
                          }}
                        >
                          <User className="h-4 w-4" />
                          Minha Conta
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate("/admin");
                            }}
                          >
                            <Settings className="h-4 w-4" />
                            Painel Admin
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={async () => {
                            setIsMobileMenuOpen(false);
                            try {
                              const { error } = await signOut();
                              if (!error) {
                                navigate("/");
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Sair
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full gap-3"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate("/auth");
                        }}
                      >
                        <User className="h-4 w-4" />
                        Entrar
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 border-2 border-gray-200 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <div className="hidden md:block border-t bg-gray-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Package className="h-4 w-4" />
                    Categorias
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id, category.name)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/produtos")}>
                    Ver Todos os Produtos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Navigation Links */}
              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link to="/produtos" className="hover:text-primary transition-colors">
                  Produtos
                </Link>
                <Link to="/sobre-nos" className="hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
                <Link to="/contato" className="hover:text-primary transition-colors">
                  Contato
                </Link>
                <Link to="/entrega" className="hover:text-primary transition-colors">
                  Entrega
                </Link>
                <Link to="/trocas-e-devolucoes" className="hover:text-primary transition-colors">
                  Trocas e Devoluções
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;