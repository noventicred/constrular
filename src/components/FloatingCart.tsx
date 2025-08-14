import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useSettings } from "@/hooks/useSettings";

const FloatingCart = () => {
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
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="lg"
            className="relative h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
            data-cart-trigger
          >
            <ShoppingCart className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold animate-pulse border-2 border-white">
                {itemCount}
              </Badge>
            )}
            
            {/* Pulse ring animation when items are added */}
            {itemCount > 0 && (
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:w-[540px] flex flex-col p-4 sm:p-6">
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
                           <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                             <img
                               src={item.image}
                               alt={item.name}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.src = '/placeholder.svg';
                               }}
                             />
                           </div>
                           <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</h4>
                            {item.brand && (
                              <p className="text-xs text-muted-foreground mb-1">{item.brand}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-primary text-sm">
                                {formatCurrency(item.price)}
                              </p>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive/80 absolute top-2 right-2"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Footer - Order Summary */}
                <div className="border-t pt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete</span>
                      <span>{shipping === 0 ? 'Grátis' : formatCurrency(shipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate("/carrinho")}
                      variant="outline" 
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Carrinho Completo
                    </Button>
                    
                    <Button 
                      onClick={() => navigate("/checkout")}
                      className="w-full"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Finalizar Compra
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FloatingCart;