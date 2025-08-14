import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Eye, 
  Lock, 
  UserCheck,
  Clock,
  Mail,
  Phone,
  FileText,
  AlertTriangle
} from "lucide-react";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Política de Privacidade
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Como protegemos e utilizamos suas informações pessoais
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última atualização: Janeiro de 2025</span>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center border-2 border-primary/20 bg-accent/10">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Proteção</h3>
              <p className="text-muted-foreground text-sm">Dados seguros</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-primary/20 bg-accent/10">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Transparência</h3>
              <p className="text-muted-foreground text-sm">Você sabe o que coletamos</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-primary/20 bg-accent/10">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Controle</h3>
              <p className="text-muted-foreground text-sm">Você decide sobre seus dados</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-primary/20 bg-accent/10">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">LGPD</h3>
              <p className="text-muted-foreground text-sm">Conformidade total</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Introdução */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                1. Introdução
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <p className="text-muted-foreground leading-relaxed">
                A ConstrutorPro está comprometida em proteger suas informações pessoais. Esta política 
                explica como coletamos, usamos e protegemos seus dados em conformidade com a LGPD.
              </p>
            </CardContent>
          </Card>

          {/* Informações que Coletamos */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                2. Informações que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Dados Pessoais</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Nome, e-mail, telefone e endereço</li>
                    <li>• CPF para emissão de nota fiscal</li>
                    <li>• Histórico de compras e preferências</li>
                    <li>• Dados de navegação e cookies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Como Usamos as Informações */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                3. Como Usamos suas Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Utilizamos seus dados para:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Processar e entregar seus pedidos</li>
                  <li>• Enviar comunicações sobre produtos e ofertas</li>
                  <li>• Melhorar nossos serviços e experiência do usuário</li>
                  <li>• Cumprir obrigações legais e fiscais</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Base Legal */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                4. Base Legal para o Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Tratamos seus dados pessoais com base nas seguintes hipóteses legais previstas na LGPD:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <strong>Execução de contrato:</strong> Para processar pedidos e prestação de serviços
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <strong>Legítimo interesse:</strong> Para melhorar nossos serviços e segurança
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <strong>Consentimento:</strong> Para marketing e comunicações promocionais
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <strong>Cumprimento legal:</strong> Para obrigações fiscais e regulatórias
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compartilhamento */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                5. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Podemos compartilhar suas informações pessoais apenas nas seguintes situações:
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/10 rounded-lg border">
                    <h5 className="font-semibold mb-2">Prestadores de Serviços</h5>
                    <p className="text-sm text-muted-foreground">
                      Empresas de entrega, processamento de pagamentos e serviços de TI
                    </p>
                  </div>
                  
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <h5 className="font-semibold text-destructive mb-2">Autoridades Legais</h5>
                    <p className="text-sm text-muted-foreground">
                      Quando exigido por lei ou ordem judicial
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                6. Segurança dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Criptografia SSL/TLS</li>
                    <li>• Firewalls e sistemas de detecção</li>
                    <li>• Controle de acesso rigoroso</li>
                    <li>• Backups seguros e regulares</li>
                  </ul>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Treinamento da equipe</li>
                    <li>• Auditoria de segurança</li>
                    <li>• Plano de resposta a incidentes</li>
                    <li>• Monitoramento 24/7</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seus Direitos */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                7. Seus Direitos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Você possui os seguintes direitos em relação aos seus dados pessoais:
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• <strong>Acesso:</strong> Saber quais dados temos sobre você</li>
                      <li>• <strong>Correção:</strong> Corrigir dados incorretos</li>
                      <li>• <strong>Eliminação:</strong> Solicitar exclusão dos dados</li>
                      <li>• <strong>Portabilidade:</strong> Receber dados em formato legível</li>
                    </ul>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• <strong>Oposição:</strong> Opor-se ao tratamento</li>
                      <li>• <strong>Revogação:</strong> Retirar consentimento</li>
                      <li>• <strong>Informação:</strong> Saber sobre compartilhamentos</li>
                      <li>• <strong>Revisão:</strong> Contestar decisões automatizadas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Retenção */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                8. Retenção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas, observando:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-accent/10 rounded-lg text-center border">
                    <h5 className="font-bold mb-2">Dados de Cadastro</h5>
                    <p className="text-2xl font-bold text-primary mb-1">5 anos</p>
                    <p className="text-xs text-muted-foreground">Após última compra</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg text-center border">
                    <h5 className="font-bold mb-2">Dados Fiscais</h5>
                    <p className="text-2xl font-bold text-primary mb-1">5 anos</p>
                    <p className="text-xs text-muted-foreground">Conforme legislação</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg text-center border">
                    <h5 className="font-bold mb-2">Dados de Marketing</h5>
                    <p className="text-2xl font-bold text-primary mb-1">Até revogação</p>
                    <p className="text-xs text-muted-foreground">Do consentimento</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                9. Entre em Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">E-mail</p>
                      <p className="text-sm text-muted-foreground">privacidade@construtorpro.com.br</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">(11) 9 9999-9999</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alterações */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                10. Alterações nesta Política
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <p className="text-muted-foreground mb-4">
                Esta Política de Privacidade pode ser atualizada periodicamente. Quando houver alterações significativas, notificaremos você por:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• E-mail (para alterações que afetem seus direitos)</li>
                <li>• Aviso em destaque no site (para todas as alterações)</li>
                <li>• WhatsApp (para clientes ativos)</li>
              </ul>
              <div className="mt-4 p-4 bg-accent/10 rounded-lg border">
                <p className="text-sm">
                  <strong>Recomendamos</strong> que você revise esta política periodicamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default PoliticaPrivacidade;