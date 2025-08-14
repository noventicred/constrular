import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Calendar, Shield } from "lucide-react";

const TermosUso = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Termos de Uso
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Condições gerais de uso dos nossos serviços
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/10 rounded-lg p-6 mb-8 border border-primary/20">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span><strong>Última atualização:</strong> Janeiro de 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span><strong>Versão:</strong> 1.0</span>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <Card className="p-6 md:p-8">
          <CardContent className="p-0 space-y-8">
            
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                1. Aceitação dos Termos
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e utilizar nosso site e serviços, você concorda com estes Termos de Uso. 
                Se não concordar com algum dos termos, recomendamos que não utilize nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">2. Descrição dos Serviços</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Oferecemos venda de materiais de construção através de nossa plataforma online, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Venda de produtos para construção civil</li>
                <li>Serviços de entrega</li>
                <li>Atendimento ao cliente</li>
                <li>Política de trocas e devoluções</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">3. Responsabilidades do Usuário</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ao utilizar nossos serviços, você se compromete a:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Utilizar os serviços de forma adequada e legal</li>
                <li>Respeitar os direitos de propriedade intelectual</li>
                <li>Não realizar atividades fraudulentas ou prejudiciais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">4. Política de Privacidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                Seus dados pessoais são tratados conforme nossa Política de Privacidade, que garante 
                a proteção e o uso adequado das informações coletadas durante o uso de nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">5. Preços e Pagamentos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sobre nossos preços e condições de pagamento:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Os preços podem ser alterados sem aviso prévio</li>
                <li>Preços válidos apenas durante a sessão de compra</li>
                <li>Pagamento deve ser realizado conforme condições informadas</li>
                <li>Eventuais taxas adicionais serão informadas antes da finalização</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">6. Entrega e Logística</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Condições de entrega dos produtos:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Prazos de entrega são estimativas e podem variar</li>
                <li>Entrega realizada no endereço informado pelo cliente</li>
                <li>Cliente deve verificar produtos no ato da entrega</li>
                <li>Frete calculado conforme região e peso dos produtos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">7. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nossa responsabilidade está limitada ao valor dos produtos adquiridos. Não nos responsabilizamos 
                por danos indiretos, lucros cessantes ou prejuízos consequentes do uso inadequado dos produtos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">8. Modificações dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão 
                em vigor imediatamente após sua publicação no site. É responsabilidade do usuário verificar 
                periodicamente eventuais atualizações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">9. Lei Aplicável</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer controvérsia será resolvida 
                no foro da comarca de São Paulo/SP.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">10. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do WhatsApp 
                (11) 9 9999-9999 ou pelo e-mail contato@construtorpro.com.br.
              </p>
            </section>

          </CardContent>
        </Card>
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default TermosUso;