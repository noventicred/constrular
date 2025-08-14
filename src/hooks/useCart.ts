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
    console.log('🔄 Carregando carrinho do localStorage:', savedCart);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('✅ Carrinho carregado:', parsedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('❌ Erro ao carregar carrinho:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    // Só salva se não for a primeira renderização vazia
    if (items.length > 0) {
      console.log('💾 Salvando carrinho no localStorage:', items);
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    console.log('🛒 Adicionando produto ao carrinho:', product);
    setItems(prev => {
      console.log('📦 Carrinho atual:', prev);
      const existingItem = prev.find(item => item.id === product.id);
      console.log('🔍 Item existente encontrado:', existingItem);
      
      if (existingItem) {
        const updatedCart = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('✅ Quantidade atualizada:', updatedCart);
        return updatedCart;
      }
      
      const newCart = [...prev, { ...product, quantity: 1 }];
      console.log('✅ Novo item adicionado:', newCart);
      return newCart;
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