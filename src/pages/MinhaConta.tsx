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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, MapPin, Phone, Mail, Calendar, Save, Package, Eye, ShoppingCart, CreditCard, Truck, CheckCircle, Clock, XCircle, TrendingUp, Star, Home, ArrowLeft, LogOut } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
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
    const loadProfileData = async () => {
      if (user) {
        console.log('Loading profile for user:', user.id);
        
        // Primeiro, tentar buscar o perfil
        let currentProfile = profile;
        
        // Se não temos perfil, tentar criar um
        if (!currentProfile) {
          console.log('No profile found, creating one...');
          try {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
            
            if (existingProfile) {
              currentProfile = existingProfile;
              console.log('Found existing profile:', existingProfile);
            } else {
              // Criar perfil se não existir
              const { data: newProfile, error } = await supabase
                .from('profiles')
                .insert([{
                  id: user.id,
                  email: user.email,
                  full_name: user.user_metadata?.full_name || '',
                  phone: user.user_metadata?.phone || '',
                  street: user.user_metadata?.street || '',
                  number: user.user_metadata?.number || '',
                  complement: user.user_metadata?.complement || '',
                  city: user.user_metadata?.city || '',
                  state: user.user_metadata?.state || '',
                  zip_code: user.user_metadata?.zip_code || '',
                  is_admin: false
                }])
                .select()
                .single();
              
              if (!error && newProfile) {
                currentProfile = newProfile;
                console.log('Created new profile:', newProfile);
                // Refresh do profile no contexto
                await refreshProfile();
              }
            }
          } catch (error) {
            console.error('Error handling profile:', error);
          }
        }

        // Atualizar os dados do formulário
        setProfileData({
          full_name: currentProfile?.full_name || '',
          email: currentProfile?.email || user.email || '',
          phone: currentProfile?.phone || '',
          birth_date: currentProfile?.birth_date || '',
          street: currentProfile?.street || '',
          number: currentProfile?.number || '',
          complement: currentProfile?.complement || '',
          city: currentProfile?.city || '',
          state: currentProfile?.state || '',
          zip_code: currentProfile?.zip_code || '',
          document_number: currentProfile?.document_number || '',
        });
        
        console.log('Profile data set:', {
          full_name: currentProfile?.full_name || '',
          email: currentProfile?.email || user.email || '',
          phone: currentProfile?.phone || '',
        });
      }
    };

    loadProfileData();
    fetchOrders();
  }, [profile, user, refreshProfile]);

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
            total_price
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
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
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

      <div className="flex-1 container mx-auto px-4 py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with user info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">Minha Conta</h1>
                  <p className="text-muted-foreground">
                    Olá, {profileData.full_name || user.email?.split('@')[0] || 'usuário'}!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar à loja
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 py-3">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                          <p className="text-xl lg:text-2xl font-bold">{orderStats.total_orders}</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total Gasto</p>
                          <p className="text-xl lg:text-2xl font-bold">{formatCurrency(orderStats.total_spent)}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CreditCard className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs lg:text-sm font-medium text-muted-foreground">Pendentes</p>
                          <p className="text-xl lg:text-2xl font-bold">{orderStats.pending_orders}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs lg:text-sm font-medium text-muted-foreground">Concluídos</p>
                          <p className="text-xl lg:text-2xl font-bold">{orderStats.completed_orders}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 bg-background rounded-lg shadow-sm">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {profileData.email || 'Não informado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 bg-background rounded-lg shadow-sm">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Telefone</p>
                          <p className="text-sm text-muted-foreground">
                            {profileData.phone || 'Não informado'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-2 bg-background rounded-lg shadow-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Cidade</p>
                          <p className="text-sm text-muted-foreground">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birth_date">Data de Nascimento</Label>
                      <Input
                        id="birth_date"
                        type="date"
                        value={profileData.birth_date}
                        onChange={(e) => setProfileData(prev => ({ ...prev, birth_date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document_number">CPF/CNPJ</Label>
                    <Input
                      id="document_number"
                      value={profileData.document_number}
                      onChange={(e) => setProfileData(prev => ({ ...prev, document_number: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço de Entrega
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          value={profileData.street}
                          onChange={(e) => setProfileData(prev => ({ ...prev, street: e.target.value }))}
                          placeholder="Nome da rua"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          value={profileData.number}
                          onChange={(e) => setProfileData(prev => ({ ...prev, number: e.target.value }))}
                          placeholder="123"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={profileData.complement}
                        onChange={(e) => setProfileData(prev => ({ ...prev, complement: e.target.value }))}
                        placeholder="Apartamento, bloco, etc. (opcional)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={profileData.city}
                          onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="São Paulo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={profileData.state}
                          onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="SP"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">CEP</Label>
                        <Input
                          id="zip_code"
                          value={profileData.zip_code}
                          onChange={(e) => setProfileData(prev => ({ ...prev, zip_code: e.target.value }))}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full md:w-auto">
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
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                {getStatusIcon(order.status)}
                                <div>
                                  <h4 className="font-semibold text-lg">Pedido #{order.id.slice(0, 8)}</h4>
                                  <p className="text-sm text-muted-foreground">
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
                              <div className="text-right">
                                <p className="font-bold text-xl">{formatCurrency(order.total_amount)}</p>
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                  {getStatusText(order.status)}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Order Items */}
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium mb-2">Itens do Pedido:</h5>
                                <div className="space-y-2">
                                  {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                      <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Qtd: {item.quantity} × {formatCurrency(item.unit_price)}
                                        </p>
                                      </div>
                                      <p className="font-medium">{formatCurrency(item.total_price)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Payment and Shipping Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Status do Pagamento:</p>
                                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                                  {order.payment_status === 'pending' ? 'Pendente' : 'Pago'}
                                </Badge>
                              </div>
                              
                              {order.payment_method && (
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Método de Pagamento:</p>
                                  <p className="text-sm">{order.payment_method}</p>
                                </div>
                              )}
                            </div>
                            
                            {order.shipping_address && (
                              <div className="mb-4">
                                <p className="text-sm font-medium text-muted-foreground mb-1">Endereço de entrega:</p>
                                <p className="text-sm bg-muted/50 p-2 rounded">{order.shipping_address}</p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-4 border-t">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {order.status === 'delivered' ? 'Avalie este pedido' : 'Aguardando entrega'}
                                </span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes Completos
                              </Button>
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
      <Footer />
    </div>
  );
}