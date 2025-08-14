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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Política de Privacidade
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Transparência e proteção dos seus dados pessoais são nossa prioridade
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última atualização: 14 de agosto de 2024</span>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-blue-800">Proteção</h3>
              <p className="text-blue-700 text-sm">Dados criptografados e seguros</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-green-200 bg-green-50">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-green-800">Transparência</h3>
              <p className="text-green-700 text-sm">Você sabe o que coletamos</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-purple-800">Controle</h3>
              <p className="text-purple-700 text-sm">Você decide sobre seus dados</p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-orange-800">LGPD</h3>
              <p className="text-orange-700 text-sm">Conformidade total</p>
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
            <CardContent className="px-0 pb-0 prose prose-gray max-w-none">
              <p className="text-muted-foreground">
                A ConstrutorPro ("nós", "nosso" ou "empresa") está comprometida em proteger e respeitar sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site, serviços ou visita nossa loja física.
              </p>
              <p className="text-muted-foreground">
                Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e outras legislações aplicáveis de proteção de dados.
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
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-lg">2.1 Informações Fornecidas por Você</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Dados de contato:</strong> Nome, e-mail, telefone, endereço</li>
                    <li>• <strong>Dados de identificação:</strong> CPF, RG, data de nascimento</li>
                    <li>• <strong>Dados comerciais:</strong> Histórico de compras, preferências</li>
                    <li>• <strong>Dados de comunicação:</strong> Mensagens enviadas via formulários ou WhatsApp</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-lg">2.2 Informações Coletadas Automaticamente</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Dados de navegação:</strong> Páginas visitadas, tempo de permanência</li>
                    <li>• <strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, dispositivo</li>
                    <li>• <strong>Dados de localização:</strong> Localização aproximada baseada no IP</li>
                    <li>• <strong>Cookies:</strong> Preferências e configurações (veja nossa Política de Cookies)</li>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">Finalidades Comerciais</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Processar seus pedidos</li>
                      <li>• Gerenciar entregas</li>
                      <li>• Enviar ofertas personalizadas</li>
                      <li>• Melhorar nossos produtos</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2">Finalidades Legais</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Cumprir obrigações fiscais</li>
                      <li>• Emitir notas fiscais</li>
                      <li>• Atender órgãos reguladores</li>
                      <li>• Exercer direitos em processos</li>
                    </ul>
                  </div>
                </div>
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
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h5 className="font-semibold text-orange-800 mb-2">Prestadores de Serviços</h5>
                    <p className="text-sm text-orange-700">
                      Empresas de entrega, processamento de pagamentos, serviços de TI e marketing (sempre com contratos de confidencialidade)
                    </p>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-800 mb-2">Autoridades Legais</h5>
                    <p className="text-sm text-red-700">
                      Quando exigido por lei, ordem judicial ou autoridades competentes
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <strong>Acesso:</strong> Saber quais dados temos sobre você
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">2</span>
                      </div>
                      <div>
                        <strong>Correção:</strong> Corrigir dados incompletos ou incorretos
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">3</span>
                      </div>
                      <div>
                        <strong>Eliminação:</strong> Solicitar exclusão dos seus dados
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">4</span>
                      </div>
                      <div>
                        <strong>Portabilidade:</strong> Receber seus dados em formato legível
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-600">5</span>
                      </div>
                      <div>
                        <strong>Oposição:</strong> Opor-se ao tratamento dos seus dados
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-600">6</span>
                      </div>
                      <div>
                        <strong>Revogação:</strong> Retirar consentimento a qualquer momento
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-600">7</span>
                      </div>
                      <div>
                        <strong>Informação:</strong> Saber com quem compartilhamos seus dados
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-600">8</span>
                      </div>
                      <div>
                        <strong>Revisão:</strong> Solicitar revisão de decisões automatizadas
                      </div>
                    </div>
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
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <h5 className="font-bold text-blue-800 mb-2">Dados de Cadastro</h5>
                    <p className="text-2xl font-bold text-blue-600 mb-1">5 anos</p>
                    <p className="text-xs text-blue-700">Após última compra</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <h5 className="font-bold text-green-800 mb-2">Dados Fiscais</h5>
                    <p className="text-2xl font-bold text-green-600 mb-1">5 anos</p>
                    <p className="text-xs text-green-700">Conforme legislação</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <h5 className="font-bold text-orange-800 mb-2">Dados de Marketing</h5>
                    <p className="text-2xl font-bold text-orange-600 mb-1">Até revogação</p>
                    <p className="text-xs text-orange-700">Do consentimento</p>
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
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">E-mail do DPO</p>
                      <p className="text-sm text-muted-foreground">privacidade@construtorpro.com.br</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Telefone</p>
                      <p className="text-sm text-muted-foreground">(11) 4002-8922 - Ramal 9</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800">Prazo de Resposta</p>
                      <p className="text-sm text-yellow-700">
                        Responderemos suas solicitações em até 15 dias corridos, podendo ser prorrogado por mais 15 dias mediante justificativa.
                      </p>
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
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Recomendamos</strong> que você revise esta política periodicamente para se manter informado sobre como protegemos seus dados.
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