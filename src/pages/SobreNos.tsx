import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  MapPin, 
  Calendar,
  Truck,
  Shield,
  Star,
  Target,
  Heart,
  Building
} from "lucide-react";

const SobreNos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Sobre Nós
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Há mais de 20 anos construindo sonhos e oferecendo os melhores materiais de construção da região
          </p>
        </div>

        {/* Company Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-bold text-2xl mb-2">20+</h3>
              <p className="text-muted-foreground">Anos de Experiência</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-bold text-2xl mb-2">50,000+</h3>
              <p className="text-muted-foreground">Clientes Atendidos</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-bold text-2xl mb-2">15,000+</h3>
              <p className="text-muted-foreground">Obras Concluídas</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-bold text-2xl mb-2">4.9</h3>
              <p className="text-muted-foreground">Avaliação Média</p>
            </CardContent>
          </Card>
        </div>

        {/* Nossa História */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Nossa História</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-4">
                A ConstrutorPro nasceu em 2003 com um sonho simples: democratizar o acesso a materiais de construção de qualidade. Fundada por João Silva, um engenheiro civil apaixonado pela construção, nossa empresa começou como uma pequena loja de bairro.
              </p>
              <p className="text-muted-foreground mb-4">
                Ao longo dos anos, crescemos não apenas em tamanho, mas em compromisso com nossos clientes. Expandimos nosso catálogo, melhoramos nossos serviços e sempre mantivemos o foco na qualidade e no atendimento personalizado.
              </p>
              <p className="text-muted-foreground">
                Hoje, somos referência em materiais de construção na região, atendendo desde pequenos reparos domésticos até grandes obras comerciais e residenciais.
              </p>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center">
            <Building className="h-32 w-32 text-muted-foreground" />
          </div>
        </div>

        {/* Missão, Visão e Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Missão</h3>
              </div>
              <p className="text-muted-foreground">
                Fornecer materiais de construção de alta qualidade com excelência no atendimento, contribuindo para a realização dos sonhos de nossos clientes.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Visão</h3>
              </div>
              <p className="text-muted-foreground">
                Ser a empresa de materiais de construção mais confiável e inovadora da região, reconhecida pela qualidade e compromisso com o cliente.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Valores</h3>
              </div>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Qualidade em primeiro lugar</li>
                <li>• Atendimento humanizado</li>
                <li>• Transparência e honestidade</li>
                <li>• Inovação constante</li>
                <li>• Compromisso social</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Nossos Diferenciais */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Nossos Diferenciais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4 p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Garantia de Qualidade</h4>
                <p className="text-sm text-muted-foreground">Todos os produtos com certificação e garantia do fabricante</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Entrega Nacional</h4>
                <p className="text-sm text-muted-foreground">Atendemos todo o Brasil através de parceiros credenciados</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Atendimento Especializado</h4>
                <p className="text-sm text-muted-foreground">Equipe técnica preparada para orientar sua obra</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Melhores Preços</h4>
                <p className="text-sm text-muted-foreground">Preços competitivos e condições especiais</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Localização Estratégica</h4>
                <p className="text-sm text-muted-foreground">Fácil acesso e estacionamento amplo</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Responsabilidade Social</h4>
                <p className="text-sm text-muted-foreground">Comprometidos com o desenvolvimento da comunidade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificações */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Certificações e Parcerias</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">ISO 9001</Badge>
            <Badge variant="secondary" className="px-4 py-2">PBQP-H</Badge>
            <Badge variant="secondary" className="px-4 py-2">SINDUSCON</Badge>
            <Badge variant="secondary" className="px-4 py-2">ANAMACO</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nossas certificações garantem que seguimos os mais altos padrões de qualidade e que nossos processos estão em conformidade com as normas nacionais e internacionais.
          </p>
        </div>
      </main>
      
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default SobreNos;