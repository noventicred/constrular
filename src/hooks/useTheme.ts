import { useEffect } from 'react';
import { useSettings } from './useSettings';

export const useTheme = () => {
  const { settings, loading, updateCSSVariables } = useSettings();

  useEffect(() => {
    if (!loading) {
      updateCSSVariables();
    }
  }, [loading, settings.primary_color, updateCSSVariables]);

  return {
    settings,
    loading
  };
};