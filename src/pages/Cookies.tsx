import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cookie, 
  Settings, 
  Eye, 
  BarChart,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Política de Cookies
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Entenda como utilizamos cookies para melhorar sua experiência de navegação
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Última atualização: 14 de agosto de 2024</span>
          </div>
        </div>

        {/* What are Cookies */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Cookie className="h-6 w-6 text-primary" />
                O que são Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet ou celular) quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente, bem como para fornecer informações aos proprietários do site.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-primary/10 rounded-lg text-center">
                    <Cookie className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Pequenos Arquivos</h4>
                    <p className="text-sm text-muted-foreground">Ocupam poucos bytes de espaço</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg text-center">
                    <Shield className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Seguros</h4>
                    <p className="text-sm text-muted-foreground">Não podem executar programas</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg text-center">
                    <Eye className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Temporários</h4>
                    <p className="text-sm text-muted-foreground">Podem ser removidos a qualquer momento</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types of Cookies */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                Tipos de Cookies que Utilizamos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-6">
                
                {/* Essential Cookies */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold">Cookies Essenciais</h4>
                        <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded">Obrigatórios</span>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Necessários para o funcionamento básico do site. Sem eles, você não conseguirá navegar ou usar funcionalidades essenciais.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Manter sua sessão ativa durante a navegação</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Lembrar itens no seu carrinho de compras</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Garantir a segurança durante a navegação</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Cookies */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold">Cookies de Performance</h4>
                        <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded">Opcionais</span>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Coletam informações sobre como você usa nosso site para nos ajudar a melhorar o desempenho.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Páginas mais visitadas e tempo de carregamento</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Identificar erros e problemas de navegação</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Otimizar a experiência do usuário</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Functionality Cookies */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold">Cookies de Funcionalidade</h4>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Opcionais</span>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Permitem que o site lembre das suas preferências e ofereça funcionalidades personalizadas.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Lembrar suas preferências de idioma e região</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Manter configurações de tema (claro/escuro)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Personalizar a experiência de navegação</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold">Cookies de Marketing</h4>
                        <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded">Opcionais</span>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Utilizados para exibir anúncios relevantes e medir a eficácia das campanhas publicitárias.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Mostrar ofertas relevantes para seus interesses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Evitar mostrar o mesmo anúncio repetidamente</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Medir eficácia de campanhas publicitárias</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Duration */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Duração dos Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Cookies de Sessão</h4>
                  <div className="p-4 bg-primary/10 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Temporários</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      São apagados automaticamente quando você fecha o navegador. Utilizados para manter sua sessão ativa durante a navegação.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Cookies Persistentes</h4>
                  <div className="p-4 bg-secondary/10 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-secondary" />
                      <span className="font-semibold text-foreground">Duração Específica</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Permanecem no seu dispositivo por um período determinado (de dias a anos) para lembrar suas preferências entre visitas.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Prazos Específicos dos Nossos Cookies</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h5 className="font-bold text-2xl text-primary mb-1">Sessão</h5>
                    <p className="text-sm text-muted-foreground">Cookies essenciais</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h5 className="font-bold text-2xl text-primary mb-1">30 dias</h5>
                    <p className="text-sm text-muted-foreground">Preferências do usuário</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <h5 className="font-bold text-2xl text-primary mb-1">2 anos</h5>
                    <p className="text-sm text-muted-foreground">Analytics e marketing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third Party Cookies */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Cookies de Terceiros
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Utilizamos serviços de terceiros confiáveis que podem definir cookies no seu dispositivo. Estes parceiros seguem rigorosas políticas de privacidade:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold mb-2">Google Analytics</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Nos ajuda a entender como os visitantes interagem com nosso site
                    </p>
                    <div className="text-xs text-primary">
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Ver Política de Privacidade →
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold mb-2">Facebook Pixel</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Permite mostrar anúncios relevantes nas redes sociais
                    </p>
                    <div className="text-xs text-primary">
                      <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Ver Política de Privacidade →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                Como Gerenciar Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">Configurações do Site</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        Use nosso painel de configuração de cookies para escolher quais tipos aceitar.
                      </p>
                      <Button variant="default" size="sm">
                        Abrir Configurações de Cookies
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Configurações do Navegador</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h6 className="font-semibold mb-1">Google Chrome</h6>
                        <p className="text-sm text-muted-foreground">Configurações → Privacidade e segurança → Cookies</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h6 className="font-semibold mb-1">Mozilla Firefox</h6>
                        <p className="text-sm text-muted-foreground">Opções → Privacidade e Segurança → Cookies</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h6 className="font-semibold mb-1">Safari</h6>
                        <p className="text-sm text-muted-foreground">Preferências → Privacidade → Cookies</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h6 className="font-semibold mb-1">Microsoft Edge</h6>
                        <p className="text-sm text-muted-foreground">Configurações → Privacidade → Cookies</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Importante</h5>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Desabilitar alguns cookies pode afetar o funcionamento do site. Cookies essenciais são necessários para funcionalidades básicas e não podem ser desabilitados.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Atualizações desta Política
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <p className="text-muted-foreground mb-4">
                Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou por razões operacionais, legais ou regulamentares.
              </p>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  <strong>Recomendamos</strong> que você revise esta política regularmente. A data da última atualização está indicada no topo desta página.
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

export default Cookies;