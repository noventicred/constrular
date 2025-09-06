import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Search, 
  Filter, 
  Edit, 
  Save, 
  X, 
  Calendar, 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  RefreshCw,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatOrderNumber } from '@/lib/formatters';

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

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
  } | null;
}

const statusOptions = [
  { value: 'pending', label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
  { value: 'confirmed', label: 'Confirmado', color: 'bg-blue-500', icon: CheckCircle2 },
  { value: 'shipped', label: 'Enviado', color: 'bg-purple-500', icon: Truck },
  { value: 'delivered', label: 'Entregue', color: 'bg-green-500', icon: CheckCircle2 },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
];

const paymentStatusOptions = [
  { value: 'pending', label: 'Pendente', color: 'bg-yellow-500' },
  { value: 'paid', label: 'Pago', color: 'bg-green-500' },
  { value: 'failed', label: 'Falhou', color: 'bg-red-500' },
  { value: 'refunded', label: 'Reembolsado', color: 'bg-gray-500' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState<Partial<Order>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || []);

      // Buscar itens para cada pedido
      if (ordersData && ordersData.length > 0) {
        const itemsPromises = ordersData.map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select(`
              *,
              products (
                id,
                name,
                image_url,
                sku
              )
            `)
            .eq('order_id', order.id);

          return { orderId: order.id, items: items || [] };
        });

        const itemsResults = await Promise.all(itemsPromises);
        const itemsMap: Record<string, OrderItem[]> = {};
        
        itemsResults.forEach(({ orderId, items }) => {
          itemsMap[orderId] = items;
        });

        setOrderItems(itemsMap);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pedidos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));

      toast({
        title: '✅ Status atualizado!',
        description: 'Status do pedido foi alterado com sucesso.',
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, payment_status: newPaymentStatus, updated_at: new Date().toISOString() }
          : order
      ));

      toast({
        title: '✅ Pagamento atualizado!',
        description: 'Status do pagamento foi alterado com sucesso.',
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o pagamento.',
        variant: 'destructive',
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      // Primeiro deletar os itens do pedido
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Depois deletar o pedido
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) throw orderError;

      setOrders(prev => prev.filter(order => order.id !== orderId));
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);

      toast({
        title: '✅ Pedido excluído!',
        description: 'Pedido foi removido permanentemente.',
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o pedido.',
        variant: 'destructive',
      });
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const openEditOrder = (order: Order) => {
    setEditingOrder({ ...order });
    setIsEditOpen(true);
  };

  const openDeleteConfirm = (order: Order) => {
    setOrderToDelete(order);
    setDeleteConfirmOpen(true);
  };

  const saveOrderChanges = async () => {
    if (!editingOrder.id) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: editingOrder.status,
          payment_status: editingOrder.payment_status,
          payment_method: editingOrder.payment_method,
          shipping_address: editingOrder.shipping_address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingOrder.id);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...editingOrder, updated_at: new Date().toISOString() }
          : order
      ));

      setIsEditOpen(false);
      toast({
        title: '✅ Pedido atualizado!',
        description: 'Alterações salvas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    if (!statusConfig) return null;

    const Icon = statusConfig.icon;
    return (
      <Badge className={`${statusConfig.color} text-white font-semibold flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const statusConfig = paymentStatusOptions.find(s => s.value === paymentStatus);
    if (!statusConfig) return null;

    return (
      <Badge className={`${statusConfig.color} text-white font-semibold`}>
        {statusConfig.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.total_amount, 0),
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
          <p className="text-gray-600 mt-1">Acompanhe e gerencie todos os pedidos da loja</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Entregues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID, cliente ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status do Pedido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status do Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Pagamentos</SelectItem>
                {paymentStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pedidos ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      #{formatOrderNumber(order.id)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.profiles?.full_name || 'Cliente'}</p>
                        <p className="text-sm text-gray-500">{order.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <status.icon className="h-4 w-4" />
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.payment_status}
                        onValueChange={(value) => updatePaymentStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentStatusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-semibold text-lg">
                      {formatCurrency(order.total_amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditOrder(order)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteConfirm(order)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Quando houver pedidos, eles aparecerão aqui'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalhes do Pedido #{selectedOrder ? formatOrderNumber(selectedOrder.id) : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Nome</Label>
                      <p className="font-medium">{selectedOrder.profiles?.full_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Email</Label>
                      <p className="font-medium">{selectedOrder.profiles?.email || 'Não informado'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Endereço de Entrega</Label>
                    <p className="font-medium">{selectedOrder.shipping_address || 'Não informado'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Informações do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Pagamento</Label>
                      <div className="mt-1">{getPaymentBadge(selectedOrder.payment_status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Método</Label>
                      <p className="font-medium capitalize">{selectedOrder.payment_method}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Data do Pedido</Label>
                      <p className="font-medium">
                        {new Date(selectedOrder.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Total</Label>
                      <p className="text-xl font-bold text-primary">{formatCurrency(selectedOrder.total_amount)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {orderItems[selectedOrder.id] && orderItems[selectedOrder.id].length > 0 ? (
                    <div className="space-y-4">
                      {orderItems[selectedOrder.id].map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          {item.products?.image_url && (
                            <img
                              src={item.products.image_url}
                              alt={item.product_name}
                              className="w-16 h-16 object-contain bg-white rounded-lg border"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.product_name}</h4>
                            <p className="text-sm text-gray-500">SKU: {item.products?.sku || 'N/A'}</p>
                            <p className="text-sm text-gray-500">
                              Quantidade: {item.quantity} × {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{formatCurrency(item.total_price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum item encontrado</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Pedido #{editingOrder.id ? formatOrderNumber(editingOrder.id) : ''}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status do Pedido</Label>
                <Select
                  value={editingOrder.status || ''}
                  onValueChange={(value) => setEditingOrder(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <status.icon className="h-4 w-4" />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status do Pagamento</Label>
                <Select
                  value={editingOrder.payment_status || ''}
                  onValueChange={(value) => setEditingOrder(prev => ({ ...prev, payment_status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <Input
                value={editingOrder.payment_method || ''}
                onChange={(e) => setEditingOrder(prev => ({ ...prev, payment_method: e.target.value }))}
                placeholder="PIX, Cartão, Boleto..."
              />
            </div>

            <div className="space-y-2">
              <Label>Endereço de Entrega</Label>
              <Input
                value={editingOrder.shipping_address || ''}
                onChange={(e) => setEditingOrder(prev => ({ ...prev, shipping_address: e.target.value }))}
                placeholder="Endereço completo..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={saveOrderChanges} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {orderToDelete && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800">Pedido a ser excluído:</h4>
                <p className="text-sm text-red-700">
                  ID: #{formatOrderNumber(orderToDelete.id)}
                </p>
                <p className="text-sm text-red-700">
                  Cliente: {orderToDelete.profiles?.full_name}
                </p>
                <p className="text-sm text-red-700">
                  Total: {formatCurrency(orderToDelete.total_amount)}
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteOrder(orderToDelete.id)} 
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Pedido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}