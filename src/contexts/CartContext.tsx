import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  getTotalPrice: () => number;
  sendToWhatsApp: (phoneNumber?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        toast({
          title: "✅ Quantidade atualizada!",
          description: `${product.name} agora tem ${existingItem.quantity + 1} unidades no carrinho`,
          duration: 3000,
        });
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      toast({
        title: "🛒 Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho`,
        duration: 3000,
      });
      
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () => total;

  const generateWhatsAppMessage = () => {
    console.log('🔥 GERANDO MENSAGEM WHATSAPP RÁPIDA');
    console.log('📦 Items no carrinho:', items);
    console.log('💰 Total:', total);
    
    let message = `🛒 *ORÇAMENTO RÁPIDO* 🛒\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📅 *Data:* ${new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;
    
    message += `👋 Olá! Tenho interesse nos seguintes produtos:\n\n`;
    
    message += `🛍️ *PRODUTOS DE INTERESSE*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}️⃣ *${item.name}*\n`;
      if (item.brand) {
        message += `   🏷️ Marca: ${item.brand}\n`;
      }
      message += `   📊 Quantidade: ${item.quantity} unidade${item.quantity > 1 ? 's' : ''}\n`;
      message += `   💰 Valor unitário: ${formatCurrency(item.price)}\n`;
      message += `   💵 Subtotal: *${formatCurrency(item.price * item.quantity)}*\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💸 *TOTAL ESTIMADO: ${formatCurrency(total)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `❓ *Gostaria de saber:*\n`;
    message += `• 🚚 Condições de entrega\n`;
    message += `• 💳 Formas de pagamento\n`;
    message += `• ⏰ Prazo de entrega\n\n`;
    
    message += `🙏 Aguardo retorno para finalizar! 😊`;
    
    console.log('📱 MENSAGEM RÁPIDA GERADA:', message);
    return encodeURIComponent(message);
  };

  const sendToWhatsApp = (phoneNumber: string = '5511999999999') => {
    console.log('🚀 ENVIANDO PARA WHATSAPP RÁPIDO');
    console.log('📞 Número:', phoneNumber);
    
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    console.log('🔗 URL WhatsApp:', whatsappUrl);
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      getTotalPrice,
      sendToWhatsApp
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};