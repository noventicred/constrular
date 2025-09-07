import { Package, FolderOpen, Users, BarChart3, Settings, Home, ShoppingCart } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const bottomMenuItems = [
  { title: 'Configurações', url: '/admin/configuracoes', icon: Settings },
  { title: 'Voltar ao Site', url: '/', icon: Home },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  
  // Estados para contadores dinâmicos
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    users: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Buscar contadores em paralelo
      const [productsResult, categoriesResult, usersResult, ordersResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('categories').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
      ]);

      setCounts({
        products: productsResult.count || 0,
        categories: categoriesResult.count || 0,
        users: usersResult.count || 0,
        pendingOrders: ordersResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const adminMenuItems = [
    { title: 'Dashboard', url: '/admin', icon: BarChart3, exactMatch: true },
    { 
      title: 'Produtos', 
      url: '/admin/produtos', 
      icon: Package, 
      count: counts.products,
      showCount: true 
    },
    { 
      title: 'Categorias', 
      url: '/admin/categorias', 
      icon: FolderOpen, 
      count: counts.categories,
      showCount: true 
    },
    { 
      title: 'Clientes', 
      url: '/admin/clientes', 
      icon: Users, 
      count: counts.users,
      showCount: true 
    },
    { 
      title: 'Pedidos', 
      url: '/admin/pedidos', 
      icon: ShoppingCart, 
      count: counts.pendingOrders,
      showCount: true,
      badge: counts.pendingOrders > 0 ? 'Pendentes' : null,
      badgeVariant: 'destructive'
    },
  ];

  const isActive = (path: string, exactMatch = false) => {
    if (exactMatch) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string, exactMatch = false) => {
    const active = isActive(path, exactMatch);
    return `transition-all duration-200 ${
      active 
        ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
        : 'hover:bg-muted/70 hover:text-foreground text-muted-foreground'
    }`;
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h2 className="font-bold text-lg">Admin</h2>
              <p className="text-xs text-muted-foreground">Painel de controle</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Principais
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${getNavCls(item.url, item.exactMatch)} animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <NavLink to={item.url} end={item.exactMatch}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span>{item.title}</span>
                          <div className="flex items-center gap-2">
                            {item.showCount && (
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                                {item.count}
                              </span>
                            )}
                            {item.badge && (
                              <Badge 
                                variant={item.badgeVariant || 'secondary'} 
                                className="text-xs px-1.5 py-0.5 animate-pulse"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Geral
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {bottomMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${getNavCls(item.url)} animate-fade-in`}
                    style={{ animationDelay: `${(index + adminMenuItems.length) * 50}ms` }}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}