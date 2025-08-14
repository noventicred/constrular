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
            Entrega em Todo o Brasil
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Entrega expressa em SP e entrega nacional para todo o país
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
            Entrega expressa em SP e nacional via transportadoras
          </p>
        </div>

        {/* Delivery Zones */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Opções de Entrega</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-2 border-primary hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Entrega Mesmo Dia
                  </CardTitle>
                  <Badge className="bg-primary text-primary-foreground">Express</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-primary">Até 4 horas</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Pedidos até 14h
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Região metropolitana de SP
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Taxa: R$ 25,00
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Entrega Próximo Dia
                  </CardTitle>
                  <Badge variant="secondary">Padrão</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-primary">24 horas</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Pedidos até 18h
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Grande São Paulo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Frete grátis acima de R$ 200
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border hover:shadow-lg transition-shadow">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Entrega Nacional
                  </CardTitle>
                  <Badge variant="outline">Brasil</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-primary">Mesmo dia ou próximo dia útil</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Todo o território nacional
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Entrega expressa nacional
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Rastreamento completo
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Process */}

        {/* Contact for Delivery */}
        <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Dúvidas sobre Entrega?</h2>
            <p className="text-muted-foreground mb-6">
              Fale conosco para mais informações sobre entregas expressas
            </p>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card p-4 rounded-lg border">
                <Phone className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">WhatsApp Entregas</p>
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