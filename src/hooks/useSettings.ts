import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Settings {
  whatsapp_number: string;
  whatsapp_numbers: string;
  store_name: string;
  store_email: string;
  free_shipping_threshold: string;
  default_shipping_cost: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: "5511999999999",
    whatsapp_numbers: "[]",
    store_name: "Minha Loja",
    store_email: "contato@minhaloja.com",
    free_shipping_threshold: "299",
    default_shipping_cost: "29.90",
  });
  const [loading, setLoading] = useState(true);
  const [currentWhatsAppIndex, setCurrentWhatsAppIndex] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value");

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key as keyof Settings] = setting.value || "";
        return acc;
      }, {} as Partial<Settings>);

      setSettings((prev) => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: keyof Settings): string => {
    return settings[key] || "";
  };

  const getWhatsAppNumber = (): string => {
    try {
      // Tentar usar múltiplos números primeiro
      const whatsappNumbers = JSON.parse(settings.whatsapp_numbers || '[]');
      
      if (Array.isArray(whatsappNumbers) && whatsappNumbers.length > 0) {
        // Implementar rotação
        const selectedNumber = whatsappNumbers[currentWhatsAppIndex];
        
        // Avançar para o próximo número na rotação
        setCurrentWhatsAppIndex(prev => (prev + 1) % whatsappNumbers.length);
        
        return selectedNumber;
      }
    } catch (error) {
      console.error('Error parsing whatsapp numbers:', error);
    }
    
    // Fallback para número único
    return settings.whatsapp_number || "5511999999999";
  };

  const getFreeShippingThreshold = (): number => {
    return parseFloat(settings.free_shipping_threshold) || 299;
  };

  const getDefaultShippingCost = (): number => {
    return parseFloat(settings.default_shipping_cost) || 29.9;
  };

  return {
    settings,
    loading,
    getSetting,
    getWhatsAppNumber,
    getFreeShippingThreshold,
    getDefaultShippingCost,
    fetchSettings,
  };
};
