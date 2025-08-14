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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Trocas e Devoluções
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Política simples e transparente de trocas e devoluções
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center border-2 border-primary/20 bg-accent/10">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">30 Dias</h3>
              <p className="text-muted-foreground">Para solicitar troca ou devolução</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-primary/20 bg-accent/10">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Sem Custo</h3>
              <p className="text-muted-foreground">Para produtos com defeito</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-primary/20 bg-accent/10">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Fácil</h3>
              <p className="text-muted-foreground">Processo 100% online</p>
            </CardContent>
          </Card>
        </div>

        {/* When You Can Return */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Condições para Troca e Devolução</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-primary flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Aceito para Troca/Devolução
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Produto com defeito de fabricação</li>
                  <li>• Produto danificado no transporte</li>
                  <li>• Produto divergente do pedido</li>
                  <li>• Arrependimento da compra (produto sem uso)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-destructive flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Não Aceito para Troca/Devolução
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Produtos já utilizados</li>
                  <li>• Produtos cortados sob medida</li>
                  <li>• Prazo de 30 dias ultrapassado</li>
                  <li>• Produto danificado por mau uso</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* How to Request */}

        {/* Contact for Returns */}
        <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h2>
            <p className="text-muted-foreground mb-6">
              Entre em contato para solicitar sua troca ou devolução
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                className="flex items-center gap-2"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp: (11) 9 9999-9999
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/termos-uso'}
              >
                Ver Termos de Uso
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