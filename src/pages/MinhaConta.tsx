import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, MapPin, Phone, Mail, Calendar, Save, Package, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: string | null;
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
    if (profile && user) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || user.email || '',
        phone: profile.phone || '',
        birth_date: profile.birth_date || '',
        street: profile.street || '',
        number: profile.number || '',
        complement: profile.complement || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || '',
        document_number: profile.document_number || '',
      });
    }
    fetchOrders();
  }, [profile, user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'confirmed': return 'text-blue-600';
      case 'shipped': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você precisa estar logado para acessar sua conta.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Minha Conta</h1>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Pedidos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
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
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold">Pedido #{order.id.slice(0, 8)}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{formatCurrency(order.total_amount)}</p>
                                <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusText(order.status)}
                                </p>
                              </div>
                            </div>
                            
                            {order.shipping_address && (
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-1">Endereço de entrega:</p>
                                <p className="text-sm">{order.shipping_address}</p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-2 border-t">
                              <p className="text-sm text-muted-foreground">
                                Pagamento: {order.payment_status === 'pending' ? 'Pendente' : 'Pago'}
                              </p>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
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
    </div>
  );
}