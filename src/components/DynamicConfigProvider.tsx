import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

const DynamicConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings, loading, updateCSSVariables } = useSettings();

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

  // Também escutar mudanças específicas na cor primária
  useEffect(() => {
    if (settings.primary_color && !loading) {
      updateCSSVariables();
    }
  }, [settings.primary_color, loading, updateCSSVariables]);

  return <>{children}</>;
};

export default DynamicConfigProvider;