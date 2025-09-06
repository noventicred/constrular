import {
  Search,
  Menu,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  X,
  Package,
  Info,
  MessageCircle,
  Truck,
  RefreshCw,
  User,
  LogOut,
  Settings,
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
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/formatters";
import { getProductImageUrl, createImageProps } from "@/lib/imageUtils";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState<Product[]>([]);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();

    // Close search dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchOpen(false);
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

  // Search products function
  const searchProducts = async (query: string) => {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, sku")
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .eq("in_stock", true)
        .limit(5);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };

  // Handle desktop search
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

  // Handle mobile search
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (mobileSearchTerm.length >= 2) {
        const results = await searchProducts(mobileSearchTerm);
        setMobileSearchResults(results);
        setIsMobileSearchOpen(true);
      } else {
        setMobileSearchResults([]);
        setIsMobileSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [mobileSearchTerm]);

  const handleProductClick = (productId: string) => {
    setSearchTerm("");
    setMobileSearchTerm("");
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/produto/${productId}`);
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    console.log("Category clicked:", categoryId, categoryName);

    // Fechar todos os menus
    setIsDropdownOpen(false);
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);

    // Navegar diretamente
    navigate(`/produtos?categoria=${categoryId}`);
  };
  return (
    <header className="bg-background border-b shadow-sm z-40">
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <Link
              to={isAdmin ? "/admin" : "/"}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo.png"
                alt="Nova Casa Construção"
                className="h-32 w-auto"
              />
            </Link>
          </div>

          {/* Search bar - Desktop */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
              <Input
                placeholder="Busque por cimento, tijolo, tinta..."
                className="pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setIsSearchOpen(true);
                  }
                }}
              />

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-background border rounded-lg shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b last:border-b-0"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">
                          {product.name}
                        </div>
                        <div className="text-primary font-bold text-sm">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}

                  {searchTerm.length >= 2 && (
                    <button
                      className="w-full p-3 text-center text-sm text-primary hover:bg-muted transition-colors border-t"
                      onClick={() => {
                        navigate(
                          `/produtos?search=${encodeURIComponent(searchTerm)}`
                        );
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

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex gap-2"
                  >
                    <User className="h-4 w-4" />
                    {user.email}
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
                size="sm"
                className="hidden md:flex"
                onClick={() => navigate("/auth")}
              >
                <User className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Top Row - Logo and Menu */}
          <div className="flex items-center justify-between">
            <Link
              to={isAdmin ? "/admin" : "/"}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo.png"
                alt="Nova Casa Construção"
                className="h-20 w-auto"
              />
            </Link>

            <div className="flex items-center gap-3">
              {/* User Menu Mobile */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex gap-2 h-10 px-3"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden xs:inline text-sm truncate max-w-20">
                        {user.email?.split('@')[0]}
                      </span>
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
                  size="sm"
                  className="flex gap-2 h-10 px-3"
                  onClick={() => navigate("/auth")}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Entrar</span>
                </Button>
              )}

              {/* Menu Hambúrguer */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 hover:to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-500 group shadow-lg hover:shadow-xl backdrop-blur-sm"
                  >
                    <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-md scale-0 group-hover:scale-150 transition-all duration-500" />

                      {/* Top line */}
                      <span
                        className={`absolute block h-0.5 w-6 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out shadow-sm ${
                          isMobileMenuOpen
                            ? "rotate-45 translate-y-0"
                            : "-translate-y-2"
                        }`}
                      />

                      {/* Middle line */}
                      <span
                        className={`absolute block h-0.5 w-6 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out shadow-sm ${
                          isMobileMenuOpen
                            ? "opacity-0 scale-0"
                            : "opacity-100 scale-100"
                        }`}
                      />

                      {/* Bottom line */}
                      <span
                        className={`absolute block h-0.5 w-6 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out shadow-sm ${
                          isMobileMenuOpen
                            ? "-rotate-45 translate-y-0"
                            : "translate-y-2"
                        }`}
                      />
                    </div>

                    {/* Animated ring border */}
                    <div
                      className={`absolute inset-0 rounded-2xl border-2 border-primary/30 transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "scale-110 opacity-100"
                          : "scale-100 opacity-0"
                      }`}
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle className="text-xl font-bold text-primary">
                      Menu
                    </SheetTitle>
                  </SheetHeader>

                  <div className="p-0">
                    {/* Navegação Principal */}
                    <div className="p-6 space-y-4">
                      <Link
                        to="/produtos"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package className="h-5 w-5 text-primary" />
                        <span className="font-medium">Produtos</span>
                      </Link>

                      <Link
                        to="/sobre-nos"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Info className="h-5 w-5 text-primary" />
                        <span className="font-medium">Sobre Nós</span>
                      </Link>

                      <Link
                        to="/contato"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <MessageCircle className="h-5 w-5 text-primary" />
                        <span className="font-medium">Contato</span>
                      </Link>

                      <Link
                        to="/entrega"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Truck className="h-5 w-5 text-primary" />
                        <span className="font-medium">Entrega</span>
                      </Link>

                      <Link
                        to="/trocas-e-devolucoes"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <RefreshCw className="h-5 w-5 text-primary" />
                        <span className="font-medium">Trocas e Devoluções</span>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search Bar Mobile */}
          <div className="relative" ref={mobileSearchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 h-12 text-base bg-muted/50 border-primary/20 focus:border-primary"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              onFocus={() => {
                if (mobileSearchResults.length > 0) {
                  setIsMobileSearchOpen(true);
                }
              }}
            />

            {/* Mobile Search Results */}
            {isMobileSearchOpen && mobileSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-background border rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                {mobileSearchResults.map((product) => (
                  <button
                    key={product.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b last:border-b-0"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-primary font-bold text-sm">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}

                {mobileSearchTerm.length >= 2 && (
                  <button
                    className="w-full p-3 text-center text-sm text-primary hover:bg-muted transition-colors border-t"
                    onClick={() => {
                      navigate(
                        `/produtos?search=${encodeURIComponent(
                          mobileSearchTerm
                        )}`
                      );
                      setMobileSearchTerm("");
                      setIsMobileSearchOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Ver todos os resultados para "{mobileSearchTerm}"
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Desktop */}
      <div className="hidden md:block">
        <nav className="bg-muted/30 border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-medium">(11) 99999-9999</span>
                <div className="w-1 h-1 bg-muted-foreground/50 rounded-full mx-2" />
                <MapPin className="h-4 w-4 text-primary" />
                <span>Sorocaba, SP</span>
                <div className="w-1 h-1 bg-muted-foreground/50 rounded-full mx-2" />
                <span>🚚 Entrega em até 24h</span>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <Link
                  to="/produtos"
                  className="hover:text-primary transition-colors"
                >
                  Produtos
                </Link>
                <Link
                  to="/sobre-nos"
                  className="hover:text-primary transition-colors"
                >
                  Sobre Nós
                </Link>
                <Link
                  to="/contato"
                  className="hover:text-primary transition-colors"
                >
                  Contato
                </Link>
                <Link
                  to="/entrega"
                  className="hover:text-primary transition-colors"
                >
                  Entrega
                </Link>
                <Link
                  to="/trocas-e-devolucoes"
                  className="hover:text-primary transition-colors"
                >
                  Trocas e Devoluções
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Ofertas</span> até 50%
                OFF
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
