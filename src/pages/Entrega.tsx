import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Clock, 
  MapPin, 
  Calculator,
  CheckCircle,
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
  Phone
} from "lucide-react";

const Entrega = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Entrega e Frete
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Atendemos todo o Brasil através dos nossos parceiros credenciados
          </p>
        </div>

        {/* National Coverage Banner */}
        <div className="bg-primary rounded-lg p-6 md:p-8 text-white text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Truck className="h-8 w-8" />
            <h2 className="text-2xl md:text-3xl font-bold">Entrega Nacional</h2>
          </div>
          <p className="text-lg md:text-xl mb-2">
            Atendemos <span className="font-bold">todo o Brasil</span>
          </p>
          <p className="text-primary-foreground/90">
            Através dos nossos parceiros credenciados e transportadoras especializadas
          </p>
        </div>

        {/* Delivery Zones */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Regiões de Atendimento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  São Paulo e Região
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Entrega expressa disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm">Frete a partir de R$ 15,00</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>• Capital e Grande São Paulo</p>
                    <p>• ABC Paulista</p>
                    <p>• Região Metropolitana</p>
                    <p>• Cidades próximas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Interior de SP
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Entrega em 1-3 dias úteis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="text-sm">Frete calculado por peso/volume</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>• Campinas e região</p>
                    <p>• Santos e litoral</p>
                    <p>• Vale do Paraíba</p>
                    <p>• Principais cidades do interior</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Demais Estados
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Entrega em 5-15 dias úteis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    <span className="text-sm">Frete via transportadora</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>• Todos os estados do Brasil</p>
                    <p>• Parcerias com transportadoras</p>
                    <p>• Entrega porta a porta</p>
                    <p>• Rastreamento completo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Como Funciona a Entrega</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold mb-2">Pedido Confirmado</h3>
              <p className="text-sm text-muted-foreground">
                Após a confirmação do pagamento, preparamos seu pedido
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold mb-2">Separação</h3>
              <p className="text-sm text-muted-foreground">
                Nossa equipe separa e embala seus produtos com cuidado
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold mb-2">Em Transporte</h3>
              <p className="text-sm text-muted-foreground">
                Enviamos por WhatsApp o código de rastreamento
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-semibold mb-2">Entregue</h3>
              <p className="text-sm text-muted-foreground">
                Receba seus materiais no endereço indicado
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 md:mb-16">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Entrega Expressa
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Disponível</Badge>
                  <span className="text-sm">Região Central de SP</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Entrega em até 4 horas</li>
                  <li>• Disponível de segunda a sábado</li>
                  <li>• Horário: 8h às 18h</li>
                  <li>• Taxa adicional de R$ 25,00</li>
                  <li>• Produtos até 100kg</li>
                </ul>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Ideal para:</strong> Produtos urgentes, pequenos reparos, ferramentas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Entrega Programada
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Padrão</Badge>
                  <span className="text-sm">Todas as regiões</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Agendamento de data e horário</li>
                  <li>• Produtos de grande volume</li>
                  <li>• Equipe especializada</li>
                  <li>• Descarga inclusa</li>
                  <li>• Sem limite de peso</li>
                </ul>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Ideal para:</strong> Obras completas, materiais pesados, grandes volumes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Informações Importantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-green-500">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  O que Está Incluído
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ul className="space-y-2 text-sm">
                  <li>✅ Descarga até o portão da residência</li>
                  <li>✅ Seguro contra avarias no transporte</li>
                  <li>✅ Rastreamento por WhatsApp</li>
                  <li>✅ Equipe treinada e uniformizada</li>
                  <li>✅ Embalagem adequada dos produtos</li>
                  <li>✅ Conferência no ato da entrega</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Taxas Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ul className="space-y-2 text-sm">
                  <li>🔸 Descarga no andar: R$ 10,00 por andar</li>
                  <li>🔸 Entrega em local de difícil acesso: R$ 20,00</li>
                  <li>🔸 Reagendamento: R$ 15,00</li>
                  <li>🔸 Espera superior a 30 min: R$ 25,00</li>
                  <li>🔸 Horário especial (após 18h): R$ 30,00</li>
                  <li>🔸 Entrega em feriados: R$ 40,00</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact for Delivery */}
        <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Dúvidas sobre Entrega?</h2>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas sobre frete e entrega
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white p-4 rounded-lg border">
                <Phone className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Central de Entregas</p>
                  <p className="text-sm text-muted-foreground">(11) 4002-8922 - Ramal 4</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white p-4 rounded-lg border">
                <MapPin className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold">WhatsApp Rastreamento</p>
                  <p className="text-sm text-muted-foreground">(11) 9 7777-8888</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Entrega;