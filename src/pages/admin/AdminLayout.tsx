import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut, isAdminChecked } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('AdminLayout check:', { loading, user: !!user, isAdmin, isAdminChecked });
    
    // CRITICAL: Only make decisions when EVERYTHING is loaded
    if (!loading && isAdminChecked) {
      if (!user) {
        console.log('No user, redirecting to auth');
        navigate('/auth');
      } else if (!isAdmin) {
        console.log('User is not admin, redirecting to home');
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar o painel administrativo.',
          variant: 'destructive',
        });
        navigate('/');
      } else {
        console.log('User is admin, staying in admin area');
      }
    } else {
      console.log('Still loading or checking admin status, waiting...');
    }
  }, [user, isAdmin, loading, isAdminChecked, navigate, toast]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      navigate('/');
    }
  };

  // Show loading while ANYTHING is still loading
  if (loading || !isAdminChecked) {
    console.log('Showing loading screen because:', { loading, isAdminChecked });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not admin or not logged in, show nothing (redirection already happened)
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Redirecionando...</h2>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">Painel Administrativo</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;