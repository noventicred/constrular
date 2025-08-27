import { useState, useEffect } from "react";
// import { supabase } from '@/integrations/supabase/client';

interface Settings {
  whatsapp_number: string;
  store_name: string;
  store_email: string;
  free_shipping_threshold: string;
  default_shipping_cost: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: "5511999999999",
    store_name: "Minha Loja",
    store_email: "contato@minhaloja.com",
    free_shipping_threshold: "199",
    default_shipping_cost: "29.90",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log("⚙️ Carregando configurações da API...");

      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Erro ao carregar configurações");
      }

      const data = await response.json();

      if (data.settings) {
        setSettings(data.settings);
        console.log("✅ Configurações carregadas com sucesso");
      } else {
        console.log("⚠️ Usando configurações padrão");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar configurações:", error);
      console.log("⚠️ Usando configurações padrão devido ao erro");
      // Manter configurações padrão em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: keyof Settings): string => {
    return settings[key] || "";
  };

  const getWhatsAppNumber = (): string => {
    const number = settings.whatsapp_number || "5511999999999";
    console.log("📞 BUSCANDO NÚMERO WHATSAPP:", number);
    return number;
  };

  const getFreeShippingThreshold = (): number => {
    return parseFloat(settings.free_shipping_threshold) || 199;
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
