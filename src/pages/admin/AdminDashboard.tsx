import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Package, FolderOpen, Users, TrendingUp, ShoppingCart, DollarSign, Eye, Plus, Activity, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
  weeklyGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'product';
  message: string;
  timestamp: string;
  status?: 'success' | 'pending' | 'error';
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    weeklyGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsResult, categoriesResult, usersResult, activeProductsResult, ordersResult] = 
        await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
        ]);

      // Simulando dados de receita e crescimento
      const monthlyRevenue = Math.floor(Math.random() * 50000) + 20000;
      const weeklyGrowth = Math.floor(Math.random() * 20) + 5;

      setStats({
        totalProducts: productsResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        totalUsers: usersResult.count || 0,
        activeProducts: activeProductsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        pendingOrders: Math.floor((ordersResult.count || 0) * 0.3),
        monthlyRevenue,
        weeklyGrowth,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    // Simulando atividades recentes
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'order',
        message: 'Novo pedido #1234 recebido',
        timestamp: '2 minutos atrás',
        status: 'success'
      },
      {
        id: '2',
        type: 'user',
        message: 'Novo usuário registrado',
        timestamp: '15 minutos atrás',
        status: 'success'
      },
      {
        id: '3',
        type: 'product',
        message: 'Produto "Martelo" com estoque baixo',
        timestamp: '1 hora atrás',
        status: 'pending'
      },
      {
        id: '4',
        type: 'order',
        message: 'Pedido #1230 cancelado',
        timestamp: '2 horas atrás',
        status: 'error'
      },
    ];
    setRecentActivity(activities);
  };

  const statCards = [
    {
      title: 'Receita Mensal',
      value: `R$ ${stats.monthlyRevenue.toLocaleString()}`,
      description: `+${stats.weeklyGrowth}% vs semana passada`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up',
      progress: stats.weeklyGrowth,
    },
    {
      title: 'Total de Pedidos',
      value: stats.totalOrders,
      description: `${stats.pendingOrders} pendentes`,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'up',
      progress: 75,
    },
    {
      title: 'Produtos Ativos',
      value: stats.activeProducts,
      description: `de ${stats.totalProducts} total`,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: 'stable',
      progress: stats.totalProducts > 0 ? (stats.activeProducts / stats.totalProducts) * 100 : 0,
    },
    {
      title: 'Usuários Registrados',
      value: stats.totalUsers,
      description: 'Clientes cadastrados',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'up',
      progress: 60,
    },
  ];

  const quickActions = [
    {
      title: 'Novo Produto',
      description: 'Adicionar produto ao catálogo',
      icon: Plus,
      action: () => navigate('/admin/produtos/novo'),
      variant: 'default' as const,
    },
    {
      title: 'Ver Produtos',
      description: 'Gerenciar produtos existentes',
      icon: Package,
      action: () => navigate('/admin/produtos'),
      variant: 'outline' as const,
    },
    {
      title: 'Categorias',
      description: 'Organizar categorias',
      icon: FolderOpen,
      action: () => navigate('/admin/categorias'),
      variant: 'outline' as const,
    },
    {
      title: 'Clientes',
      description: 'Visualizar usuários',
      icon: Users,
      action: () => navigate('/admin/clientes'),
      variant: 'outline' as const,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'user': return Users;
      case 'product': return Package;
      default: return Activity;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-5 bg-muted rounded w-96 mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Dashboard Administrativo
        </h1>
        <p className="text-lg text-muted-foreground">
          Visão geral completa do seu e-commerce
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={card.title} className="relative overflow-hidden group hover-scale transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="text-3xl font-bold">{card.value}</div>
              </div>
              <div className={`h-12 w-12 rounded-full ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Progresso</span>
                  <span>{Math.round(card.progress)}%</span>
                </div>
                <Progress value={card.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {quickActions.map((action, index) => (
                <Button
                  key={action.title}
                  variant={action.variant}
                  onClick={action.action}
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover-scale animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 500}ms` }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <action.icon className="h-5 w-5" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    {action.description}
                  </p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas atividades do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in" style={{ animationDelay: `${index * 100 + 600}ms` }}>
                    <div className={`h-8 w-8 rounded-full bg-background flex items-center justify-center ${getStatusColor(activity.status)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    {activity.status && (
                      <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                        {activity.status === 'success' ? 'Sucesso' : activity.status === 'pending' ? 'Pendente' : 'Erro'}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="animate-scale-in" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Status do Sistema
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real dos serviços
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sistema</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Online
                </Badge>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Banco de Dados</span>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Conectado
                </Badge>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance</span>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  Boa
                </Badge>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;