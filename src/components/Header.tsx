import {
  Search,
  Menu,
  X,
  ChevronDown,
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
      {/* Main Header */}
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <img
              src="/logo.png"
              alt="Nova Casa Construção"
              className="h-12 md:h-24 w-auto transition-all duration-300 group-hover:scale-105 drop-shadow-md"
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
                    <p className="text-sm font-medium text-gray-600">
                      Resultados da pesquisa
                    </p>
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
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
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
                  <Button
                    variant="ghost"
                    className="hidden md:flex gap-4 h-14 px-6 rounded-xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500 font-medium">
                        Bem-vindo,
                      </span>
                      <span className="text-base font-semibold text-gray-800 max-w-40 truncate group-hover:text-primary transition-colors">
                        {user.email?.split("@")[0]}
                      </span>
                      <span className="text-xs text-primary font-medium">
                        Minha conta
                      </span>
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
              <div className="hidden md:flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="h-12 px-6 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-200 font-medium text-primary"
                  onClick={() => navigate("/auth")}
                >
                  Entrar
                </Button>
                <Button
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                  onClick={() => navigate("/auth")}
                >
                  Cadastre-se
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button className="md:hidden h-12 w-12 rounded-xl bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md">
                  <Menu className="h-5 w-5 text-gray-700 hover:text-primary transition-colors" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 p-0 flex flex-col h-full"
              >
                <SheetHeader className="px-6 py-6 border-b bg-gradient-to-r from-primary/5 to-primary/10 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <SheetTitle className="text-lg font-bold text-gray-800">
                        Menu Principal
                      </SheetTitle>
                      <p className="text-sm text-gray-600">
                        Navegue pela loja
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Categories */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-gray-800">Categorias</h3>
                      </div>

                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/20"
                            onClick={() =>
                              handleCategoryClick(category.id, category.name)
                            }
                          >
                            <img
                              src={category.image_url || "/placeholder.svg"}
                              alt={category.name}
                              className="w-10 h-10 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors">
                                {category.name}
                              </p>
                              {category.description && (
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {category.description}
                                </p>
                              )}
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-primary rotate-[-90deg] transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-gray-800">Páginas</h3>
                      </div>

                      <div className="space-y-2">
                        <Link
                          to="/produtos"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                            Produtos
                          </span>
                        </Link>
                        <Link
                          to="/sobre-nos"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                            <Info className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                            Sobre Nós
                          </span>
                        </Link>
                        <Link
                          to="/contato"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                            <MessageCircle className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                            Contato
                          </span>
                        </Link>
                        <Link
                          to="/entrega"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                            <Truck className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                            Entrega
                          </span>
                        </Link>
                        <Link
                          to="/trocas-e-devolucoes"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors">
                            <RefreshCw className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                            Trocas e Devoluções
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* User Section */}
                    <div className="border-t pt-4">
                      {user ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">
                                  Bem-vindo,
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {user.email?.split("@")[0]}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate("/minha-conta");
                            }}
                          >
                            <User className="h-4 w-4 text-primary" />
                            Minha Conta
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-3 h-12"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                navigate("/admin");
                              }}
                            >
                              <Settings className="h-4 w-4 text-primary" />
                              Painel Admin
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full gap-3 h-12 border-primary/20 text-primary hover:bg-primary/5"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate("/auth");
                            }}
                          >
                            <User className="h-4 w-4" />
                            Entrar
                          </Button>
                          <Button
                            className="w-full gap-3 h-12 bg-gradient-to-r from-primary to-primary/90"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              navigate("/auth");
                            }}
                          >
                            <User className="h-4 w-4" />
                            Cadastre-se
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4 px-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Buscar produtos..."
              className="pl-11 pr-4 h-11 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary transition-all duration-200 shadow-sm placeholder:text-gray-400 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Mobile Search Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-50 mt-1 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
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
                  </button>
                ))}

                {searchTerm.length >= 2 && (
                  <button
                    className="w-full p-3 text-center text-sm text-white bg-primary hover:bg-primary/90 transition-colors rounded-b-xl"
                    onClick={() => {
                      navigate(
                        `/produtos?search=${encodeURIComponent(searchTerm)}`
                      );
                      setSearchTerm("");
                      setIsSearchOpen(false);
                    }}
                  >
                    Ver todos os resultados
                  </button>
                )}
              </div>
            )}
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
                <DropdownMenuContent
                  className="w-[800px] p-0 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden"
                  align="start"
                  sideOffset={12}
                >
                  {/* Header do Dropdown */}
                  <div className="p-6 bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Categorias de Produtos
                          </h3>
                          <p className="text-sm text-gray-600">
                            Encontre exatamente o que você precisa para sua obra
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full font-medium">
                        {categories.length} categorias
                      </div>
                    </div>
                  </div>

                  {/* Grid Horizontal de Categorias */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <DropdownMenuItem
                          key={category.id}
                          className="p-4 rounded-2xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group hover:shadow-lg"
                          onClick={() =>
                            handleCategoryClick(category.id, category.name)
                          }
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="relative flex-shrink-0">
                              <img
                                src={category.image_url || "/placeholder.svg"}
                                alt={category.name}
                                className="w-16 h-16 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <ChevronDown className="h-3 w-3 text-white rotate-[-90deg]" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base text-gray-800 group-hover:text-primary transition-colors line-clamp-1 mb-1">
                                {category.name}
                              </h4>
                              {category.description && (
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                  {category.description}
                                </p>
                              )}
                              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-xs text-primary font-semibold">
                                  Explorar produtos →
                                </span>
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </div>

                  {/* Footer do Dropdown */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100">
                    <DropdownMenuItem
                      className="w-full p-5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold text-center justify-center transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl border-0 group"
                      onClick={() => navigate("/produtos")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                          <Search className="h-5 w-5" />
                        </div>
                        <span className="text-lg">Ver Todos os Produtos</span>
                        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                      </div>
                    </DropdownMenuItem>
                  </div>
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
