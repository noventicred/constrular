// ============================================================================
// HOOK PAGE VISIBILITY - OTIMIZAÇÃO DE PERFORMANCE
// ============================================================================
// Hook para detectar quando a página está visível ou oculta
// ============================================================================

import { useState, useEffect } from 'react';

export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // Listener para mudanças de visibilidade
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listeners para eventos de foco/blur da janela
    window.addEventListener('focus', () => setIsVisible(true));
    window.addEventListener('blur', () => setIsVisible(false));

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => setIsVisible(true));
      window.removeEventListener('blur', () => setIsVisible(false));
    };
  }, []);

  return isVisible;
}

// Hook para executar ações quando a página fica visível/invisível
export function useVisibilityEffect(
  callback: (isVisible: boolean) => void,
  deps: React.DependencyList = []
) {
  const isVisible = usePageVisibility();

  useEffect(() => {
    callback(isVisible);
  }, [isVisible, callback, ...deps]);

  return isVisible;
}

export default usePageVisibility;
