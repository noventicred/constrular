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
                    Informações da Empresa
                  </CardTitle>
                  <CardDescription>
                    Configure as informações básicas da sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nome da Empresa</Label>
                      <Input 
                        id="company-name" 
                        placeholder="Nome da sua empresa" 
                        value={settings.company_name || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-email">E-mail Principal</Label>
                      <Input 
                        id="company-email" 
                        type="email" 
                        placeholder="contato@minhaempresa.com"
                        value={settings.company_email || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, company_email: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Telefone Principal</Label>
                      <Input 
                        id="company-phone" 
                        placeholder="(11) 99999-9999"
                        value={settings.company_phone || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, company_phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-cnpj">CNPJ</Label>
                      <Input 
                        id="company-cnpj" 
                        placeholder="12.345.678/0001-90"
                        value={settings.company_cnpj || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, company_cnpj: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-address">Endereço Completo</Label>
                    <Textarea 
                      id="company-address" 
                      placeholder="Rua das Empresas, 123 - Centro - São Paulo/SP - CEP: 01234-567"
                      value={settings.company_address || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, company_address: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Configurações do Site</h4>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="site-title">Título do Site (SEO)</Label>
                        <Input 
                          id="site-title" 
                          placeholder="Nome da Empresa - Descrição"
                          value={settings.site_title || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, site_title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="site-description">Descrição do Site (SEO)</Label>
                        <Textarea 
                          id="site-description" 
                          placeholder="Descrição para mecanismos de busca..."
                          value={settings.site_description || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('informações da empresa', {
                      company_name: settings.company_name || '',
                      company_email: settings.company_email || '',
                      company_phone: settings.company_phone || '',
                      company_cnpj: settings.company_cnpj || '',
                      company_address: settings.company_address || '',
                      site_title: settings.site_title || '',
                      site_description: settings.site_description || ''
                    })} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Informações da Empresa
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
                            placeholder="199.00"
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
                    Personalização Visual
                  </CardTitle>
                  <CardDescription>
                    Customize as cores e aparência do seu site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Cor Principal do Site</h4>
                      <div className="flex items-center gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color">Selecionar Cor</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id="primary-color" 
                              type="color" 
                              value={settings.primary_color || '#2563eb'}
                              onChange={(e) => {
                                const hexColor = e.target.value;
                                // Converter hex para RGB
                                const r = parseInt(hexColor.slice(1, 3), 16);
                                const g = parseInt(hexColor.slice(3, 5), 16);
                                const b = parseInt(hexColor.slice(5, 7), 16);
                                const rgbValue = `${r}, ${g}, ${b}`;
                                
                                setSettings(prev => ({ 
                                  ...prev, 
                                  primary_color: hexColor,
                                  primary_color_rgb: rgbValue
                                }));
                              }}
                              className="w-16 h-10 border-2 cursor-pointer"
                            />
                            <Input 
                              value={settings.primary_color || '#2563eb'}
                              onChange={(e) => {
                                const hexColor = e.target.value;
                                if (hexColor.match(/^#[0-9A-F]{6}$/i)) {
                                  const r = parseInt(hexColor.slice(1, 3), 16);
                                  const g = parseInt(hexColor.slice(3, 5), 16);
                                  const b = parseInt(hexColor.slice(5, 7), 16);
                                  const rgbValue = `${r}, ${g}, ${b}`;
                                  
                                  setSettings(prev => ({ 
                                    ...prev, 
                                    primary_color: hexColor,
                                    primary_color_rgb: rgbValue
                                  }));
                                }
                              }}
                              placeholder="#2563eb"
                              className="font-mono"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Esta cor será aplicada a botões, links e elementos de destaque
                          </p>
                        </div>
                      </div>
                      
                      {/* Preview da cor */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <p className="text-sm font-medium">Prévia da cor:</p>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: settings.primary_color || '#2563eb' }}
                          />
                          <div className="space-y-1">
                            <Button 
                              style={{ 
                                backgroundColor: settings.primary_color || '#2563eb',
                                borderColor: settings.primary_color || '#2563eb'
                              }}
                              className="text-white"
                              size="sm"
                            >
                              Botão de Exemplo
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Assim ficarão os botões principais do site
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Cores Pré-definidas</h4>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          { name: 'Azul', color: '#2563eb' },
                          { name: 'Verde', color: '#16a34a' },
                          { name: 'Roxo', color: '#9333ea' },
                          { name: 'Rosa', color: '#e11d48' },
                          { name: 'Laranja', color: '#ea580c' },
                          { name: 'Cyan', color: '#0891b2' }
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              const r = parseInt(preset.color.slice(1, 3), 16);
                              const g = parseInt(preset.color.slice(3, 5), 16);
                              const b = parseInt(preset.color.slice(5, 7), 16);
                              const rgbValue = `${r}, ${g}, ${b}`;
                              
                              setSettings(prev => ({ 
                                ...prev, 
                                primary_color: preset.color,
                                primary_color_rgb: rgbValue
                              }));
                            }}
                            className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('aparência', {
                      primary_color: settings.primary_color || '',
                      primary_color_rgb: settings.primary_color_rgb || ''
                    })} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar Configurações de Aparência
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