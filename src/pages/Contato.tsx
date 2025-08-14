import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Navigation,
  Users,
  Headphones
} from "lucide-react";

const Contato = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Fale Conosco
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos aqui para ajudar você a realizar sua obra. Entre em contato conosco!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                Envie sua Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input 
                      id="name" 
                      placeholder="Seu nome completo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input 
                      id="phone" 
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="seu@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Assunto</Label>
                  <Input 
                    id="subject" 
                    placeholder="Qual o assunto da sua mensagem?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Descreva como podemos ajudar você..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <Button className="w-full" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Contato Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Resposta imediata</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                  >
                    Conversar
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg border">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Telefone</p>
                    <p className="text-sm text-muted-foreground">(11) 4002-8922</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('tel:1140028922')}
                  >
                    Ligar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Address and Hours */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Nossa Loja
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Endereço</p>
                      <p className="text-muted-foreground">
                        Rua das Construções, 123<br />
                        Centro - São Paulo - SP<br />
                        CEP: 01234-567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Horário de Funcionamento</p>
                      <div className="text-muted-foreground space-y-1">
                        <p>Segunda a Sexta: 7h às 18h</p>
                        <p>Sábado: 7h às 17h</p>
                        <p>Domingo: 8h às 12h</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">E-mail</p>
                      <p className="text-muted-foreground">vendas@construtorpro.com.br</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('https://maps.google.com', '_blank')}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver no Mapa
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="p-6 bg-destructive/10 border-destructive/20">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2 text-destructive">
                  <Phone className="h-5 w-5 text-destructive" />
                  Atendimento de Urgência
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <p className="text-destructive/80 mb-3">
                  Para emergências fora do horário comercial:
                </p>
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border">
                  <div>
                    <p className="font-bold text-destructive">(11) 9 8888-7777</p>
                    <p className="text-sm text-destructive/70">Disponível 24h</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => window.open('tel:11988887777')}
                  >
                    Ligar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Departamentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Vendas</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Orçamentos, produtos e consultorias
                </p>
                <p className="font-semibold">(11) 4002-8922</p>
                <p className="text-sm text-muted-foreground">Ramal 1</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Suporte Técnico</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Dúvidas técnicas e orientações
                </p>
                <p className="font-semibold">(11) 4002-8922</p>
                <p className="text-sm text-muted-foreground">Ramal 2</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Financeiro</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Faturamento e pagamentos
                </p>
                <p className="font-semibold">(11) 4002-8922</p>
                <p className="text-sm text-muted-foreground">Ramal 3</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Contato;