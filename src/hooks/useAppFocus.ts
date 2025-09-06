// ============================================================================
// HOOK APP FOCUS - CONTROLE DE FOCO DA APLICAÇÃO
// ============================================================================
// Hook para gerenciar estado de foco e evitar refreshes desnecessários
// ============================================================================

import { useState, useEffect, useRef } from 'react';

interface AppFocusState {
  isVisible: boolean;
  isFocused: boolean;
  lastFocusTime: number;
  lastBlurTime: number;
}

export function useAppFocus() {
  const [focusState, setFocusState] = useState<AppFocusState>({
    isVisible: !document.hidden,
    isFocused: document.hasFocus(),
    lastFocusTime: Date.now(),
    lastBlurTime: 0,
  });

  const stateRef = useRef(focusState);
  stateRef.current = focusState;

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      const now = Date.now();
      
      setFocusState(prev => ({
        ...prev,
        isVisible,
        lastFocusTime: isVisible ? now : prev.lastFocusTime,
        lastBlurTime: !isVisible ? now : prev.lastBlurTime,
      }));
    };

    const handleFocus = () => {
      const now = Date.now();
      setFocusState(prev => ({
        ...prev,
        isFocused: true,
        lastFocusTime: now,
      }));
    };

    const handleBlur = () => {
      const now = Date.now();
      setFocusState(prev => ({
        ...prev,
        isFocused: false,
        lastBlurTime: now,
      }));
    };

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Função para verificar se deve fazer refresh baseado no tempo
  const shouldRefresh = (cacheTime: number = 5 * 60 * 1000): boolean => {
    const { isVisible, isFocused, lastFocusTime } = stateRef.current;
    const now = Date.now();
    
    // Só faz refresh se a página está visível/focada E o cache expirou
    return (isVisible || isFocused) && (now - lastFocusTime > cacheTime);
  };

  // Função para verificar se a aplicação está ativa
  const isAppActive = (): boolean => {
    return focusState.isVisible || focusState.isFocused;
  };

  // Função para obter tempo desde a última vez que ficou ativa
  const getTimeSinceActive = (): number => {
    const now = Date.now();
    return now - Math.max(focusState.lastFocusTime, focusState.lastBlurTime);
  };

  return {
    ...focusState,
    shouldRefresh,
    isAppActive,
    getTimeSinceActive,
  };
}

export default useAppFocus;
