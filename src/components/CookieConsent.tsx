import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cookie, 
  Settings, 
  X, 
  CheckCircle,
  Shield,
  BarChart,
  Eye
} from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be changed
    performance: false,
    functionality: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      functionality: true,
      marketing: true
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    
    // Here you would typically initialize your analytics/marketing scripts
    initializeOptionalCookies(allAccepted);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    
    // Initialize only accepted cookies
    initializeOptionalCookies(preferences);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      performance: false,
      functionality: false,
      marketing: false
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(essentialOnly));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const initializeOptionalCookies = (acceptedPreferences: typeof preferences) => {
    // Here you would initialize your analytics, marketing, etc. based on preferences
    if (acceptedPreferences.performance) {
      // Initialize Google Analytics or similar
      console.log('Performance cookies enabled');
    }
    
    if (acceptedPreferences.functionality) {
      // Initialize functionality cookies
      console.log('Functionality cookies enabled');
    }
    
    if (acceptedPreferences.marketing) {
      // Initialize marketing/advertising cookies
      console.log('Marketing cookies enabled');
    }
  };

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'essential') return; // Can't change essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6">
        <Card className="max-w-4xl mx-auto bg-white shadow-2xl border-2 border-primary/20">
          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Configuração de Cookies</h2>
                  <p className="text-sm text-muted-foreground">Personalize sua experiência de navegação</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Main Content */}
            {!showDetails ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
                    Você pode escolher quais tipos de cookies aceita.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Saiba mais em nossa</span>
                    <a href="/cookies" className="text-primary hover:underline text-sm font-medium">
                      Política de Cookies
                    </a>
                    <span className="text-sm text-muted-foreground">e</span>
                    <a href="/politica-privacidade" className="text-primary hover:underline text-sm font-medium">
                      Política de Privacidade
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleAcceptAll}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aceitar Todos
                  </Button>
                  <Button 
                    onClick={() => setShowDetails(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Personalizar
                  </Button>
                  <Button 
                    onClick={handleRejectAll}
                    variant="ghost"
                    className="flex-1"
                  >
                    Apenas Essenciais
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cookie Categories */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  
                  {/* Essential Cookies */}
                  <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-red-600" />
                        <h4 className="font-semibold">Cookies Essenciais</h4>
                        <Badge className="bg-red-100 text-red-800">Obrigatórios</Badge>
                      </div>
                      <div className="w-12 h-6 bg-red-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Necessários para o funcionamento básico do site. Incluem segurança, navegação e carrinho de compras.
                    </p>
                  </div>

                  {/* Performance Cookies */}
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <BarChart className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Cookies de Performance</h4>
                        <Badge variant="secondary">Opcionais</Badge>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('performance')}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                          preferences.performance 
                            ? 'bg-primary justify-end' 
                            : 'bg-gray-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nos ajudam a entender como você interage com o site para melhorar o desempenho e usabilidade.
                    </p>
                  </div>

                  {/* Functionality Cookies */}
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">Cookies de Funcionalidade</h4>
                        <Badge variant="secondary">Opcionais</Badge>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('functionality')}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                          preferences.functionality 
                            ? 'bg-primary justify-end' 
                            : 'bg-gray-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Permitem funcionalidades aprimoradas e personalizações, como lembrar suas preferências.
                    </p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Cookies de Marketing</h4>
                        <Badge variant="secondary">Opcionais</Badge>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                          preferences.marketing 
                            ? 'bg-primary justify-end' 
                            : 'bg-gray-300 justify-start'
                        } px-1`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Utilizados para mostrar anúncios relevantes e medir a eficácia das campanhas publicitárias.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button 
                    onClick={handleAcceptSelected}
                    className="flex-1"
                  >
                    Confirmar Seleção
                  </Button>
                  <Button 
                    onClick={() => setShowDetails(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CookieConsent;