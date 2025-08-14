import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/useSettings";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount, sendToWhatsApp } = useCart();
  const navigate = useNavigate();
  const { getWhatsAppNumber } = useSettings();

  const handleWhatsAppRedirect = () => {
    const whatsappNumber = getWhatsAppNumber();
    sendToWhatsApp(whatsappNumber);
    clearCart();
  };

  const shipping = total >= 199 ? 0 : 29.90;
  const finalTotal = total + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" data-cart-trigger>
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-white text-xs animate-pulse">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({itemCount})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Seu carrinho está vazio</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione produtos para continuar
              </p>
              <Button onClick={() => navigate("/produtos")} variant="outline">
                Explorar Produtos
              </Button>
            </div>
          ) : (
            <>
              {/* Items List - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {items.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</h4>
                          {item.brand && (
                            <p className="text-xs text-muted-foreground mb-1">{item.brand}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-primary text-sm">
                              {formatCurrency(item.price)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Subtotal</p>
                          <p className="font-semibold text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Fixed Bottom Section */}
              <div className="border-t pt-4 mt-4 space-y-4 bg-background">
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate("/carrinho")}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Carrinho Completo
                  </Button>
                  
                  <Button 
                    onClick={handleWhatsAppRedirect}
                    className="w-full"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Finalizar no WhatsApp
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;