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
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="bg-white shadow-2xl border border-border">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">Cookies</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Main Content */}
          {!showDetails ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Utilizamos cookies para melhorar sua experiência. Você pode personalizar suas preferências.
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={handleAcceptAll}
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  Aceitar Todos
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowDetails(true)}
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    size="sm"
                  >
                    Personalizar
                  </Button>
                  <Button 
                    onClick={handleRejectAll}
                    variant="ghost"
                    className="flex-1 h-8 text-xs"
                    size="sm"
                  >
                    Rejeitar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cookie Categories - Simplified */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                
                {/* Essential Cookies */}
                <div className="p-3 border rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3 text-foreground" />
                      <span className="font-medium">Essenciais</span>
                    </div>
                    <div className="w-8 h-4 bg-primary rounded-full flex items-center justify-end px-0.5">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs">Necessários para funcionamento</p>
                </div>

                {/* Performance Cookies */}
                <div className="p-3 border rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <BarChart className="h-3 w-3 text-foreground" />
                      <span className="font-medium">Performance</span>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('performance')}
                      className={`w-8 h-4 rounded-full flex items-center transition-colors ${
                        preferences.performance 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 justify-start'
                      } px-0.5`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-muted-foreground text-xs">Melhorar experiência</p>
                </div>

                {/* Functionality Cookies */}
                <div className="p-3 border rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Settings className="h-3 w-3 text-foreground" />
                      <span className="font-medium">Funcionalidade</span>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('functionality')}
                      className={`w-8 h-4 rounded-full flex items-center transition-colors ${
                        preferences.functionality 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 justify-start'
                      } px-0.5`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-muted-foreground text-xs">Lembrar preferências</p>
                </div>

                {/* Marketing Cookies */}
                <div className="p-3 border rounded text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3 text-foreground" />
                      <span className="font-medium">Marketing</span>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('marketing')}
                      className={`w-8 h-4 rounded-full flex items-center transition-colors ${
                        preferences.marketing 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 justify-start'
                      } px-0.5`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-muted-foreground text-xs">Anúncios relevantes</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t">
                <Button 
                  onClick={handleAcceptSelected}
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  Confirmar
                </Button>
                <Button 
                  onClick={() => setShowDetails(false)}
                  variant="outline"
                  className="w-full h-8 text-xs"
                  size="sm"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;