import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings, Bell, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Input } from '@/components/ui/input';

const AdminLayout = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'Logout realizado com sucesso!',
      });
      navigate('/');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/produtos')) return 'Produtos';
    if (path.startsWith('/admin/categorias')) return 'Categorias';
    if (path.startsWith('/admin/clientes')) return 'Clientes';
    if (path.startsWith('/admin/pedidos')) return 'Pedidos';
    if (path.startsWith('/admin/configuracoes')) return 'Configurações';
    return 'Administração';
  };

  const getUserInitials = () => {
    const name = profile?.full_name || user?.email || 'Admin';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <AdminRoute>
      <SidebarProvider defaultOpen>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 sticky top-0 z-40">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-muted rounded-md p-2 transition-colors" />
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight">{getPageTitle()}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Painel Administrativo</span>
                    <Badge variant="outline" className="text-xs">
                      Admin
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar..." 
                    className="pl-9 w-64 bg-muted/50 border-0 focus:bg-background"
                  />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive">
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Administrador'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/minha-conta')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Minha Conta</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background">
              <div className="animate-fade-in">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminRoute>
  );
};

export default AdminLayout;