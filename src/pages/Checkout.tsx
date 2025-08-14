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
    if (!user || !validateForm()) return null;

    try {
      const totalAmount = getTotalPrice();
      const addressString = `${shippingAddress.street}, ${shippingAddress.number}${shippingAddress.complement ? `, ${shippingAddress.complement}` : ''}, ${shippingAddress.city} - ${shippingAddress.state}, CEP: ${shippingAddress.zip_code}`;

      // Create order
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

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const generateWhatsAppMessage = (orderId: string) => {
    const total = getTotalPrice();
    const orderNumber = orderId.slice(0, 8).toUpperCase();
    
    let message = `🛒 *NOVA COMPRA - Pedido #${orderNumber}*\n\n`;
    message += `Olá! Gostaria de pagar esta compra:\n\n`;
    
    message += `📦 *PRODUTOS:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qtd: ${item.quantity}x | Valor: ${formatCurrency(item.price)}\n`;
      message += `   Subtotal: ${formatCurrency(item.price * item.quantity)}\n\n`;
    });
    
    message += `💰 *TOTAL: ${formatCurrency(total)}*\n\n`;
    
    message += `🚚 *ENTREGA:*\n`;
    message += `${shippingAddress.full_name}\n`;
    message += `📱 ${shippingAddress.phone}\n`;
    message += `📍 ${shippingAddress.street}, ${shippingAddress.number}`;
    if (shippingAddress.complement) {
      message += `, ${shippingAddress.complement}`;
    }
    message += `\n${shippingAddress.city} - ${shippingAddress.state}\n`;
    message += `CEP: ${shippingAddress.zip_code}\n\n`;
    
    message += `Aguardo confirmação do pagamento! 😊`;
    
    return encodeURIComponent(message);
  };

  const handleFinishOrder = async () => {
    setSubmitting(true);
    
    try {
      const order = await createOrder();
      
      if (order) {
        // Clear cart
        clearCart();
        
        // Generate WhatsApp message
        const whatsappMessage = generateWhatsAppMessage(order.id);
        const whatsappUrl = `https://wa.me/${getWhatsAppNumber()}?text=${whatsappMessage}`;
        
        toast({
          title: 'Pedido criado com sucesso!',
          description: `Pedido #${order.id.slice(0, 8)} - Redirecionando para WhatsApp...`,
        });
        
        // Redirect to WhatsApp
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/carrinho')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Carrinho
            </Button>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Finalizar Compra</h1>
              <p className="text-muted-foreground">
                Complete seus dados para finalizar o pedido
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço de Entrega
                </CardTitle>
                <CardDescription>
                  Informe o endereço completo para entrega
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="full_name">Nome Completo *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        value={shippingAddress.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="pl-10"
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="street">Rua/Avenida *</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      placeholder="Nome da rua"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      value={shippingAddress.number}
                      onChange={(e) => handleInputChange('number', e.target.value)}
                      placeholder="123"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      value={shippingAddress.complement}
                      onChange={(e) => handleInputChange('complement', e.target.value)}
                      placeholder="Apto 45, Bloco B, etc..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="zip_code">CEP *</Label>
                    <Input
                      id="zip_code"
                      value={shippingAddress.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(getTotalPrice())}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Pagamento via WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Método Selecionado
                  </Badge>
                  <p className="text-sm text-muted-foreground text-center">
                    Após finalizar, você será redirecionado para o WhatsApp com os detalhes do seu pedido para confirmação do pagamento.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleFinishOrder}
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando pedido...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Finalizar no WhatsApp
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  );
}