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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
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
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar - Desktop Only */}
      <div className="hidden lg:block bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8 border-b border-primary/10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-8 text-gray-600">
              <div className="flex items-center gap-2 hover:text-primary transition-colors group">
                <Phone className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium">(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors group">
                <MapPin className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-medium">Sorocaba, SP</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>🚚 Entrega em até 24h</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md animate-pulse">
              ⚡ Ofertas até 50% OFF
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <img
              src="/logo.png"
              alt="Nova Casa Construção"
              className="h-16 md:h-24 w-auto transition-all duration-300 group-hover:scale-105 drop-shadow-md"
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-8">
            <div className="relative w-full group" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="O que você está procurando? Ex: cimento, tinta, tijolo..."
                className="pl-12 pr-4 h-14 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg placeholder:text-gray-400"
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
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 mt-2 max-h-96 overflow-y-auto backdrop-blur-sm">
                  <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                    <p className="text-sm font-medium text-gray-600">Resultados da pesquisa</p>
                  </div>
                  {searchResults.map((product, index) => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="relative">
                        <img
                          src={getProductImageUrl(product.image_url)}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-primary font-bold text-lg">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Search className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </button>
                  ))}

                  {searchTerm.length >= 2 && (
                    <button
                      className="w-full p-4 text-center bg-gradient-to-r from-primary to-primary/90 text-white font-semibold hover:from-primary/90 hover:to-primary transition-all duration-200 rounded-b-2xl border-t border-gray-100"
                      onClick={() => {
                        navigate(
                          `/produtos?search=${encodeURIComponent(searchTerm)}`
                        );
                        setSearchTerm("");
                        setIsSearchOpen(false);
                      }}
                    >
                      🔍 Ver todos os resultados para "{searchTerm}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* User Menu - Desktop */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex gap-3 h-12 px-4 rounded-xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500">Olá,</span>
                      <span className="text-sm font-medium max-w-32 truncate">{user.email?.split('@')[0]}</span>
                    </div>
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
                className="hidden md:flex gap-3 h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => navigate("/auth")}
              >
                <User className="h-4 w-4" />
                <span className="font-medium">Entrar</span>
              </Button>
            )}

            {/* Cart Button */}
            <Button
              className="relative h-12 px-4 md:px-6 rounded-xl bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md group"
              variant="outline"
              onClick={() => navigate("/carrinho")}
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse shadow-lg">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline ml-3 font-medium text-gray-700 group-hover:text-primary transition-colors">
                Carrinho
              </span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button className="md:hidden h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 hover:from-primary/20 hover:to-primary/10 transition-all duration-200 shadow-sm hover:shadow-md">
                  <Menu className="h-5 w-5 text-primary" />
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
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isCategoriesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    {isCategoriesOpen && (
                      <div className="ml-4 space-y-1">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            className="block w-full text-left text-sm text-muted-foreground hover:text-primary py-2"
                            onClick={() =>
                              handleCategoryClick(category.id, category.name)
                            }
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
        <div className="md:hidden mt-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Buscar produtos..."
              className="pl-12 pr-4 h-12 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <div className="hidden lg:block border-t bg-gradient-to-r from-gray-50 to-gray-100/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-3 h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                    <Package className="h-4 w-4" />
                    Todas as Categorias
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() =>
                        handleCategoryClick(category.id, category.name)
                      }
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
              <nav className="flex items-center gap-8">
                <Link
                  to="/produtos"
                  className="text-gray-700 hover:text-primary font-medium transition-all duration-200 hover:scale-105 relative group"
                >
                  Produtos
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/sobre-nos"
                  className="text-gray-700 hover:text-primary font-medium transition-all duration-200 hover:scale-105 relative group"
                >
                  Sobre Nós
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/contato"
                  className="text-gray-700 hover:text-primary font-medium transition-all duration-200 hover:scale-105 relative group"
                >
                  Contato
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/entrega"
                  className="text-gray-700 hover:text-primary font-medium transition-all duration-200 hover:scale-105 relative group"
                >
                  Entrega
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/trocas-e-devolucoes"
                  className="text-gray-700 hover:text-primary font-medium transition-all duration-200 hover:scale-105 relative group"
                >
                  Trocas e Devoluções
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
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
