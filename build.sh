#!/bin/bash

# Script de build para Vercel
echo "🚀 Iniciando build para produção..."

# Gerar cliente Prisma
echo "📦 Gerando cliente Prisma..."
npx prisma generate

# Executar migrações (apenas em produção)
if [ "$VERCEL_ENV" = "production" ]; then
  echo "🗄️ Executando migrações de produção..."
  npx prisma migrate deploy
fi

# Build do Vite
echo "🔨 Construindo aplicação..."
npm run build

echo "✅ Build concluído!"
