import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, MapPin, Phone, Mail, Calendar, Save, Package, Eye, ShoppingCart, CreditCard, Truck, CheckCircle, Clock, XCircle, TrendingUp, Star, Home, ArrowLeft, LogOut, X, MessageCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useSettings } from '@/hooks/useSettings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: {
    id: string;
    name: string;
    image_url: string;
    sku: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  created_at: string;
  shipping_address: string | null;
  order_items?: OrderItem[];
}

interface OrderStats {
  total_orders: number;
  total_spent: number;
  pending_orders: number;
  completed_orders: number;
}

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zip_code: string;
  document_number: string;
}

export default function MinhaConta() {
  const { user, profile, refreshProfile } = useAuth();
  const { getWhatsAppNumber } = useSettings();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total_orders: 0,
    total_spent: 0,
    pending_orders: 0,
    completed_orders: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    birth_date: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zip_code: '',
    document_number: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: profile?.full_name || '',
        email: profile?.email || user.email || '',
        phone: profile?.phone || '',
        birth_date: profile?.birth_date || '',
        street: profile?.street || '',
        number: profile?.number || '',
        complement: profile?.complement || '',
        city: profile?.city || '',
        state: profile?.state || '',
        zip_code: profile?.zip_code || '',
        document_number: profile?.document_number || '',
      });
    }
    fetchOrders();
  }, [profile, user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            unit_price,
            total_price,
            products!order_items_product_id_fkey(
              id,
              name,
              image_url,
              sku
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const ordersData = data || [];
      setOrders(ordersData);
      
      // Calculate statistics
      const stats = {
        total_orders: ordersData.length,
        total_spent: ordersData.reduce((sum, order) => sum + order.total_amount, 0),
        pending_orders: ordersData.filter(order => order.status === 'pending').length,
        completed_orders: ordersData.filter(order => order.status === 'delivered').length,
      };
      setOrderStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          birth_date: profileData.birth_date || null,
          street: profileData.street,
          number: profileData.number,
          complement: profileData.complement,
          city: profileData.city,
          state: profileData.state,
          zip_code: profileData.zip_code,
          document_number: profileData.document_number,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar perfil. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-primary/10 text-primary border-primary/20';
      case 'processing': return 'bg-primary/10 text-primary border-primary/20';
      case 'shipped': return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'processing': return 'Processando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando Pagamento';
      case 'paid': return 'Pago';
      case 'cancelled': return 'Cancelado';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const generateWhatsAppMessage = (order: Order) => {
    const orderNumber = order.id.slice(0, 8).toUpperCase();
    const currentDate = new Date(order.created_at).toLocaleDateString('pt-BR');
    
    let message = `*PEDIDO #${orderNumber}*\n\n`;
    
    message += `*PRODUTOS:*\n`;
    order.order_items?.forEach((item, index) => {
      message += `${index + 1}. ${item.product_name}\n`;
      if (item.products?.sku) {
        message += `   SKU: ${item.products.sku}\n`;
      }
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Valor: ${formatCurrency(item.total_price)}\n\n`;
    });
    
    message += `*TOTAL: ${formatCurrency(order.total_amount)}*\n\n`;
    
    if (profile) {
      message += `*DADOS DO CLIENTE:*\n`;
      if (profile.full_name) message += `Nome: ${profile.full_name}\n`;
      if (profile.phone) message += `Telefone: ${profile.phone}\n`;
      if (profile.email) message += `Email: ${profile.email}\n\n`;
    }
    
    if (order.shipping_address) {
      message += `*ENTREGA:*\n`;
      message += `${order.shipping_address}\n\n`;
    }
    
    message += `Data do pedido: ${currentDate}\n\n`;
    message += `Gostaria de fazer esse pedido, e realizar o pagamento!`;
    
    return encodeURIComponent(message);
  };

  const handleResendWhatsApp = (order: Order) => {
    const whatsappMessage = generateWhatsAppMessage(order);
    const whatsappNumber = getWhatsAppNumber();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'Mensagem enviada',
      description: 'Redirecionando para o WhatsApp...',
    });
  };

  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect will be handled by AuthRedirect component
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-background">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle>Acesso Negado</CardTitle>
              <CardDescription>Você precisa estar logado para acessar sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/auth">
                <Button>Fazer Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Início
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Minha Conta</span>
          </nav>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with user info */}
          <div className="flex flex-col gap-4 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Minha Conta</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Olá, {profileData.full_name || user.email?.split('@')[0] || 'usuário'}!
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link to="/" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Voltar à loja</span>
                    <span className="sm:hidden">Voltar</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full sm:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-4 lg:space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Pedidos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground truncate">Total de Pedidos</p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold">{orderStats.total_orders}</p>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground truncate">Total Gasto</p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold">{formatCurrency(orderStats.total_spent)}</p>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground truncate">Pendentes</p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold">{orderStats.pending_orders}</p>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground truncate">Concluídos</p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold">{orderStats.completed_orders}</p>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Summary */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1 bg-primary/10 rounded">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      Resumo do Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                        <div className="p-1.5 sm:p-2 bg-background rounded-lg shadow-sm flex-shrink-0">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium">Email</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {profileData.email || 'Não informado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                        <div className="p-1.5 sm:p-2 bg-background rounded-lg shadow-sm flex-shrink-0">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium">Telefone</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {profileData.phone || 'Não informado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                        <div className="p-1.5 sm:p-2 bg-background rounded-lg shadow-sm flex-shrink-0">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium">Cidade</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {profileData.city || 'Não informado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1 bg-primary/10 rounded">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      Pedidos Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto mb-4">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                        <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido.</p>
                        <Link to="/produtos">
                          <Button>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Começar a comprar
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                {getStatusIcon(order.status)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                </p>
                                <div className="mt-1">
                                  <Badge variant="outline" className={getStatusColor(order.status)}>
                                    {getStatusText(order.status)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <div className="text-left sm:text-right">
                                <p className="font-bold text-lg">{formatCurrency(order.total_amount)}</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="shrink-0"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Ver</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {orders.length > 3 && (
                          <div className="text-center pt-4">
                            <Button variant="outline">
                              Ver todos os pedidos
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Gerencie suas informações pessoais e de entrega
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Seu nome completo"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birth_date" className="text-sm font-medium">Data de Nascimento</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={profileData.birth_date}
                        onChange={(e) => setProfileData(prev => ({ ...prev, birth_date: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document_number" className="text-sm font-medium">CPF/CNPJ</Label>
                    <Input
                      id="document_number"
                      value={profileData.document_number}
                      onChange={(e) => setProfileData(prev => ({ ...prev, document_number: e.target.value }))}
                      placeholder="000.000.000-00"
                      className="text-sm"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço de Entrega
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="street" className="text-sm font-medium">Rua</Label>
                        <Input
                          id="street"
                          value={profileData.street}
                          onChange={(e) => setProfileData(prev => ({ ...prev, street: e.target.value }))}
                          placeholder="Nome da rua"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number" className="text-sm font-medium">Número</Label>
                        <Input
                          id="number"
                          value={profileData.number}
                          onChange={(e) => setProfileData(prev => ({ ...prev, number: e.target.value }))}
                          placeholder="123"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement" className="text-sm font-medium">Complemento</Label>
                      <Input
                        id="complement"
                        value={profileData.complement}
                        onChange={(e) => setProfileData(prev => ({ ...prev, complement: e.target.value }))}
                        placeholder="Apartamento, bloco, etc. (opcional)"
                        className="text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">Cidade</Label>
                        <Input
                          id="city"
                          value={profileData.city}
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="São Paulo"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm font-medium">Estado</Label>
                        <Input
                          id="state"
                          value={profileData.state}
                          onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="SP"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code" className="text-sm font-medium">CEP</Label>
                        <Input
                          id="zip_code"
                          value={profileData.zip_code}
                          onChange={(e) => setProfileData(prev => ({ ...prev, zip_code: e.target.value }))}
                          placeholder="00000-000"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full sm:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Meus Pedidos
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o status dos seus pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                      <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="border">
                          <CardContent className="p-3 sm:p-4 lg:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  {getStatusIcon(order.status)}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-base sm:text-lg">Pedido #{order.id.slice(0, 8)}</h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="font-bold text-lg sm:text-xl">{formatCurrency(order.total_amount)}</p>
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                  {getStatusText(order.status)}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Order Items */}
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium mb-2 text-sm sm:text-base">Itens do Pedido:</h5>
                                <div className="space-y-2">
                                  {order.order_items.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-2 sm:p-3 bg-muted/50 rounded">
                                      <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm sm:text-base">{item.product_name}</p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                          Qtd: {item.quantity} × {formatCurrency(item.unit_price)}
                                        </p>
                                      </div>
                                      <p className="font-medium text-sm sm:text-base">{formatCurrency(item.total_price)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Payment and Shipping Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                              <div>
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Status do Pagamento:</p>
                                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                                  {order.payment_status === 'pending' ? 'Pendente' : 'Pago'}
                                </Badge>
                              </div>
                              
                              {order.payment_method && (
                                <div>
                                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Método de Pagamento:</p>
                                  <p className="text-xs sm:text-sm">{order.payment_method}</p>
                                </div>
                              )}
                            </div>
                            
                            {order.shipping_address && (
                              <div className="mb-4">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Endereço de entrega:</p>
                                <p className="text-xs sm:text-sm bg-muted/50 p-2 rounded break-words">{order.shipping_address}</p>
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t">
                              <div className="flex items-center gap-2">
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                <span className="text-xs sm:text-sm text-muted-foreground">
                                  {order.status === 'delivered' ? 'Avalie este pedido' : 'Aguardando entrega'}
                                </span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                  className="w-full"
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  <span className="sm:hidden">Ver Detalhes</span>
                                  <span className="hidden sm:inline">Ver Detalhes Completos</span>
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResendWhatsApp(order)}
                                  className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                                >
                                  <MessageCircle className="mr-1 h-3 w-3" />
                                  <span className="sm:hidden">WhatsApp</span>
                                  <span className="hidden sm:inline">Reenviar WhatsApp</span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Order Details Modal */}
      <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalhes do Pedido #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre seu pedido
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Pedido #{selectedOrder.id.slice(0, 8)}</h3>
                    <p className="text-sm text-muted-foreground">
                      Realizado em {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(selectedOrder.total_amount)}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={getStatusColor(selectedOrder.status)}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                    <Badge variant="outline" className={getPaymentStatusColor(selectedOrder.payment_status)}>
                      {getPaymentStatusText(selectedOrder.payment_status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Status do Pedido
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className={`p-3 rounded-lg border-2 ${
                    ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Pendente</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg border-2 ${
                    ['confirmed', 'processing', 'shipped', 'delivered'].includes(selectedOrder.status) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Confirmado</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Pedido confirmado</p>
                  </div>

                  <div className={`p-3 rounded-lg border-2 ${
                    ['processing', 'shipped', 'delivered'].includes(selectedOrder.status) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4" />
                      <span className="text-sm font-medium">Processando</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Preparando pedido</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg border-2 ${
                    ['shipped', 'delivered'].includes(selectedOrder.status) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4" />
                      <span className="text-sm font-medium">Enviado</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Em transporte</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg border-2 ${
                    selectedOrder.status === 'delivered' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-muted bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Entregue</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Pedido entregue</p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Informações de Pagamento
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status do Pagamento</p>
                    <Badge variant="outline" className={getPaymentStatusColor(selectedOrder.payment_status)}>
                      {getPaymentStatusText(selectedOrder.payment_status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Método de Pagamento</p>
                    <p className="text-sm capitalize">{selectedOrder.payment_method || 'WhatsApp'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Itens do Pedido
                </h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.products?.image_url ? (
                          <img
                            src={(() => {
                              try {
                                const parsed = JSON.parse(item.products.image_url);
                                return Array.isArray(parsed) ? parsed[0] : item.products.image_url;
                              } catch {
                                return item.products.image_url;
                              }
                            })()}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium">{item.product_name}</h5>
                        {item.products?.sku && (
                          <p className="text-sm text-muted-foreground">SKU: {item.products.sku}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity} × {formatCurrency(item.unit_price)}
                          </p>
                          <p className="font-semibold">{formatCurrency(item.total_price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-bold text-lg p-4">
                    <span>Total do Pedido:</span>
                    <span className="text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              {selectedOrder.shipping_address && (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço de Entrega
                  </h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm">{selectedOrder.shipping_address}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => handleResendWhatsApp(selectedOrder)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Reenviar no WhatsApp
                </Button>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  <X className="mr-2 h-4 w-4" />
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}