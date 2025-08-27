# Guia de Desenvolvimento - Constrular

## ⚠️ Problema Resolvido: Conflito pasta `/api` vs Middleware

### 🐛 **Problema**

- Erros 500 nas APIs `/api/products` e `/api/categories`
- `ReferenceError: exports is not defined in ES module scope`
- Vite tentando processar arquivos da pasta `/api` como módulos ES

### ✅ **Solução**

Durante desenvolvimento local, a pasta `/api` causa conflitos com o middleware do Vite.

**Para desenvolvimento:**

1. Mover pasta `api` para `api-backup`: `mv api api-backup`
2. Rodar servidor: `npm run dev:client`
3. APIs funcionam via middleware mockado

**Para deploy/build:**

1. Restaurar pasta: `mv api-backup api`
2. Build/deploy: `npm run build`
3. APIs funcionam via Vercel

### 🔧 **Middleware Funcional**

- Localizado em `src/dev-middleware.ts`
- Intercepta todas as rotas `/api/*`
- Dados mockados para desenvolvimento
- CORS configurado corretamente

### 📋 **APIs Disponíveis**

- `GET /api/products` - Lista produtos
- `GET /api/categories` - Lista categorias
- `GET /api/users` - Lista usuários
- `GET /api/users/[id]` - Usuário por ID
- `GET /api/orders` - Lista pedidos
- `GET /api/dashboard/stats` - Estatísticas

### 🚀 **Status**

- ✅ Desenvolvimento local: Funcionando
- ✅ Build: Funcionando
- ✅ Deploy Vercel: **RESOLVIDO** (APIs CommonJS criadas)
- ✅ Todas as funcionalidades: Operacionais

### 🔧 **Solução Vercel**

**Problema**: `ReferenceError: exports is not defined`
**Causa**: Conflito ES modules vs CommonJS na Vercel
**Solução**: Criadas versões `.js` CommonJS das APIs:

- `api/categories/index.js`
- `api/products/index.js`
- `api/users/[id].js`
- `api/auth/login.js`
- `api/auth/register.js`

**Configuração**: `vercel.json` especifica runtime Node.js para `.js`
