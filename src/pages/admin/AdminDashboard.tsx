import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Package, FolderOpen, Users, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  activeProducts: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    activeProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsResult, categoriesResult, usersResult, activeProductsResult] = 
        await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true),
        ]);

      setStats({
        totalProducts: productsResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        totalUsers: usersResult.count || 0,
        activeProducts: activeProductsResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts,
      description: 'Produtos cadastrados',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Produtos Ativos',
      value: stats.activeProducts,
      description: 'Em estoque',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Categorias',
      value: stats.totalCategories,
      description: 'Categorias criadas',
      icon: FolderOpen,
      color: 'text-purple-600',
    },
    {
      title: 'Usuários',
      value: stats.totalUsers,
      description: 'Usuários registrados',
      icon: Users,
      color: 'text-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral das estatísticas do seu e-commerce
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerencie rapidamente seus produtos e categorias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">Links úteis:</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/admin/produtos"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Gerenciar Produtos
                </a>
                <a
                  href="/admin/categorias"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  Gerenciar Categorias
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>
              Informações sobre o estado atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sistema</span>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Banco de Dados</span>
                <span className="text-sm text-green-600 font-medium">Conectado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Última Atualização</span>
                <span className="text-sm text-muted-foreground">Agora mesmo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;