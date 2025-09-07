import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Store, 
  MessageCircle,
  Settings,
  Save,
  RefreshCw,
  Phone,
  Truck,
  DollarSign
} from 'lucide-react';

const AdminConfiguracoes = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    store_name: '',
    store_email: '',
    whatsapp_number: '',
    free_shipping_threshold: '',
    default_shipping_cost: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) throw error;

      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {} as Record<string, string>);

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const promises = Object.entries(settings).map(([key, value]) => 
        updateSetting(key, value)
      );
      
      const results = await Promise.all(promises);
      
      if (results.every(result => result)) {
        toast({
          title: "✅ Configurações salvas!",
          description: "Todas as configurações foram atualizadas com sucesso.",
        });
      } else {
        throw new Error('Algumas configurações falharam');
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar algumas configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
            <p className="text-gray-600 mt-1">
              Configure as informações básicas da sua loja
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Settings className="h-3 w-3" />
            Admin
          </Badge>
        </div>

        <div className="space-y-8">
          {/* Informações da Loja */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Informações da Loja</CardTitle>
                  <CardDescription>Dados básicos da sua loja</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store_name" className="text-sm font-semibold text-gray-700">
                    Nome da Loja
                  </Label>
                  <Input
                    id="store_name"
                    value={settings.store_name}
                    onChange={(e) => setSettings(prev => ({ ...prev, store_name: e.target.value }))}
                    placeholder="Nova Casa Construção"
                    className="border-2 border-gray-200 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store_email" className="text-sm font-semibold text-gray-700">
                    Email da Loja
                  </Label>
                  <Input
                    id="store_email"
                    type="email"
                    value={settings.store_email}
                    onChange={(e) => setSettings(prev => ({ ...prev, store_email: e.target.value }))}
                    placeholder="contato@novacasa.com"
                    className="border-2 border-gray-200 focus:border-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">WhatsApp</CardTitle>
                  <CardDescription>Configure o número para vendas pelo WhatsApp</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number" className="text-sm font-semibold text-gray-700">
                  Número do WhatsApp
                </Label>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="5511999999999"
                  className="border-2 border-gray-200 focus:border-primary"
                />
                <p className="text-xs text-gray-500">
                  Formato: Código do país + DDD + número (ex: 5511999999999)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Entrega e Frete */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Entrega e Frete</CardTitle>
                  <CardDescription>Configure valores de entrega</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default_shipping_cost" className="text-sm font-semibold text-gray-700">
                    Custo Padrão de Entrega (R$)
                  </Label>
                  <Input
                    id="default_shipping_cost"
                    type="number"
                    step="0.01"
                    value={settings.default_shipping_cost}
                    onChange={(e) => setSettings(prev => ({ ...prev, default_shipping_cost: e.target.value }))}
                    placeholder="29.90"
                    className="border-2 border-gray-200 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="free_shipping_threshold" className="text-sm font-semibold text-gray-700">
                    Frete Grátis Acima de (R$)
                  </Label>
                  <Input
                    id="free_shipping_threshold"
                    type="number"
                    step="0.01"
                    value={settings.free_shipping_threshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, free_shipping_threshold: e.target.value }))}
                    placeholder="299.00"
                    className="border-2 border-gray-200 focus:border-primary"
                  />
                </div>
              </div>

              {/* Preview */}
              {settings.free_shipping_threshold && settings.default_shipping_cost && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Preview:</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Frete padrão: R$ {parseFloat(settings.default_shipping_cost || '0').toFixed(2)}</p>
                    <p>• Frete grátis acima de: R$ {parseFloat(settings.free_shipping_threshold || '0').toFixed(2)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={fetchSettings}
              className="h-12 px-8 font-semibold border-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="h-12 px-8 font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;