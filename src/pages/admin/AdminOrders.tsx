import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, Package, Clock, CheckCircle2, XCircle, Truck, Search, Filter, 
  Edit, Save, X, Calendar, CreditCard, MapPin, User, Phone, Mail,
  TrendingUp, DollarSign, ShoppingCart, RefreshCw, FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';
import { useSettings } from '@/hooks/useSettings';
import jsPDF from 'jspdf';

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
  };
}

const statusOptions = [
  { value: 'pending', label: 'Pendente', icon: Clock, color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Confirmado', icon: CheckCircle2, color: 'bg-blue-500' },
  { value: 'processing', label: 'Processando', icon: Package, color: 'bg-blue-600' },
  { value: 'shipped', label: 'Enviado', icon: Truck, color: 'bg-purple-500' },
  { value: 'delivered', label: 'Entregue', icon: CheckCircle2, color: 'bg-green-500' },
  { value: 'cancelled', label: 'Cancelado', icon: XCircle, color: 'bg-red-500' },
];

const paymentStatusOptions = [
  { value: 'pending', label: 'Aguardando Pagamento', color: 'secondary' },
  { value: 'paid', label: 'Pago', color: 'default' },
  { value: 'cancelled', label: 'Cancelado', color: 'destructive' },
  { value: 'refunded', label: 'Reembolsado', color: 'outline' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);
  const { toast } = useToast();
  const { settings } = useSettings();

  // Statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    todayOrders: 0,
    thisMonthRevenue: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, paymentFilter, dateRange]);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const fetchOrders = async () => {
    console.log('🚀 ADMIN: NOVA VERSÃO - Iniciando busca de pedidos...');
    try {
      // First get all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('❌ ADMIN: Erro ao buscar pedidos:', ordersError);
        throw ordersError;
      }

      console.log('📦 ADMIN: Pedidos encontrados:', ordersData?.length || 0);

      // Get unique user IDs
      const userIds = [...new Set(ordersData?.map(order => order.user_id).filter(Boolean))];
      console.log('👥 ADMIN: User IDs únicos:', userIds.length);

      // Get profiles for these users
      let profilesData = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, street, number, city, state, zip_code')
          .in('id', userIds);

        if (profilesError) {
          console.warn('⚠️ ADMIN: Erro ao buscar profiles (continuando sem eles):', profilesError);
        } else {
          profilesData = profiles || [];
          console.log('👤 ADMIN: Profiles encontrados:', profilesData.length);
        }
      }

      // Combine orders with profiles
      const ordersWithProfiles = ordersData?.map(order => ({
        ...order,
        profiles: profilesData.find(profile => profile.id === order.user_id) || null
      })) || [];

      console.log('✅ ADMIN: Pedidos com profiles combinados:', ordersWithProfiles.length);
      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('❌ ADMIN: Erro geral:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pedidos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentFilter);
    }

    // Date filter
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(order => 
        new Date(order.created_at) >= startDate
      );
    }

    setFilteredOrders(filtered);
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(order => 
      new Date(order.created_at) >= today
    ).length;

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthRevenue = orders
      .filter(order => new Date(order.created_at) >= startOfMonth)
      .reduce((sum, order) => sum + order.total_amount, 0);

    setStats({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      todayOrders,
      thisMonthRevenue
    });
  };

  const fetchOrderItems = async (orderId: string) => {
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products!order_items_product_id_fkey(
            id,
            name,
            image_url,
            sku
          )
        `)
        .eq('order_id', orderId);

      if (error) throw error;
      console.log('📦 ADMIN: Itens do pedido com produtos:', data);
      setOrderItems(data || []);
    } catch (error) {
      console.error('❌ ADMIN: Erro ao carregar itens:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os itens do pedido',
        variant: 'destructive',
      });
    } finally {
      setLoadingItems(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    // Show confirmation for critical status changes
    if (status === 'cancelled' || status === 'delivered') {
      const statusText = status === 'cancelled' ? 'CANCELAR' : 'MARCAR COMO ENTREGUE';
      const confirmed = window.confirm(
        `Tem certeza que deseja ${statusText} este pedido?\n\nEsta ação irá alterar o status do pedido para "${statusOptions.find(s => s.value === status)?.label}".`
      );
      if (!confirmed) return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }

      toast({
        title: 'Status Atualizado',
        description: `Status do pedido alterado para "${statusOptions.find(s => s.value === status)?.label}"`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do pedido',
        variant: 'destructive',
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    // Show confirmation for important payment status changes
    if (paymentStatus === 'paid' || paymentStatus === 'cancelled' || paymentStatus === 'refunded') {
      const statusText = paymentStatusOptions.find(s => s.value === paymentStatus)?.label;
      const confirmed = window.confirm(
        `Tem certeza que deseja alterar o status de pagamento para "${statusText}"?\n\nEsta ação pode impactar o processamento do pedido.`
      );
      if (!confirmed) return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, payment_status: paymentStatus } : order
      ));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
      }

      toast({
        title: 'Pagamento Atualizado',
        description: `Status de pagamento alterado para "${paymentStatusOptions.find(s => s.value === paymentStatus)?.label}"`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status de pagamento',
        variant: 'destructive',
      });
    }
  };

  const updateOrderDetails = async (orderId: string, updates: Partial<Order>) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      ));

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, ...updates });
      }

      setIsEditDialogOpen(false);
      setEditingOrder(null);

      toast({
        title: 'Sucesso',
        description: 'Pedido atualizado com sucesso',
      });

      fetchOrders(); // Refresh to get updated data
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o pedido',
        variant: 'destructive',
      });
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
    setIsDialogOpen(true);
  };

  const openEditDialog = (order: Order) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateRange('all');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    if (!statusConfig) return null;
    
    const Icon = statusConfig.icon;
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
        {statusConfig.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = paymentStatusOptions.find(s => s.value === status);
    return (
      <Badge variant={statusConfig?.color as any || 'secondary'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const generateOrderPDF = async (order: Order) => {
    if (generatingPdf === order.id) return;
    
    setGeneratingPdf(order.id);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = 30;

      // Helper functions
      const drawSection = (title: string, yPos: number) => {
        pdf.setFillColor(248, 250, 252); // Light gray background
        pdf.rect(margin, yPos - 5, pageWidth - 2 * margin, 15, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(30, 58, 138); // Dark blue
        pdf.text(title, margin + 5, yPos + 5);
        return yPos + 20;
      };

      const addField = (label: string, value: string, x: number, y: number, maxWidth = 80) => {
        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99); // Gray-600
        pdf.text(`${label}:`, x, y);
        pdf.setTextColor(17, 24, 39); // Gray-900
        const wrappedText = pdf.splitTextToSize(value || 'Não informado', maxWidth);
        pdf.text(wrappedText, x, y + 5);
        return Array.isArray(wrappedText) ? wrappedText.length * 5 + 5 : 10;
      };

      // Company header with branding
      pdf.setFillColor(59, 130, 246); // Blue gradient start
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text(settings.store_name || 'Minha Loja', margin, 22);
      
      pdf.setFontSize(10);
      pdf.setTextColor(239, 246, 255); // Light blue
      pdf.text(settings.store_email || 'contato@minhaloja.com', margin, 30);
      
      // Order header section
      yPosition = drawSection('INFORMAÇÕES DO PEDIDO', yPosition + 15);
      
      // Order ID and date in a nice box
      pdf.setFillColor(240, 249, 255); // Very light blue
      pdf.setDrawColor(219, 234, 254); // Light blue border
      pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 25, 'FD');
      
      pdf.setFontSize(16);
      pdf.setTextColor(30, 58, 138);
      pdf.text(`Pedido #${order.id.slice(0, 8).toUpperCase()}`, margin + 10, yPosition + 8);
      
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      pdf.text(`Emitido em: ${new Date(order.created_at).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`, margin + 10, yPosition + 17);
      
      yPosition += 35;
      
      // Status badges
      const statusConfig = statusOptions.find(s => s.value === order.status);
      const paymentConfig = paymentStatusOptions.find(s => s.value === order.payment_status);
      
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      
      // Order status badge
      if (order.status === 'delivered') {
        pdf.setFillColor(34, 197, 94); // Green
      } else if (order.status === 'cancelled') {
        pdf.setFillColor(239, 68, 68); // Red
      } else if (order.status === 'shipped') {
        pdf.setFillColor(168, 85, 247); // Purple
      } else {
        pdf.setFillColor(251, 191, 36); // Yellow
      }
      pdf.rect(margin, yPosition, 50, 12, 'F');
      pdf.text(statusConfig?.label || order.status, margin + 3, yPosition + 8);
      
      // Payment status badge
      if (order.payment_status === 'paid') {
        pdf.setFillColor(34, 197, 94); // Green
      } else if (order.payment_status === 'cancelled') {
        pdf.setFillColor(239, 68, 68); // Red
      } else {
        pdf.setFillColor(251, 191, 36); // Yellow
      }
      pdf.rect(margin + 60, yPosition, 60, 12, 'F');
      pdf.text(paymentConfig?.label || order.payment_status, margin + 63, yPosition + 8);
      
      yPosition += 25;
      
      // Customer information section
      yPosition = drawSection('DADOS DO CLIENTE', yPosition);
      
      let customerYPos = yPosition;
      customerYPos += addField('Nome Completo', order.profiles?.full_name || '', margin + 5, customerYPos);
      customerYPos += addField('E-mail', order.profiles?.email || '', margin + 5, customerYPos);
      
      if ((order.profiles as any)?.phone) {
        customerYPos += addField('Telefone', (order.profiles as any).phone, margin + 5, customerYPos);
      }
      
      yPosition = customerYPos + 10;
      
      // Shipping address section
      if (order.shipping_address || (order.profiles as any)?.street) {
        yPosition = drawSection('ENDEREÇO DE ENTREGA', yPosition);
        
        let addressYPos = yPosition;
        if (order.shipping_address) {
          addressYPos += addField('Endereço', order.shipping_address, margin + 5, addressYPos, pageWidth - 50);
        } else {
          const profile = order.profiles as any;
          if (profile?.street) {
            addressYPos += addField('Rua', `${profile.street}, ${profile.number || 'S/N'}`, margin + 5, addressYPos);
          }
          if (profile?.city) {
            addressYPos += addField('Cidade', `${profile.city} - ${profile.state || ''}`, margin + 5, addressYPos);
          }
          if (profile?.zip_code) {
            addressYPos += addField('CEP', profile.zip_code, margin + 5, addressYPos);
          }
        }
        yPosition = addressYPos + 15;
      }
      
      // Get order items for PDF
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      // Order items section
      yPosition = drawSection('ITENS DO PEDIDO', yPosition);
      
      // Table header with styling
      pdf.setFillColor(229, 231, 235); // Gray-200
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81); // Gray-700
      pdf.text('PRODUTO', margin + 5, yPosition + 10);
      pdf.text('QTD', pageWidth - 120, yPosition + 10);
      pdf.text('VALOR UNIT.', pageWidth - 90, yPosition + 10);
      pdf.text('TOTAL', pageWidth - 45, yPosition + 10);
      
      yPosition += 20;
      
      let subtotal = 0;
      items?.forEach((item, index) => {
        // Zebra striping for better readability
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251); // Very light gray
          pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 15, 'F');
        }
        
        pdf.setFontSize(9);
        pdf.setTextColor(17, 24, 39); // Gray-900
        
        const productName = pdf.splitTextToSize(item.product_name, pageWidth - 150);
        pdf.text(productName[0] + (productName.length > 1 ? '...' : ''), margin + 5, yPosition + 8);
        
        pdf.text(item.quantity.toString(), pageWidth - 115, yPosition + 8);
        pdf.text(formatCurrency(item.unit_price), pageWidth - 90, yPosition + 8);
        
        pdf.setTextColor(59, 130, 246); // Blue for prices
        pdf.text(formatCurrency(item.total_price), pageWidth - 45, yPosition + 8);
        
        subtotal += item.total_price;
        yPosition += 15;
        
        // Check if we need a new page
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 30;
        }
      });
      
      // Total section with emphasis
      yPosition += 10;
      pdf.setDrawColor(229, 231, 235);
      pdf.line(pageWidth - 120, yPosition, pageWidth - margin, yPosition);
      
      yPosition += 15;
      pdf.setFillColor(30, 58, 138); // Dark blue background
      pdf.rect(pageWidth - 120, yPosition - 8, 100, 20, 'F');
      
      pdf.setFontSize(12);
      pdf.setTextColor(255, 255, 255);
      pdf.text('VALOR TOTAL:', pageWidth - 115, yPosition + 3);
      
      pdf.setFontSize(16);
      pdf.text(formatCurrency(order.total_amount), pageWidth - 60, yPosition + 3);
      
      // Payment method
      yPosition += 30;
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      pdf.text(`Método de Pagamento: ${order.payment_method || 'Não informado'}`, margin, yPosition);
      
      // Footer with modern styling
      const footerY = pageHeight - 25;
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175); // Gray-400
      pdf.text('Este documento foi gerado automaticamente pelo sistema', margin, footerY);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth - 80, footerY);
      
      // Confidentiality notice
      pdf.text('Este documento contém informações confidenciais e deve ser tratado com sigilo.', margin, footerY + 8);
      
      // Save PDF with better naming
      const orderDate = new Date(order.created_at).toLocaleDateString('pt-BR').replace(/\//g, '-');
      const customerName = order.profiles?.full_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Cliente';
      pdf.save(`Pedido_${order.id.slice(0, 8)}_${customerName}_${orderDate}.pdf`);
      
      toast({
        title: 'PDF Gerado com Sucesso',
        description: `PDF do pedido #${order.id.slice(0, 8)} foi criado e baixado.`,
      });
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro ao Gerar PDF',
        description: 'Não foi possível gerar o PDF do pedido. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPdf(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos da loja</p>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os pedidos da loja ({filteredOrders.length} de {orders.length} pedidos)
          </p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
            </div>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
            <p className="text-xs text-muted-foreground">
              {stats.todayOrders} hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.thisMonthRevenue)} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Pedidos Pendentes</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="ID, cliente, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status do Pedido</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Status do Pagamento</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os pagamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pagamentos</SelectItem>
                  {paymentStatusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os pedidos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.profiles?.full_name || 'Cliente Anônimo'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.profiles?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.total_amount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateOrderPDF(order)}
                        disabled={generatingPdf === order.id}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        {generatingPdf === order.id ? 'Gerando...' : 'PDF'}
                      </Button>
                      <div className="flex flex-col gap-1">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                  {status.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={order.payment_status}
                          onValueChange={(value) => updatePaymentStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && orders.length > 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Nenhum pedido corresponde aos filtros aplicados.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          )}

          {orders.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground">
                Os pedidos aparecerão aqui quando forem realizados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Detalhes do Pedido #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>
              Informações completas sobre o pedido
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="customer">Cliente</TabsTrigger>
                <TabsTrigger value="items">Itens</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Informações Gerais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">ID do Pedido:</span>
                        <p className="font-mono text-sm">{selectedOrder.id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Data de Criação:</span>
                        <p className="text-sm">{new Date(selectedOrder.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Última Atualização:</span>
                        <p className="text-sm">{new Date(selectedOrder.updated_at).toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <p className="text-xl font-bold text-primary">{formatCurrency(selectedOrder.total_amount)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Status do Pedido
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Status do Pedido</Label>
                        <Select
                          value={selectedOrder.status}
                          onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                                  {status.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Status do Pagamento</Label>
                        <Select
                          value={selectedOrder.payment_status}
                          onValueChange={(value) => updatePaymentStatus(selectedOrder.id, value)}
                        >
                          <SelectTrigger className="mt-1">
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
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Pagamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Método:</span>
                        <p className="font-medium">{selectedOrder.payment_method || 'Não informado'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <div className="mt-1">{getPaymentStatusBadge(selectedOrder.payment_status)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="customer" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informações do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{selectedOrder.profiles?.full_name || 'Nome não informado'}</p>
                            <p className="text-sm text-muted-foreground">Nome completo</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{selectedOrder.profiles?.email || 'Email não informado'}</p>
                            <p className="text-sm text-muted-foreground">Email</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{(selectedOrder.profiles as any)?.phone || 'Telefone não informado'}</p>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-medium">Endereço de Entrega</p>
                            <div className="text-sm text-muted-foreground space-y-1">
                              {selectedOrder.shipping_address ? (
                                <p>{selectedOrder.shipping_address}</p>
                              ) : (
                                <>
                                  {(selectedOrder.profiles as any)?.street && (
                                    <p>{(selectedOrder.profiles as any).street}, {(selectedOrder.profiles as any)?.number}</p>
                                  )}
                                  {(selectedOrder.profiles as any)?.city && (
                                    <p>{(selectedOrder.profiles as any).city} - {(selectedOrder.profiles as any)?.state}</p>
                                  )}
                                  {(selectedOrder.profiles as any)?.zip_code && (
                                    <p>CEP: {(selectedOrder.profiles as any).zip_code}</p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Itens do Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingItems ? (
                      <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {orderItems.map((item) => (
                            <Card key={item.id} className="p-4">
                              <div className="flex items-start gap-4">
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
                                      <Package className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm">{item.product_name}</h4>
                                  {item.products?.sku && (
                                    <p className="text-xs text-muted-foreground">SKU: {item.products.sku}</p>
                                  )}
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="text-sm text-muted-foreground">
                                      Qtd: {item.quantity} × {formatCurrency(item.unit_price)}
                                    </div>
                                    <div className="font-semibold">
                                      {formatCurrency(item.total_price)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        <Separator className="my-4" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total do Pedido:</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(selectedOrder.total_amount)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Pedido #{editingOrder?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>
              Edite as informações do pedido
            </DialogDescription>
          </DialogHeader>

          {editingOrder && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updates = {
                status: formData.get('status') as string,
                payment_status: formData.get('payment_status') as string,
                payment_method: formData.get('payment_method') as string,
                shipping_address: formData.get('shipping_address') as string,
              };
              updateOrderDetails(editingOrder.id, updates);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status do Pedido</Label>
                  <Select name="status" defaultValue={editingOrder.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.color}`} />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_status">Status do Pagamento</Label>
                  <Select name="payment_status" defaultValue={editingOrder.payment_status}>
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
                <Label htmlFor="payment_method">Método de Pagamento</Label>
                <Input
                  id="payment_method"
                  name="payment_method"
                  defaultValue={editingOrder.payment_method || ''}
                  placeholder="Ex: Cartão de Crédito, PIX, Boleto..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping_address">Endereço de Entrega</Label>
                <Textarea
                  id="shipping_address"
                  name="shipping_address"
                  defaultValue={editingOrder.shipping_address || ''}
                  placeholder="Endereço completo para entrega..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}