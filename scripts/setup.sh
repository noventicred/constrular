#!/bin/bash

# ============================================================================
# SCRIPT DE SETUP - NOVA CASA CONSTRUÇÃO
# ============================================================================
# Script para configurar o projeto localmente
# ============================================================================

set -e

echo "🚀 Configurando Nova Casa Construção..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 16+ e tente novamente."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale npm e tente novamente."
    exit 1
fi

echo "✅ npm $(npm --version) encontrado"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

# Verificar se arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚙️ Criando arquivo .env.local..."
    cp .env.example .env.local
    echo "📝 Configure suas variáveis em .env.local antes de continuar!"
else
    echo "✅ Arquivo .env.local já existe"
fi

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo ""
    echo "🔧 Instalando Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Supabase CLI $(supabase --version) encontrado"

echo ""
echo "🎯 Próximos passos:"
echo ""
echo "1. Configure suas variáveis em .env.local"
echo "2. Execute: supabase login"
echo "3. Execute: supabase link --project-ref SEU_PROJECT_ID"
echo "4. Execute: supabase db push"
echo "5. Execute: npm run dev"
echo ""
echo "🚀 Projeto estará disponível em http://localhost:8080"
echo ""
echo "✨ Setup concluído com sucesso!"
