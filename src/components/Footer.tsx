import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Youtube,
  CreditCard,
  Truck,
  Shield
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-construction-gray text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold text-primary">ConstrutorPro</h3>
            <p className="text-gray-300 text-sm md:text-base">
              Materiais de construção de qualidade com os melhores preços da região. 
              Sua obra em boas mãos há mais de 20 anos.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">(11) 4002-8922</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base break-all">vendas@construtorpro.com.br</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">Rua das Construções, 123 - Centro, São Paulo - SP</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Categorias</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Cimento & Argamassa</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Tijolos & Blocos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Tintas & Vernizes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Ferramentas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Hidráulica</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Elétrica</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Política de Troca</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Entrega e Frete</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Garantia</a></li>
              <li><a href="#" className="hover:text-primary transition-colors text-sm md:text-base">Trabalhe Conosco</a></li>
            </ul>
            
            <div className="pt-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-medium text-sm md:text-base">Horário de Funcionamento:</span>
              </div>
              <div className="text-xs md:text-sm text-gray-400">
                <p>Segunda a Sexta: 7h às 18h</p>
                <p>Sábado: 7h às 17h</p>
                <p>Domingo: 8h às 12h</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Newsletter</h4>
            <p className="text-gray-300 text-xs md:text-sm">
              Receba ofertas exclusivas e novidades em primeira mão
            </p>
            
            <div className="space-y-2">
              <Input 
                placeholder="Seu e-mail" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-sm md:text-base h-10 md:h-12"
              />
              <Button variant="hero" className="w-full text-sm md:text-base h-10 md:h-12">
                Assinar Newsletter
              </Button>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <p className="text-xs md:text-sm font-medium mb-3">Siga-nos:</p>
              <div className="flex gap-2 md:gap-3">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Youtube className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-white/20" />

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h5 className="font-semibold text-sm md:text-base">Pagamento Seguro</h5>
              <p className="text-xs md:text-sm text-gray-400">SSL e criptografia de dados</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Truck className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
            </div>
            <div>
              <h5 className="font-semibold text-sm md:text-base">Entrega Rápida</h5>
              <p className="text-xs md:text-sm text-gray-400">Frete grátis acima de R$ 199</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-success" />
            </div>
            <div>
              <h5 className="font-semibold text-sm md:text-base">Compra Protegida</h5>
              <p className="text-xs md:text-sm text-gray-400">Garantia em todos os produtos</p>
            </div>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-white/20" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-400">
          <div>
            <p>&copy; 2024 ConstrutorPro. Todos os direitos reservados.</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-end">
            <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;