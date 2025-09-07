import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatOrderNumber } from "@/lib/formatters";

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
  { value: "pending", label: "Pendente", color: "bg-yellow-500", icon: Clock },
  {
    value: "confirmed",
    label: "Confirmado",
    color: "bg-blue-500",
    icon: CheckCircle2,
  },
  { value: "shipped", label: "Enviado", color: "bg-purple-500", icon: Truck },
  {
    value: "delivered",
    label: "Entregue",
    color: "bg-green-500",
    icon: CheckCircle2,
  },
  {
    value: "cancelled",
    label: "Cancelado",
    color: "bg-red-500",
    icon: XCircle,
  },
];

const paymentStatusOptions = [
  { value: "pending", label: "Pendente", color: "bg-yellow-500" },
  { value: "paid", label: "Pago", color: "bg-green-500" },
  { value: "failed", label: "Falhou", color: "bg-red-500" },
  { value: "refunded", label: "Reembolsado", color: "bg-gray-500" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
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
      // Primeiro, buscar apenas os pedidos
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Orders error:", ordersError);
        throw ordersError;
      }

      // Se não há pedidos, definir array vazio e sair
      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setOrderItems({});
        return;
      }

      // Buscar perfis separadamente para evitar problemas de join
      const userIds = [
        ...new Set(ordersData.map((order) => order.user_id).filter(Boolean)),
      ];
      let profilesMap: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);

        if (profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, any>);
        }
      }

      // Combinar pedidos com perfis
      const ordersWithProfiles = ordersData.map((order) => ({
        ...order,
        profiles: order.user_id ? profilesMap[order.user_id] : null,
      }));

      setOrders(ordersWithProfiles);

      // Buscar itens dos pedidos
      const { data: itemsData } = await supabase
        .from("order_items")
        .select(
          `
          *,
          products (
            id,
            name,
            image_url,
            sku
          )
        `
        )
        .in(
          "order_id",
          ordersData.map((o) => o.id)
        );

      // Organizar itens por pedido
      const itemsMap: Record<string, OrderItem[]> = {};
      if (itemsData) {
        itemsData.forEach((item) => {
          if (!itemsMap[item.order_id]) {
            itemsMap[item.order_id] = [];
          }
          itemsMap[item.order_id].push(item);
        });
      }

      setOrderItems(itemsMap);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Verifique se as tabelas existem no banco de dados.",
        variant: "destructive",
      });
      // Em caso de erro, definir estados vazios para evitar crashes
      setOrders([]);
      setOrderItems({});
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : order
        )
      );

      toast({
        title: "✅ Status atualizado!",
        description: "Status do pedido foi alterado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    newPaymentStatus: string
  ) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                payment_status: newPaymentStatus,
                updated_at: new Date().toISOString(),
              }
            : order
        )
      );

      toast({
        title: "✅ Pagamento atualizado!",
        description: "Status do pagamento foi alterado com sucesso.",
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pagamento.",
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      // Primeiro deletar os itens do pedido
      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      // Depois deletar o pedido
      const { error: orderError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (orderError) throw orderError;

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);

      toast({
        title: "✅ Pedido excluído!",
        description: "Pedido foi removido permanentemente.",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pedido.",
        variant: "destructive",
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
        .from("orders")
        .update({
          status: editingOrder.status,
          payment_status: editingOrder.payment_status,
          payment_method: editingOrder.payment_method,
          shipping_address: editingOrder.shipping_address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingOrder.id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                ...editingOrder,
                updated_at: new Date().toISOString(),
              }
            : order
        )
      );

      setIsEditOpen(false);
      toast({
        title: "✅ Pedido atualizado!",
        description: "Alterações salvas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    if (!statusConfig) return null;

    const Icon = statusConfig.icon;
    return (
      <Badge
        className={`${statusConfig.color} text-white font-semibold flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const statusConfig = paymentStatusOptions.find(
      (s) => s.value === paymentStatus
    );
    if (!statusConfig) return null;

    return (
      <Badge className={`${statusConfig.color} text-white font-semibold`}>
        {statusConfig.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.profiles?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter;

    // Filtro de data
    let matchesDate = true;
    const orderDate = new Date(order.created_at);
    const today = new Date();

    if (dateFilter === "today") {
      matchesDate = orderDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = orderDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = orderDate >= monthAgo;
    } else if (dateFilter === "custom" && customDateFrom && customDateTo) {
      const fromDate = new Date(customDateFrom);
      const toDate = new Date(customDateTo);
      toDate.setHours(23, 59, 59); // Incluir todo o dia
      matchesDate = orderDate >= fromDate && orderDate <= toDate;
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter((o) => o.status === "pending").length,
    confirmed: filteredOrders.filter((o) => o.status === "confirmed").length,
    shipped: filteredOrders.filter((o) => o.status === "shipped").length,
    delivered: filteredOrders.filter((o) => o.status === "delivered").length,
    revenue: filteredOrders.reduce((sum, o) => sum + o.total_amount, 0),
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
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Pedidos
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe e gerencie todos os pedidos da loja
          </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Total de Pedidos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.delivered}
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Receita Total
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.revenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
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
                <SelectTrigger className="w-full lg:w-48">
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
                <SelectTrigger className="w-full lg:w-48">
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

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Datas</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {dateFilter === "custom" && (
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-blue-700">
                    Data Inicial
                  </Label>
                  <Input
                    type="date"
                    value={customDateFrom}
                    onChange={(e) => setCustomDateFrom(e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-semibold text-blue-700">
                    Data Final
                  </Label>
                  <Input
                    type="date"
                    value={customDateTo}
                    onChange={(e) => setCustomDateTo(e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCustomDateFrom("");
                      setCustomDateTo("");
                      setDateFilter("all");
                    }}
                    className="h-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
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
                        <p className="font-medium">
                          {order.profiles?.full_name || "Cliente"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.profiles?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(order.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value)
                        }
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
                        onValueChange={(value) =>
                          updatePaymentStatus(order.id, value)
                        }
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
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Quando houver pedidos, eles aparecerão aqui"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Detalhes do Pedido #
                  {selectedOrder ? formatOrderNumber(selectedOrder.id) : ""}
                </h2>
                <p className="text-sm text-gray-600">
                  Informações completas do pedido
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Customer Info */}
              <Card className="lg:col-span-1">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Nome
                      </Label>
                      <p className="font-semibold text-gray-800">
                        {selectedOrder.profiles?.full_name || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </Label>
                      <p className="font-medium text-gray-700">
                        {selectedOrder.profiles?.email || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Endereço
                      </Label>
                      <p className="font-medium text-gray-700 leading-relaxed">
                        {selectedOrder.shipping_address || "Não informado"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Info */}
              <Card className="lg:col-span-1">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-600" />
                    Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </Label>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Pagamento
                      </Label>
                      {getPaymentBadge(selectedOrder.payment_status)}
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Método
                      </Label>
                      <p className="font-semibold text-gray-800 capitalize">
                        {selectedOrder.payment_method || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Data
                      </Label>
                      <p className="font-medium text-gray-700">
                        {new Date(selectedOrder.created_at).toLocaleString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Total
                      </Label>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(selectedOrder.total_amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="lg:col-span-1">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    Itens ({orderItems[selectedOrder.id]?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {orderItems[selectedOrder.id] &&
                  orderItems[selectedOrder.id].length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {orderItems[selectedOrder.id].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            {item.products?.image_url ? (
                              <img
                                src={item.products.image_url.split(",")[0]}
                                alt={item.product_name}
                                className="w-full h-full object-contain bg-white p-1"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight mb-1">
                              {item.product_name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-1">
                              SKU: {item.products?.sku || "N/A"}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">
                                {item.quantity}x{" "}
                                {formatCurrency(item.unit_price)}
                              </span>
                              <span className="font-bold text-sm text-primary">
                                {formatCurrency(item.total_price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Total Summary */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-lg">
                          <span className="font-semibold text-gray-800">
                            Total do Pedido:
                          </span>
                          <span className="font-bold text-xl text-primary">
                            {formatCurrency(selectedOrder.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nenhum item encontrado</p>
                    </div>
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
              Editar Pedido #
              {editingOrder.id ? formatOrderNumber(editingOrder.id) : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status do Pedido</Label>
                <Select
                  value={editingOrder.status || ""}
                  onValueChange={(value) =>
                    setEditingOrder((prev) => ({ ...prev, status: value }))
                  }
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
                  value={editingOrder.payment_status || ""}
                  onValueChange={(value) =>
                    setEditingOrder((prev) => ({
                      ...prev,
                      payment_status: value,
                    }))
                  }
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
                value={editingOrder.payment_method || ""}
                onChange={(e) =>
                  setEditingOrder((prev) => ({
                    ...prev,
                    payment_method: e.target.value,
                  }))
                }
                placeholder="PIX, Cartão, Boleto..."
              />
            </div>

            <div className="space-y-2">
              <Label>Endereço de Entrega</Label>
              <Input
                value={editingOrder.shipping_address || ""}
                onChange={(e) =>
                  setEditingOrder((prev) => ({
                    ...prev,
                    shipping_address: e.target.value,
                  }))
                }
                placeholder="Endereço completo..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="flex-1"
              >
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
              Tem certeza que deseja excluir este pedido? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>

          {orderToDelete && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800">
                  Pedido a ser excluído:
                </h4>
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
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="flex-1"
                >
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
