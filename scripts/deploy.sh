#!/bin/bash

# ============================================================================
# SCRIPT DE DEPLOY - NOVA CASA CONSTRUÇÃO
# ============================================================================
# Script para facilitar o deploy na Vercel
# ============================================================================

set -e

echo "🚀 Preparando deploy para Vercel..."
echo ""

# Verificar se está na branch main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️ Você está na branch '$current_branch'. Mude para 'main' antes do deploy."
    echo "Execute: git checkout main"
    exit 1
fi

echo "✅ Na branch main"

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️ Há mudanças não commitadas. Commit antes do deploy:"
    git status --short
    echo ""
    echo "Execute:"
    echo "  git add ."
    echo "  git commit -m 'Preparação para deploy'"
    exit 1
fi

echo "✅ Working directory limpo"

# Fazer build local para testar
echo ""
echo "🔨 Testando build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local bem-sucedido"
else
    echo "❌ Erro no build local. Corrija os erros antes do deploy."
    exit 1
fi

# Fazer push para GitHub
echo ""
echo "📤 Enviando para GitHub..."
git push origin main

echo ""
echo "🎯 Deploy checklist:"
echo ""
echo "✅ 1. Código enviado para GitHub"
echo "⏳ 2. Configure variáveis na Vercel:"
echo "     - VITE_SUPABASE_URL"
echo "     - VITE_SUPABASE_ANON_KEY"
echo "     - VITE_APP_NAME"
echo "     - VITE_APP_URL"
echo "     - VITE_WHATSAPP_NUMBER"
echo "     - NODE_ENV=production"
echo ""
echo "⏳ 3. Configure URLs no Supabase:"
echo "     - Site URL: https://seu-dominio.vercel.app"
echo "     - Redirect URLs: https://seu-dominio.vercel.app/auth"
echo ""
echo "⏳ 4. Execute migrações em produção:"
echo "     supabase link --project-ref SEU_PROJECT_ID_PRODUCAO"
echo "     supabase db push"
echo ""
echo "🚀 Acesse vercel.com para completar o deploy!"
