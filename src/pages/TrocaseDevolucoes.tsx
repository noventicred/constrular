import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Package,
  FileText,
  Phone,
  MessageCircle,
  Shield,
  DollarSign
} from "lucide-react";

const TrocaseDevolucoes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Trocas e Devoluções
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Sua satisfação é nossa prioridade. Conheça nossa política de trocas e devoluções
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center border-2 border-green-200 bg-green-50">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-green-800">30 Dias</h3>
              <p className="text-green-700">Para solicitar troca ou devolução</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-blue-800">Sem Custo</h3>
              <p className="text-blue-700">Para produtos com defeito</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-orange-800">Fácil</h3>
              <p className="text-orange-700">Processo 100% online</p>
            </CardContent>
          </Card>
        </div>

        {/* When You Can Return */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Quando Você Pode Trocar ou Devolver</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 border-l-4 border-l-green-500">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  Aceito para Troca/Devolução
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Produto com defeito de fabricação</p>
                      <p className="text-sm text-muted-foreground">Verificado por nossa equipe técnica</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Produto danificado no transporte</p>
                      <p className="text-sm text-muted-foreground">Com registro fotográfico no ato da entrega</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Produto divergente do pedido</p>
                      <p className="text-sm text-muted-foreground">Diferente do que foi solicitado</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Arrependimento da compra</p>
                      <p className="text-sm text-muted-foreground">Produto sem uso e na embalagem original</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl text-red-700 flex items-center gap-2">
                  <XCircle className="h-6 w-6" />
                  Não Aceito para Troca/Devolução
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Produtos já utilizados</p>
                      <p className="text-sm text-muted-foreground">Cimento, argamassa, tinta aberta</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Produtos cortados sob medida</p>
                      <p className="text-sm text-muted-foreground">Tubos, vergalhões, madeiras</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Prazo de 30 dias ultrapassado</p>
                      <p className="text-sm text-muted-foreground">Contado da data de entrega</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold">Produto danificado por mau uso</p>
                      <p className="text-sm text-muted-foreground">Uso incorreto ou inadequado</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How to Request */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Como Solicitar Troca ou Devolução</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold mb-2">Entre em Contato</h3>
              <p className="text-sm text-muted-foreground">
                Ligue para (11) 4002-8922 ou envie WhatsApp
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold mb-2">Informe os Dados</h3>
              <p className="text-sm text-muted-foreground">
                Número do pedido, produto e motivo da solicitação
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold mb-2">Análise</h3>
              <p className="text-sm text-muted-foreground">
                Nossa equipe analisa a solicitação em até 24h
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-semibold mb-2">Coleta</h3>
              <p className="text-sm text-muted-foreground">
                Agendamos a coleta ou você traz até nossa loja
              </p>
            </div>
          </div>
        </div>

        {/* Refund Options */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Opções de Reembolso</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Dinheiro de Volta
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <p className="text-muted-foreground">Para compras no dinheiro ou PIX</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Estorno em até 5 dias úteis</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Mais Rápido</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  Troca por Produto
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <p className="text-muted-foreground">Substitua por outro produto de valor igual ou superior</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Imediato na loja</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Recomendado</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  Crédito na Loja
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-3">
                  <p className="text-muted-foreground">Valor fica disponível para futuras compras</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Válido por 12 meses</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">+ 5% Bônus</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-12 md:mb-16">
          <Card className="p-6 border-l-4 border-l-yellow-500 bg-yellow-50">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl text-yellow-800 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Produtos Especiais</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Ferramentas elétricas: 15 dias de garantia adicional</li>
                    <li>• Louças e metais: Verificação técnica obrigatória</li>
                    <li>• Materiais elétricos: Teste de funcionamento</li>
                    <li>• Tintas: Apenas com defeito de fabricação</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Documentos Necessários</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Nota fiscal ou comprovante de compra</li>
                    <li>• Documento de identidade</li>
                    <li>• Produto na embalagem original</li>
                    <li>• Manual e acessórios (se aplicável)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact for Returns */}
        <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h2>
            <p className="text-muted-foreground mb-6">
              Nossa equipe de atendimento está pronta para ajudar você com sua solicitação
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => window.open('tel:1140028922')}
              >
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold">Telefone</p>
                  <p className="text-xs text-muted-foreground">(11) 4002-8922</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">(11) 9 9999-9999</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2 sm:col-span-2 lg:col-span-1"
              >
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold">E-mail</p>
                  <p className="text-xs text-muted-foreground">trocas@construtorpro.com.br</p>
                </div>
              </Button>
            </div>
          </div>
        </Card>
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default TrocaseDevolucoes;