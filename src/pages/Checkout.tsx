import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';
import { useSettings } from '@/hooks/useSettings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  MapPin, CreditCard, Package, ArrowLeft, MessageCircle,
  CheckCircle2, Loader2, ShoppingCart, User, Phone
} from 'lucide-react';

interface ShippingAddress {
  full_name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zip_code: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { getWhatsAppNumber } = useSettings();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zip_code: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      navigate('/carrinho');
      return;
    }

    fetchUserProfile();
  }, [user, items, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserProfile(data);
        setShippingAddress({
          full_name: data.full_name || '',
          phone: data.phone || '',
          street: data.street || '',
          number: data.number || '',
          complement: data.complement || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['full_name', 'phone', 'street', 'number', 'city', 'state', 'zip_code'];
    const missing = required.filter(field => !shippingAddress[field as keyof ShippingAddress]);
    
    if (missing.length > 0) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return false;
    }

    if (shippingAddress.phone.length < 10) {
      toast({
        title: 'Telefone inválido',
        description: 'Por favor, informe um telefone válido.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const createOrder = async () => {
    if (!user || !validateForm()) {
      console.log('❌ VALIDAÇÃO FALHOU - User:', !!user, 'Form válido:', validateForm());
      return null;
    }

    try {
      console.log('📊 DADOS PARA CRIAÇÃO DO PEDIDO:');
      console.log('- User ID:', user.id);
      console.log('- Items:', items);
      console.log('- Endereço:', shippingAddress);
      
      const totalAmount = getTotalPrice();
      const addressString = `${shippingAddress.street}, ${shippingAddress.number}${shippingAddress.complement ? `, ${shippingAddress.complement}` : ''}, ${shippingAddress.city} - ${shippingAddress.state}, CEP: ${shippingAddress.zip_code}`;

      console.log('💰 Total:', totalAmount);
      console.log('📮 Endereço formatado:', addressString);

      // Create order
      console.log('💾 INSERINDO PEDIDO...');
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'whatsapp',
          shipping_address: addressString
        })
        .select()
        .single();

      if (orderError) {
        console.error('❌ ERRO AO CRIAR PEDIDO:', orderError);
        throw orderError;
      }

      console.log('✅ PEDIDO CRIADO:', order);

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      console.log('📦 ITENS DO PEDIDO:', orderItems);
      console.log('💾 INSERINDO ITENS...');

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('❌ ERRO AO CRIAR ITENS:', itemsError);
        throw itemsError;
      }

      console.log('✅ ITENS CRIADOS COM SUCESSO');
      return order;
    } catch (error) {
      console.error('❌ ERRO GERAL NA CRIAÇÃO DO PEDIDO:', error);
      throw error;
    }
  };

  const generateWhatsAppMessage = (orderId: string) => {
    console.log('🔥 GERANDO MENSAGEM WHATSAPP');
    console.log('📦 Items no carrinho:', items);
    console.log('🏠 Endereço:', shippingAddress);
    console.log('🆔 Order ID:', orderId);
    
    const total = getTotalPrice();
    const orderNumber = orderId.slice(0, 8).toUpperCase();
    
    let message = `🎯 *NOVO PEDIDO* 🎯\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *Pedido:* #${orderNumber}\n`;
    message += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;
    
    message += `👋 Olá! Gostaria de finalizar esta compra:\n\n`;
    
    message += `🛍️ *PRODUTOS SELECIONADOS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    items.forEach((item, index) => {
      message += `${index + 1}️⃣ *${item.name}*\n`;
      message += `   📊 Qtd: ${item.quantity} unidade${item.quantity > 1 ? 's' : ''}\n`;
      message += `   💰 Valor unitário: ${formatCurrency(item.price)}\n`;
      message += `   💵 Subtotal: *${formatCurrency(item.price * item.quantity)}*\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💸 *TOTAL GERAL: ${formatCurrency(total)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `🚚 *DADOS PARA ENTREGA*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `👤 *Nome:* ${shippingAddress.full_name}\n`;
    message += `📱 *Telefone:* ${shippingAddress.phone}\n`;
    message += `📍 *Endereço:* ${shippingAddress.street}, ${shippingAddress.number}`;
    if (shippingAddress.complement) {
      message += ` - ${shippingAddress.complement}`;
    }
    message += `\n🏙️ *Cidade:* ${shippingAddress.city} - ${shippingAddress.state}\n`;
    message += `📮 *CEP:* ${shippingAddress.zip_code}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✅ *Aguardando confirmação de pagamento*\n`;
    message += `💬 Responda este WhatsApp para prosseguir!\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `🙏 Obrigado pela preferência! 😊`;
    
    console.log('📱 MENSAGEM GERADA:', message);
    return encodeURIComponent(message);
  };

  const handleFinishOrder = async () => {
    console.log('🚀 INICIANDO FINALIZAÇÃO DO PEDIDO');
    setSubmitting(true);
    
    try {
      console.log('💾 CRIANDO PEDIDO NO BANCO...');
      const order = await createOrder();
      
      if (order) {
        console.log('✅ PEDIDO CRIADO:', order);
        
        // Clear cart
        clearCart();
        
        // Generate WhatsApp message
        console.log('📱 GERANDO MENSAGEM WHATSAPP...');
        const whatsappMessage = generateWhatsAppMessage(order.id);
        const whatsappNumber = getWhatsAppNumber();
        console.log('📞 NÚMERO WHATSAPP:', whatsappNumber);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        console.log('🔗 URL WHATSAPP:', whatsappUrl);
        
        toast({
          title: 'Pedido criado com sucesso!',
          description: `Pedido #${order.id.slice(0, 8)} - Redirecionando para WhatsApp...`,
        });
        
        // Redirect to WhatsApp
        console.log('🚀 REDIRECIONANDO PARA WHATSAPP...');
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          navigate('/minha-conta');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: 'Erro ao criar pedido',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {/* Breadcrumb & Header */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/carrinho')}
            className="mb-4 p-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Voltar ao Carrinho</span>
            <span className="sm:hidden">Voltar</span>
          </Button>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              Finalizar Compra
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Complete seus dados para finalizar o pedido
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm hidden sm:inline">Carrinho</span>
            </div>
            <div className="w-8 h-1 bg-primary"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm hidden sm:inline">Dados</span>
            </div>
            <div className="w-8 h-1 bg-muted"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm hidden sm:inline">Pagamento</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  Endereço de Entrega
                </CardTitle>
                <CardDescription className="text-sm">
                  Informe o endereço completo para entrega dos produtos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="full_name" className="text-sm font-medium">
                      Nome Completo <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        value={shippingAddress.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="pl-10 h-11"
                        placeholder="Digite seu nome completo"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Telefone <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 h-11"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="street" className="text-sm font-medium">
                      Rua/Avenida <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="mt-1 h-11"
                      placeholder="Nome da rua ou avenida"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="number" className="text-sm font-medium">
                      Número <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="number"
                      value={shippingAddress.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      className="mt-1 h-11"
                      placeholder="123"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="complement" className="text-sm font-medium">
                      Complemento
                    </Label>
                    <Input
                      id="complement"
                      value={shippingAddress.complement}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      className="mt-1 h-11"
                      placeholder="Apto, bloco, casa, etc... (opcional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      Cidade <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="mt-1 h-11"
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-sm font-medium">
                      Estado <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="mt-1 h-11"
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="zip_code" className="text-sm font-medium">
                      CEP <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="zip_code"
                      value={shippingAddress.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      className="mt-1 h-11"
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Items */}
            <Card className="shadow-sm sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.quantity}x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-medium text-sm">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary text-xl">
                    {formatCurrency(getTotalPrice())}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">WhatsApp</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Finalize via WhatsApp para maior facilidade e suporte personalizado
                  </p>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Atendimento em tempo real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Múltiplas formas de pagamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Confirmação imediata</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Button */}
            <Button 
              onClick={handleFinishOrder}
              disabled={submitting}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Criando pedido...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Finalizar no WhatsApp</span>
                </div>
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground px-2">
              Ao finalizar, você será redirecionado para o WhatsApp com todos os detalhes do seu pedido
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}