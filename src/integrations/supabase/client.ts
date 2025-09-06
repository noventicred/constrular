// ============================================================================
// SUPABASE CLIENT - NOVA CASA CONSTRUÇÃO
// ============================================================================
// Cliente Supabase configurado com variáveis de ambiente
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Obter variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar se as variáveis estão configuradas
if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL não está configurada. Verifique seu arquivo .env.local');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY não está configurada. Verifique seu arquivo .env.local');
}

// Criar cliente Supabase
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Exportar configurações para debug (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔗 Supabase conectado:', {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    env: import.meta.env.MODE
  });
}