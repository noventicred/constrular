import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

const DynamicConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings, loading, updateCSSVariables } = useSettings();

  // Aplicar cores imediatamente quando o componente monta
  useEffect(() => {
    // Aplicar cores do localStorage primeiro (imediato)
    const savedColor = localStorage.getItem('app-primary-color');
    if (savedColor && savedColor !== settings.primary_color) {
      updateCSSVariables();
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      updateCSSVariables();
      
      // Atualizar título do documento
      if (settings.site_title) {
        document.title = settings.site_title;
      }
      
      // Atualizar meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && settings.site_description) {
        metaDescription.setAttribute('content', settings.site_description);
      }
    }
  }, [loading, settings, updateCSSVariables]);

  // Aplicar cores imediatamente quando a cor primária muda
  useEffect(() => {
    if (settings.primary_color && !loading) {
      // Aplicar sem delay
      updateCSSVariables();
    }
  }, [settings.primary_color, loading, updateCSSVariables]);

  return <>{children}</>;
};

export default DynamicConfigProvider;