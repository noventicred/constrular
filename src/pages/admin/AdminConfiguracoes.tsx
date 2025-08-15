import React, { useState, useEffect } from 'react';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/hooks/useSettings';
import { useRealTimeColorUpdate } from '@/hooks/useRealTimeColorUpdate';
import { supabase } from '@/integrations/supabase/client';
import { 
  Store, 
  Palette, 
  Settings,
  Save,
  RefreshCw,
  MessageCircle,
  Phone,
  Share2,
  Search,
  MessageSquare,
  Layout,
  BarChart
} from 'lucide-react';

const AdminConfiguracoes = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const { updateCSSVariables } = useSettings();
  
  useRealTimeColorUpdate(settings.primary_color || '#2563eb');

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
        
        // Atualizar cores se a cor primária foi alterada
        if (settingsToUpdate.primary_color) {
          setTimeout(() => updateCSSVariables(), 100);
        }
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
              <TabsTrigger value="aparencia" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Social
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                SEO
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

                  <Button 
                    onClick={() => handleSave('informações da empresa', {
                      company_name: settings.company_name || '',
                      company_email: settings.company_email || '',
                      company_phone: settings.company_phone || '',
                      company_cnpj: settings.company_cnpj || '',
                      company_address: settings.company_address || ''
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

                    {settings.whatsapp_number && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">
                          ✅ WhatsApp Configurado
                        </h4>
                        <p className="text-sm text-green-700">
                          Número atual: <span className="font-mono">{settings.whatsapp_number}</span>
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

            {/* Aparência */}
            <TabsContent value="aparencia" className="space-y-6">
              {/* Identidade Visual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Identidade Visual
                  </CardTitle>
                  <CardDescription>
                    Configure logo, cores e tipografia da sua loja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_title">Título do Site</Label>
                      <Input
                        id="site_title"
                        value={settings.site_title || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, site_title: e.target.value }))}
                        placeholder="Nome da sua loja"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="store_name">Nome da Loja</Label>
                      <Input
                        id="store_name"
                        value={settings.store_name || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, store_name: e.target.value }))}
                        placeholder="Nome que aparece na loja"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site_description">Descrição do Site</Label>
                    <Textarea
                      id="site_description"
                      value={settings.site_description || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                      placeholder="Descrição para SEO e redes sociais"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logo_url">URL do Logo</Label>
                      <Input
                        id="logo_url"
                        value={settings.logo_url || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                        placeholder="https://exemplo.com/logo.png"
                      />
                      <p className="text-xs text-muted-foreground">
                        Logo que aparecerá no cabeçalho do site
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="favicon_url">URL do Favicon</Label>
                      <Input
                        id="favicon_url"
                        value={settings.favicon_url || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, favicon_url: e.target.value }))}
                        placeholder="https://exemplo.com/favicon.ico"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ícone que aparece na aba do navegador
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font_family">Fonte Principal</Label>
                    <select
                      id="font_family"
                      value={settings.font_family || 'Inter'}
                      onChange={(e) => setSettings(prev => ({ ...prev, font_family: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Inter">Inter (Padrão)</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={settings.primary_color || '#2563eb'}
                        onChange={(e) => {
                          const hexColor = e.target.value;
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
                        className="w-16 h-10 p-1 rounded border"
                      />
                      <Input
                        type="text"
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
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Esta cor será aplicada em botões, links e elementos principais do site
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency_symbol">Símbolo da Moeda</Label>
                    <Input
                      id="currency_symbol"
                      value={settings.currency_symbol || 'R$'}
                      onChange={(e) => setSettings(prev => ({ ...prev, currency_symbol: e.target.value }))}
                      placeholder="R$"
                      className="w-20"
                    />
                  </div>

                  <Button 
                    onClick={() => handleSave('identidade visual', {
                      site_title: settings.site_title || '',
                      store_name: settings.store_name || '',
                      site_description: settings.site_description || '',
                      logo_url: settings.logo_url || '',
                      favicon_url: settings.favicon_url || '',
                      font_family: settings.font_family || '',
                      primary_color: settings.primary_color || '',
                      primary_color_rgb: settings.primary_color_rgb || '',
                      currency_symbol: settings.currency_symbol || ''
                    })} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Identidade Visual'}
                  </Button>
                </CardContent>
              </Card>

              {/* Banner Promocional */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Banner Promocional
                  </CardTitle>
                  <CardDescription>
                    Configure as mensagens do banner superior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show_promo_banner"
                      checked={settings.show_promo_banner === 'true'}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_promo_banner: checked ? 'true' : 'false' }))}
                    />
                    <Label htmlFor="show_promo_banner">Exibir banner promocional</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banner_text_1">Mensagem 1</Label>
                      <Input
                        id="banner_text_1"
                        value={settings.banner_text_1 || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, banner_text_1: e.target.value }))}
                        placeholder="Entrega em até 24h"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banner_text_2">Mensagem 2</Label>
                      <Input
                        id="banner_text_2"
                        value={settings.banner_text_2 || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, banner_text_2: e.target.value }))}
                        placeholder="Frete Grátis acima de R$ 299"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banner_text_3">Mensagem 3</Label>
                      <Input
                        id="banner_text_3"
                        value={settings.banner_text_3 || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, banner_text_3: e.target.value }))}
                        placeholder="Compra 100% Segura"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banner_text_4">Mensagem 4</Label>
                      <Input
                        id="banner_text_4"
                        value={settings.banner_text_4 || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, banner_text_4: e.target.value }))}
                        placeholder="12x sem juros"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('banner promocional', {
                      show_promo_banner: settings.show_promo_banner || 'true',
                      banner_text_1: settings.banner_text_1 || '',
                      banner_text_2: settings.banner_text_2 || '',
                      banner_text_3: settings.banner_text_3 || '',
                      banner_text_4: settings.banner_text_4 || ''
                    })} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Banner Promocional'}
                  </Button>
                </CardContent>
              </Card>

              {/* Configurações de Layout */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Configurações de Layout
                  </CardTitle>
                  <CardDescription>
                    Configure quais elementos exibir na loja
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Newsletter</Label>
                        <p className="text-sm text-muted-foreground">
                          Exibir seção de newsletter no site
                        </p>
                      </div>
                      <Switch
                        checked={settings.show_newsletter === 'true'}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_newsletter: checked ? 'true' : 'false' }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Selos de Confiança</Label>
                        <p className="text-sm text-muted-foreground">
                          Exibir badges de segurança e qualidade
                        </p>
                      </div>
                      <Switch
                        checked={settings.show_trust_badges === 'true'}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_trust_badges: checked ? 'true' : 'false' }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Banner de Categorias</Label>
                        <p className="text-sm text-muted-foreground">
                          Exibir seção de categorias em destaque
                        </p>
                      </div>
                      <Switch
                        checked={settings.show_categories_banner === 'true'}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_categories_banner: checked ? 'true' : 'false' }))}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('layout', {
                      show_newsletter: settings.show_newsletter || 'true',
                      show_trust_badges: settings.show_trust_badges || 'true',
                      show_categories_banner: settings.show_categories_banner || 'true'
                    })} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Configurações de Layout'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Redes Sociais */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Redes Sociais
                  </CardTitle>
                  <CardDescription>
                    Configure os links das suas redes sociais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook_url">Facebook</Label>
                      <Input
                        id="facebook_url"
                        value={settings.facebook_url || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, facebook_url: e.target.value }))}
                        placeholder="https://facebook.com/suapagina"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram_url">Instagram</Label>
                      <Input
                        id="instagram_url"
                        value={settings.instagram_url || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                        placeholder="https://instagram.com/seuusuario"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtube_url">YouTube</Label>
                      <Input
                        id="youtube_url"
                        value={settings.youtube_url || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, youtube_url: e.target.value }))}
                        placeholder="https://youtube.com/seucanal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter_url">Twitter</Label>
                      <Input
                        id="twitter_url"
                        value={settings.twitter_url || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, twitter_url: e.target.value }))}
                        placeholder="https://twitter.com/seuusuario"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('redes sociais', {
                      facebook_url: settings.facebook_url || '',
                      instagram_url: settings.instagram_url || '',
                      youtube_url: settings.youtube_url || '',
                      twitter_url: settings.twitter_url || ''
                    })} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Redes Sociais'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO e Analytics */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    SEO e Analytics
                  </CardTitle>
                  <CardDescription>
                    Configure SEO e ferramentas de analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_keywords">Palavras-chave (SEO)</Label>
                    <Textarea
                      id="meta_keywords"
                      value={settings.meta_keywords || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, meta_keywords: e.target.value }))}
                      placeholder="material de construção, cimento, tijolo, tinta"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separe as palavras-chave por vírgula
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Analytics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                        <Input
                          id="google_analytics_id"
                          value={settings.google_analytics_id || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                        <Input
                          id="facebook_pixel_id"
                          value={settings.facebook_pixel_id || ''}
                          onChange={(e) => setSettings(prev => ({ ...prev, facebook_pixel_id: e.target.value }))}
                          placeholder="1234567890123456"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleSave('SEO e Analytics', {
                      meta_keywords: settings.meta_keywords || '',
                      google_analytics_id: settings.google_analytics_id || '',
                      facebook_pixel_id: settings.facebook_pixel_id || ''
                    })} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Salvando...' : 'Salvar SEO e Analytics'}
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