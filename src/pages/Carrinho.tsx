import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { Plus, Minus, Trash2, MessageCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Carrinho = () => {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount, sendToWhatsApp } = useCart();
  const [phoneNumber, setPhoneNumber] = useState('5511999999999');
  const navigate = useNavigate();

  const handleWhatsAppRedirect = () => {
    sendToWhatsApp(phoneNumber);
    clearCart();
  };

  const shipping = total >= 199 ? 0 : 29.90;
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">Meu Carrinho</h1>
          </div>
          
          {itemCount > 0 && (
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} no seu carrinho
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-8">
              Adicione produtos ao seu carrinho para continuar
            </p>
            <Button onClick={() => navigate("/produtos")} size="lg">
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Itens do Carrinho</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Carrinho
                </Button>
              </div>
              
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            {item.brand && (
                              <p className="text-sm text-muted-foreground">{item.brand}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">Quantidade:</span>
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 py-1 min-w-[40px] text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Preço unitário</p>
                            <p className="font-bold text-lg text-primary">
                              {formatCurrency(item.price)}
                            </p>
                            <p className="text-sm font-medium">
                              Subtotal: {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
                      <span className="font-medium">{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Frete</span>
                      <div className="text-right">
                        {shipping === 0 ? (
                          <div>
                            <span className="font-medium text-green-600">Grátis</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Frete grátis!
                            </Badge>
                          </div>
                        ) : (
                          <div>
                            <span className="font-medium">{formatCurrency(shipping)}</span>
                            <p className="text-xs text-muted-foreground">
                              Grátis acima de R$ 199
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        WhatsApp para contato:
                      </Label>
                      <Input
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Ex: 5511999999999"
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleWhatsAppRedirect}
                      className="w-full"
                      size="lg"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Finalizar no WhatsApp
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Você será redirecionado para o WhatsApp para finalizar seu pedido
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Security badges */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Compra 100% Segura</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Garantia de 30 dias</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Atendimento especializado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Carrinho;