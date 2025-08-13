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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">ConstrutorPro</h3>
            <p className="text-gray-300">
              Há mais de 15 anos fornecendo materiais de construção com qualidade 
              e preços justos para toda região de São Paulo.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contato@construtorpro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Categorias</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Cimento & Argamassa</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tijolos & Blocos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tintas & Vernizes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ferramentas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Hidráulica</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Elétrica</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Atendimento</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Troca</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Entrega e Frete</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Garantia</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trabalhe Conosco</a></li>
            </ul>
            
            <div className="pt-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Horário de Funcionamento:</span>
              </div>
              <div className="text-sm text-gray-400">
                <p>Segunda a Sexta: 7h às 18h</p>
                <p>Sábado: 8h às 14h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-gray-300 text-sm">
              Receba ofertas exclusivas e novidades em primeira mão
            </p>
            
            <div className="space-y-2">
              <Input 
                placeholder="Seu e-mail" 
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button variant="hero" className="w-full">
                Assinar Newsletter
              </Button>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <p className="text-sm font-medium mb-3">Siga-nos:</p>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h5 className="font-semibold">Pagamento Seguro</h5>
              <p className="text-sm text-gray-400">SSL e criptografia de dados</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h5 className="font-semibold">Entrega Rápida</h5>
              <p className="text-sm text-gray-400">Frete grátis acima de R$ 299</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-success/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <h5 className="font-semibold">Compra Protegida</h5>
              <p className="text-sm text-gray-400">Garantia em todos os produtos</p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div>
            <p>&copy; 2024 ConstrutorPro. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-6">
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