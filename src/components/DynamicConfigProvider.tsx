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
  }, [loading, settings.primary_color, settings.site_title, settings.site_description, updateCSSVariables]);

  return <>{children}</>;
};

export default DynamicConfigProvider;