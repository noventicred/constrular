import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/formatters';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

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
    console.log('💾 useEffect localStorage - items mudaram:', items);
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    console.log('🛒 Adicionando produto:', product);
    console.log('📦 Carrinho atual antes:', items);
    console.log('📊 Tipo do ID do produto:', typeof product.id);
    
    setItems(prev => {
      console.log('🔄 SetItems executando, prev:', prev);
      const existingItem = prev.find(item => {
        console.log(`🔍 Comparando ${item.id} (${typeof item.id}) com ${product.id} (${typeof product.id})`);
        return item.id === product.id;
      });
      console.log('🔍 Item existente encontrado:', existingItem);
      
      if (existingItem) {
        const updated = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('✅ Quantidade atualizada:', updated);
        return updated;
      }
      
      const newCart = [...prev, { ...product, quantity: 1 }];
      console.log('✅ Novo carrinho criado:', newCart);
      return newCart;
    });
    
    // Verificar o estado após a atualização
    setTimeout(() => {
      console.log('🕐 Estado do carrinho após 100ms:', items);
    }, 100);
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

  const generateWhatsAppMessage = () => {
    const message = `Olá! Gostaria de fazer um pedido:\n\n${items.map(item => 
      `${item.quantity}x ${item.name} - ${item.brand}\n${formatCurrency(item.price)} cada`
    ).join('\n\n')}\n\n*Total: ${formatCurrency(total)}*\n\nAguardo retorno para finalizar o pedido!`;
    
    return encodeURIComponent(message);
  };

  const sendToWhatsApp = (phoneNumber: string = '5511999999999') => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    sendToWhatsApp
  };
};