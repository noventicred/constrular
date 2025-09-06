import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Settings {
  whatsapp_number: string;
  store_name: string;
  store_email: string;
  free_shipping_threshold: string;
  default_shipping_cost: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: '5511999999999',
    store_name: 'Minha Loja',
    store_email: 'contato@minhaloja.com',
    free_shipping_threshold: '299',
    default_shipping_cost: '29.90'
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
    return parseFloat(settings.free_shipping_threshold) || 299;
  };

  const getDefaultShippingCost = (): number => {
    return parseFloat(settings.default_shipping_cost) || 29.90;
  };

  return {
    settings,
    loading,
    getSetting,
    getWhatsAppNumber,
    getFreeShippingThreshold,
    getDefaultShippingCost,
    fetchSettings
  };
};