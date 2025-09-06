import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatOrderNumber } from '@/lib/formatters';
import { Search, Eye, Users, ShoppingBag, Edit, Save, X, Mail, Phone, MapPin, Calendar, FileText, Filter, MoreHorizontal, CreditCard, Package, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  birth_date: string | null;
  document_number: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  orders_count: number;
  total_spent: number;
  last_order_date?: string;
  average_order_value: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  shipping_address: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Buscar perfis de clientes (não admins)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false);

      if (profilesError) throw profilesError;

      // Buscar pedidos para cada cliente
      const clientsWithStats = [];
      
      for (const profile of profilesData || []) {
        const { data: orders } = await supabase
          .from('orders')
          .select('id, total_amount, status, created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        const completedOrders = (orders || []).filter(order => order.status === 'completed');
        const totalSpent = completedOrders.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0);
        const ordersCount = (orders || []).length;
        const averageOrderValue = ordersCount > 0 ? totalSpent / completedOrders.length : 0;
        const lastOrderDate = orders && orders.length > 0 ? orders[0].created_at : null;
        
        clientsWithStats.push({
          ...profile,
          orders_count: ordersCount,
          total_spent: totalSpent,
          average_order_value: averageOrderValue,
          last_order_date: lastOrderDate
        });
      }

      setClients(clientsWithStats);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível carregar a lista de clientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClientOrders = async (clientId: string) => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientOrders(orders || []);
    } catch (error) {
      console.error('Error fetching client orders:', error);
      toast({
        title: 'Erro ao carregar pedidos',
        description: 'Não foi possível carregar os pedidos do cliente.',
        variant: 'destructive',
      });
    }
  };

  const handleViewClient = async (client: Client) => {
    setSelectedClient(client);
    setViewDialogOpen(true);
    await fetchClientOrders(client.id);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient({ ...client });
    setEditDialogOpen(true);
  };

  const handleSaveClient = async () => {
    if (!editingClient) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingClient.full_name,
          email: editingClient.email,
          phone: editingClient.phone,
          street: editingClient.street,
          number: editingClient.number,
          complement: editingClient.complement,
          city: editingClient.city,
          state: editingClient.state,
          zip_code: editingClient.zip_code,
          birth_date: editingClient.birth_date,
          document_number: editingClient.document_number,
        })
        .eq('id', editingClient.id);

      if (error) throw error;

      // Atualizar a lista local
      setClients(clients.map(client => 
        client.id === editingClient.id ? editingClient : client
      ));

      toast({
        title: 'Cliente atualizado',
        description: 'As informações do cliente foram atualizadas com sucesso.',
      });

      setEditDialogOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar as informações do cliente.',
        variant: 'destructive',
      });
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.document_number?.includes(searchTerm);

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && client.orders_count > 0) ||
      (filterStatus === 'inactive' && client.orders_count === 0);

    return matchesSearch && matchesFilter;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.orders_count > 0).length;
  const totalSpent = clients.reduce((sum, client) => sum + client.total_spent, 0);
  const totalOrders = clients.reduce((sum, client) => sum + client.orders_count, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-6"></div>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Gestão de Clientes
        </h1>
        <p className="text-muted-foreground">
          Visualize, edite e gerencie informações completas dos seus clientes
        </p>
      </div>

      {/* Estatísticas Melhoradas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {activeClients} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Em vendas completadas
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos realizados
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-construction-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Por pedido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Visualize e gerencie informações detalhadas dos clientes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, telefone ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Badge variant="outline" className="ml-auto">
              {filteredClients.length} clientes
            </Badge>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Atividade</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Último Pedido</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {client.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.full_name || 'Sem nome'}</div>
                            <div className="text-sm text-muted-foreground">{client.email}</div>
                            {client.document_number && (
                              <div className="text-xs text-muted-foreground">
                                Doc: {client.document_number}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.phone ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sem telefone</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {client.city && client.state ? (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              {client.city}, {client.state}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Não informado</span>
                          )}
                          {client.zip_code && (
                            <div className="text-xs text-muted-foreground">
                              CEP: {client.zip_code}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={client.orders_count > 0 ? "default" : "secondary"}>
                            {client.orders_count} pedidos
                          </Badge>
                          {client.orders_count > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Média: {formatCurrency(client.average_order_value)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatCurrency(client.total_spent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {client.last_order_date ? (
                            new Date(client.last_order_date).toLocaleDateString('pt-BR')
                          ) : (
                            <span className="text-muted-foreground">Nunca</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Cadastro: {new Date(client.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewClient(client)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Visualizar Cliente */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {selectedClient?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              Perfil do Cliente: {selectedClient?.full_name || 'Sem nome'}
            </DialogTitle>
            <DialogDescription>
              Informações completas e histórico de pedidos
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
                <TabsTrigger value="orders">Pedidos ({clientOrders.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Nome Completo
                    </Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.full_name || 'Não informado'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.email || 'Não informado'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.phone || 'Não informado'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documento
                    </Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.document_number || 'Não informado'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Data de Nascimento
                    </Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.birth_date 
                        ? new Date(selectedClient.birth_date).toLocaleDateString('pt-BR')
                        : 'Não informado'
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Cadastro</Label>
                    <div className="p-3 bg-muted rounded-md">
                      {new Date(selectedClient.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Endereço Completo</Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.street && selectedClient.number 
                        ? `${selectedClient.street}, ${selectedClient.number}${selectedClient.complement ? `, ${selectedClient.complement}` : ''}`
                        : 'Não informado'
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.city || 'Não informado'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.state || 'Não informado'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <div className="p-3 bg-muted rounded-md">
                      {selectedClient.zip_code || 'Não informado'}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                {clientOrders.length > 0 ? (
                  <div className="space-y-3">
                    {clientOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="font-medium">
                                Pedido #{formatOrderNumber(order.id)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="font-medium">
                                {formatCurrency(Number(order.total_amount))}
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={
                                  order.status === 'completed' ? 'default' :
                                  order.status === 'pending' ? 'secondary' :
                                  'destructive'
                                }>
                                  {order.status}
                                </Badge>
                                <Badge variant="outline">
                                  {order.payment_method || 'N/A'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum pedido encontrado
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Cliente */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente
            </DialogDescription>
          </DialogHeader>

          {editingClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={editingClient.full_name || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      full_name: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingClient.email || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      email: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editingClient.phone || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      phone: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_number">Documento</Label>
                  <Input
                    id="document_number"
                    value={editingClient.document_number || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      document_number: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={editingClient.birth_date || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      birth_date: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input
                    id="zip_code"
                    value={editingClient.zip_code || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      zip_code: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={editingClient.street || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      street: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={editingClient.number || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      number: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={editingClient.complement || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      complement: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={editingClient.city || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      city: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={editingClient.state || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      state: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button onClick={handleSaveClient}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClients;