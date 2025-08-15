import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Settings {
  whatsapp_number: string;
  store_name: string;
  store_email: string;
  free_shipping_threshold: string;
  default_shipping_cost: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_cnpj: string;
  primary_color: string;
  primary_color_rgb: string;
  site_title: string;
  site_description: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: '5511999999999',
    store_name: 'Minha Loja',
    store_email: 'contato@minhaloja.com',
    free_shipping_threshold: '199',
    default_shipping_cost: '29.90',
    company_name: 'ConstrutorPro',
    company_address: 'Rua das Construções, 123 - Centro',
    company_phone: '(11) 99999-9999',
    company_email: 'contato@construtorpro.com',
    company_cnpj: '12.345.678/0001-90',
    primary_color: '#2563eb',
    primary_color_rgb: '37, 99, 235',
    site_title: 'ConstrutorPro - Material de Construção',
    site_description: 'Loja completa de material de construção com os melhores preços'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key as keyof Settings] = setting.value || '';
        return acc;
      }, {} as Partial<Settings>);

      setSettings(prev => ({ ...prev, ...settingsMap }));
      
      // Aplicar mudanças de cor imediatamente após carregar
      setTimeout(() => {
        updateCSSVariables();
      }, 100);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: keyof Settings): string => {
    return settings[key] || '';
  };

  const getWhatsAppNumber = (): string => {
    const number = settings.whatsapp_number || '5511999999999';
    console.log('📞 BUSCANDO NÚMERO WHATSAPP:', number);
    return number;
  };

  const getFreeShippingThreshold = (): number => {
    return parseFloat(settings.free_shipping_threshold) || 199;
  };

  const getDefaultShippingCost = (): number => {
    return parseFloat(settings.default_shipping_cost) || 29.90;
  };

  const getCompanyName = (): string => {
    return settings.company_name || 'ConstrutorPro';
  };

  const getCompanyAddress = (): string => {
    return settings.company_address || 'Rua das Construções, 123 - Centro';
  };

  const getCompanyPhone = (): string => {
    return settings.company_phone || '(11) 99999-9999';
  };

  const getCompanyEmail = (): string => {
    return settings.company_email || 'contato@construtorpro.com';
  };

  const getCompanyCnpj = (): string => {
    return settings.company_cnpj || '12.345.678/0001-90';
  };

  const getPrimaryColor = (): string => {
    return settings.primary_color || '#2563eb';
  };

  const getPrimaryColorRgb = (): string => {
    return settings.primary_color_rgb || '37, 99, 235';
  };

  const getSiteTitle = (): string => {
    return settings.site_title || 'ConstrutorPro - Material de Construção';
  };

  const getSiteDescription = (): string => {
    return settings.site_description || 'Loja completa de material de construção com os melhores preços';
  };

  const updateCSSVariables = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const primaryColor = getPrimaryColor();
      
      // Converter hex para HSL
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
      };

      const [h, s, l] = hexToHsl(primaryColor);
      
      // Aplicar cor primária e todas suas variações
      root.style.setProperty('--primary', `${h} ${s}% ${l}%`);
      root.style.setProperty('--primary-foreground', '0 0% 98%');
      
      // Accent usa a mesma cor primária
      root.style.setProperty('--accent', `${h} ${s}% ${l}%`);
      root.style.setProperty('--accent-foreground', '0 0% 98%');
      
      // Ring (foco) usa a cor primária
      root.style.setProperty('--ring', `${h} ${s}% ${l}%`);
      
      // Variações para construção
      root.style.setProperty('--construction-orange', `${h} ${s}% ${l}%`);
      
      // Gradientes dinâmicos
      const lighterL = Math.min(100, l + 10);
      root.style.setProperty('--hero-gradient', `linear-gradient(135deg, hsl(${h} ${s}% ${l}%), hsl(${h} ${s}% ${lighterL}%))`);
      
      // Sombras com a cor primária
      root.style.setProperty('--shadow-soft', `0 2px 20px -5px hsl(${h} ${s}% ${l}% / 0.1)`);
      root.style.setProperty('--shadow-strong', `0 10px 40px -10px hsl(${h} ${s}% ${l}% / 0.3)`);
      
      // Sidebar primary para admin
      root.style.setProperty('--sidebar-primary', `${h} ${s}% ${Math.max(10, l - 20)}%`);
      root.style.setProperty('--sidebar-ring', `${h} ${s}% ${l}%`);
      
      // Força atualização dos elementos
      document.body.style.setProperty('--primary-computed', `hsl(${h}, ${s}%, ${l}%)`);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Aplicar cores imediatamente quando settings mudam
    setTimeout(() => {
      updateCSSVariables();
    }, 50);
  };

  return {
    settings,
    loading,
    getSetting,
    getWhatsAppNumber,
    getFreeShippingThreshold,
    getDefaultShippingCost,
    getCompanyName,
    getCompanyAddress,
    getCompanyPhone,
    getCompanyEmail,
    getCompanyCnpj,
    getPrimaryColor,
    getPrimaryColorRgb,
    getSiteTitle,
    getSiteDescription,
    updateCSSVariables,
    updateSettings,
    fetchSettings
  };
};