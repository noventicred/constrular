// ============================================================================
// HOOK LOCAL STORAGE - PERSISTÊNCIA LOCAL
// ============================================================================
// Hook para gerenciar localStorage de forma segura e tipada
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";

type SetValue<T> = T | ((prevValue: T) => T);

/**
 * Hook para gerenciar localStorage
 * @param key - Chave do localStorage
 * @param initialValue - Valor inicial
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Função para ler do localStorage
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // Estado com lazy initialization
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Função para salvar no localStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (typeof window === "undefined") {
        logger.warn("localStorage is not available");
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        setStoredValue(newValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        logger.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Função para remover do localStorage
  const removeValue = useCallback(() => {
    if (typeof window === "undefined") {
      logger.warn("localStorage is not available");
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      logger.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listener para mudanças no localStorage (outras abas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          logger.warn(
            `Error parsing localStorage change for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook para gerenciar sessionStorage
 * @param key - Chave do sessionStorage
 * @param initialValue - Valor inicial
 * @returns [value, setValue, removeValue]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Função para ler do sessionStorage
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // Estado com lazy initialization
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Função para salvar no sessionStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      if (typeof window === "undefined") {
        logger.warn("sessionStorage is not available");
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        setStoredValue(newValue);
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        logger.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Função para remover do sessionStorage
  const removeValue = useCallback(() => {
    if (typeof window === "undefined") {
      logger.warn("sessionStorage is not available");
      return;
    }

    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      logger.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
