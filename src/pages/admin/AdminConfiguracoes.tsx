import React, { useState, useEffect } from 'react';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Store, 
  Bell, 
  Shield, 
  Palette, 
  Mail, 
  Globe, 
  CreditCard,
  Users,
  Settings,
  Save,
  RefreshCw,
  MessageCircle,
  Phone,
  Truck
} from 'lucide-react';

const AdminConfiguracoes = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

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

      setSettings(settingsMap);
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

      setSettings(prev => ({ ...prev, [key]: value }));
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  };

  const handleSave = async (section: string, settingsToUpdate: Record<string, string>) => {
    setIsLoading(true);
    try {
      const updatePromises = Object.entries(settingsToUpdate).map(([key, value]) =>
        updateSetting(key, value)
      );
      
      const results = await Promise.all(updatePromises);
      const success = results.every(result => result === true);

      if (success) {
        toast({
          title: "Configurações salvas",
          description: `As configurações de ${section} foram atualizadas com sucesso.`,
        });
      } else {
        throw new Error('Falha ao salvar algumas configurações');
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
              <p className="text-muted-foreground">
                Gerencie as configurações do sistema e personalização
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-2">
              <Settings className="h-3 w-3" />
              Admin
            </Badge>
          </div>

          <Tabs defaultValue="geral" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="notificacoes" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="seguranca" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="aparencia" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Aparência
              </TabsTrigger>
              <TabsTrigger value="pagamentos" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pagamentos
              </TabsTrigger>
            </TabsList>

            {/* Configurações Gerais */}
            <TabsContent value="geral" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Informações da Loja
                  </CardTitle>
                  <CardDescription>
                    Configure as informações básicas da sua loja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Nome da Loja</Label>
                      <Input 
                        id="store-name" 
                        placeholder="Nome da sua loja" 
                        value={settings.store_name || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, store_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">E-mail de Contato</Label>
                      <Input 
                        id="store-email" 
                        type="email" 
                        placeholder="contato@minhaloja.com"
                        value={settings.store_email || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, store_email: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Descrição da Loja</Label>
                    <Textarea 
                      id="store-description" 
                      placeholder="Descreva sua loja..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Telefone</Label>
                      <Input id="store-phone" placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-address">Endereço</Label>
                      <Input id="store-address" placeholder="Endereço completo" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Loja Ativa</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que clientes façam pedidos
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button 
                    onClick={() => handleSave('geral', {
                      store_name: settings.store_name || '',
                      store_email: settings.store_email || ''
                    })} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configurações WhatsApp */}
            <TabsContent value="whatsapp" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Configurações do WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Configure o número do WhatsApp para receber pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="whatsapp-number" 
                          placeholder="5511999999999" 
                          value={settings.whatsapp_number || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                          className="font-mono"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Formato: <code>55DDNNNNNNNNN</code> (Ex: 5511987654321)
                      </p>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Como funciona?
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Clientes fazem pedidos no site</li>
                        <li>• O pedido é salvo no sistema</li>
                        <li>• Cliente é redirecionado para WhatsApp com detalhes do pedido</li>
                        <li>• Você recebe a mensagem com todos os dados</li>
                      </ul>
                    </div>

                    {settings.whatsapp_number && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">
                          ✅ WhatsApp Configurado
                        </h4>
                        <p className="text-sm text-green-700">
                          Número atual: <span className="font-mono">{settings.whatsapp_number}</span>
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          Os pedidos serão enviados para este número.
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Configurações de Frete</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="free-shipping">Frete Grátis a partir de</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">R$</span>
                          <Input 
                            id="free-shipping" 
                            type="number" 
                            step="0.01"
                            placeholder="299.00"
                            value={settings.free_shipping_threshold || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, free_shipping_threshold: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="default-shipping">Custo Padrão do Frete</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">R$</span>
                          <Input 
                            id="default-shipping" 
                            type="number" 
                            step="0.01"
                            placeholder="29.90"
                            value={settings.default_shipping_cost || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, default_shipping_cost: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('WhatsApp', {
                      whatsapp_number: settings.whatsapp_number || '',
                      free_shipping_threshold: settings.free_shipping_threshold || '',
                      default_shipping_cost: settings.default_shipping_cost || ''
                    })} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Configurações do WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notificacoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Configurações de Notificações
                  </CardTitle>
                  <CardDescription>
                    Configure como e quando receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Novos Pedidos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificação por e-mail para novos pedidos
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Produtos em Falta</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar quando produtos ficarem sem estoque
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Novos Clientes</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificação para novos cadastros
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Relatórios Semanais</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber resumo semanal de vendas
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Configurações de E-mail</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">Servidor SMTP</Label>
                        <Input id="smtp-host" placeholder="smtp.gmail.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Porta</Label>
                        <Input id="smtp-port" placeholder="587" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('notificações', {})} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Segurança */}
            <TabsContent value="seguranca" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Configurações de Segurança
                  </CardTitle>
                  <CardDescription>
                    Gerencie a segurança e autenticação do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Autenticação de Dois Fatores</Label>
                        <p className="text-sm text-muted-foreground">
                          Aumenta a segurança da conta admin
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Logs de Auditoria</Label>
                        <p className="text-sm text-muted-foreground">
                          Registrar todas as ações administrativas
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sessão Única</Label>
                        <p className="text-sm text-muted-foreground">
                          Permitir apenas uma sessão ativa por usuário
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Tempo de Sessão</h4>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Timeout da Sessão (minutos)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                          <SelectItem value="480">8 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('segurança', {})} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aparência */}
            <TabsContent value="aparencia" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Configurações de Aparência
                  </CardTitle>
                  <CardDescription>
                    Personalize a aparência da loja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme-color">Cor Principal</Label>
                      <Input id="theme-color" type="color" defaultValue="#0ea5e9" className="w-20 h-10" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo-url">URL do Logo</Label>
                      <Input id="logo-url" placeholder="https://exemplo.com/logo.png" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="favicon-url">URL do Favicon</Label>
                      <Input id="favicon-url" placeholder="https://exemplo.com/favicon.ico" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Tema</h4>
                    <div className="space-y-2">
                      <Label htmlFor="theme-mode">Modo do Tema</Label>
                      <Select defaultValue="light">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('aparência', {})} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pagamentos */}
            <TabsContent value="pagamentos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Configurações de Pagamento
                  </CardTitle>
                  <CardDescription>
                    Configure os métodos de pagamento aceitos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>PIX</Label>
                        <p className="text-sm text-muted-foreground">
                          Aceitar pagamentos via PIX
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cartão de Crédito</Label>
                        <p className="text-sm text-muted-foreground">
                          Aceitar pagamentos com cartão
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Boleto Bancário</Label>
                        <p className="text-sm text-muted-foreground">
                          Aceitar pagamentos via boleto
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Chave PIX</h4>
                    <div className="space-y-2">
                      <Label htmlFor="pix-key">Chave PIX</Label>
                      <Input id="pix-key" placeholder="usuario@exemplo.com" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Taxas de Entrega</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shipping-fee">Taxa Padrão (R$)</Label>
                        <Input id="shipping-fee" type="number" placeholder="10.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="free-shipping">Frete Grátis Acima de (R$)</Label>
                        <Input id="free-shipping" type="number" placeholder="100.00" />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('pagamentos', {})} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminConfiguracoes;