# 🏗️ Nova Casa Construção - E-commerce

Loja online completa de material de construção desenvolvida com tecnologias modernas e preparada para deploy na Vercel.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Estado**: React Context API + TanStack Query
- **Deploy**: Vercel (configurado)

## 📦 Funcionalidades

- ✅ Catálogo de produtos com filtros e busca avançada
- ✅ Carrinho de compras persistente
- ✅ Sistema de autenticação completo (login/registro)
- ✅ Painel administrativo para gestão
- ✅ Checkout com integração WhatsApp
- ✅ Sistema de categorias hierárquico
- ✅ Responsivo para mobile e desktop
- ✅ SEO otimizado para motores de busca
- ✅ Sistema de auditoria LGPD
- ✅ Criptografia de dados sensíveis

## 🛠️ Instalação e Configuração

### 🚀 Setup Rápido (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/noventicred/constrular.git
cd constrular

# Execute o setup automático
npm run setup
```

### 🔧 Setup Manual

1. **Clone e instale dependências**

```bash
git clone https://github.com/noventicred/constrular.git
cd constrular
npm install
```

2. **Configure variáveis de ambiente**

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local
```

Edite o `.env.local` com suas configurações:

```env
# Configurações do Supabase (obrigatórias)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui

# Configurações da aplicação
VITE_APP_NAME="Nova Casa Construção"
VITE_APP_URL=http://localhost:8080

# WhatsApp para contato
VITE_WHATSAPP_NUMBER=5515999999999

# Ambiente
NODE_ENV=development
```

3. **Configure o banco de dados**

```bash
# Instalar Supabase CLI (se necessário)
npm install -g supabase

# Fazer login
supabase login

# Linkar com seu projeto
supabase link --project-ref SEU_PROJECT_ID

# Aplicar migração única (cria toda a estrutura)
npm run db:push
```

4. **Iniciar desenvolvimento**

```bash
npm run dev
```

Acesse: `http://localhost:8080`

## 🌐 Deploy na Vercel

### 🚀 Deploy Automático

```bash
# Execute o script de deploy
npm run deploy
```

### 🔧 Deploy Manual

1. **Conecte o repositório na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe: `noventicred/constrular`

2. **Configure as variáveis de ambiente na Vercel:**

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
VITE_APP_NAME=Nova Casa Construção
VITE_APP_URL=https://seu-dominio.vercel.app
VITE_WHATSAPP_NUMBER=5515999999999
NODE_ENV=production
```

3. **Configure URLs no Supabase**
   - **Site URL**: `https://seu-dominio.vercel.app`
   - **Redirect URLs**: `https://seu-dominio.vercel.app/auth`

4. **Deploy**
   - A Vercel fará deploy automático
   - Configure domínio customizado se necessário

## 🎯 Scripts Disponíveis

### **Desenvolvimento:**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### **Setup e Deploy:**
```bash
npm run setup        # Setup automático do projeto
npm run deploy       # Script de deploy para Vercel
npm run vercel:env   # Listar variáveis necessárias
```

### **Banco de Dados:**
```bash
npm run db:push      # Aplicar migração única
npm run db:reset     # Reset completo (CUIDADO!)
npm run db:diff      # Ver diferenças
npm run db:status    # Status das migrações
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── admin/          # Componentes administrativos
│   │   └── auth/           # Componentes de autenticação
│   ├── pages/              # Páginas da aplicação
│   ├── contexts/           # Context providers
│   ├── hooks/              # Hooks customizados
│   ├── lib/                # Utilitários e configurações
│   │   ├── api.ts          # Cliente API centralizado
│   │   ├── constants.ts    # Constantes globais
│   │   ├── logger.ts       # Sistema de logging
│   │   └── validation.ts   # Validações e schemas
│   ├── types/              # Definições TypeScript
│   └── integrations/       # Integrações (Supabase)
├── supabase/
│   └── migrations/         # Migração única do banco
├── scripts/                # Scripts de automação
├── .env.example            # Exemplo de variáveis
└── vercel.json            # Configuração Vercel
```

## 🔧 Configuração do Banco de Dados

### **Migração Única**
O projeto utiliza uma **única migração** que cria toda a estrutura:
- 📁 `supabase/migrations/00000000000000_complete_schema.sql`
- 🚀 **795 linhas** de SQL otimizado
- ⚡ **Setup instantâneo** com um comando

### **Estrutura Criada:**
- 8 tabelas principais
- Políticas de segurança (RLS)
- Funções e triggers
- Sistema de auditoria LGPD
- Dados iniciais para teste

## 🔐 Segurança

- ✅ **Variáveis de ambiente** para todas as chaves
- ✅ **Row Level Security** (RLS) configurado
- ✅ **Autenticação** via Supabase Auth
- ✅ **Validação rigorosa** com Zod
- ✅ **Headers de segurança** na Vercel
- ✅ **Criptografia** de dados sensíveis
- ✅ **Auditoria** de acessos (LGPD)

## 📱 Responsividade

- ✅ Design mobile-first
- ✅ Breakpoints otimizados
- ✅ Componentes adaptativos
- ✅ Touch-friendly

## 🚀 Performance

- ✅ **Lazy loading** de componentes
- ✅ **Debounce** em buscas
- ✅ **Cache** otimizado
- ✅ **Bundle** otimizado
- ✅ **Error boundaries** para robustez

## 📊 Monitoramento

- ✅ **Sistema de logging** profissional
- ✅ **Error tracking** preparado para Sentry
- ✅ **Performance** monitorada
- ✅ **Analytics** preparado

## 🆘 Suporte

### **Desenvolvimento Local:**
- Verifique o arquivo `.env.local`
- Execute `npm run db:status`
- Consulte os logs no console

### **Deploy na Vercel:**
- Verifique variáveis de ambiente
- Consulte logs no dashboard Vercel
- Teste build local: `npm run build`

### **Banco de Dados:**
- Verifique conexão: `supabase db ping`
- Reset se necessário: `npm run db:reset`
- Consulte painel Supabase

## 📄 Documentação Adicional

- 📚 **[DEPLOY.md](./DEPLOY.md)** - Guia completo de deploy
- 🚀 **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Detalhes das melhorias
- 🗄️ **[supabase/migrations/README.md](./supabase/migrations/README.md)** - Documentação do banco

## 📞 Contato

- **Email**: contato@novacasaconstrucao.com.br
- **WhatsApp**: (15) 99999-9999
- **Endereço**: Sorocaba - SP

---

**Desenvolvido com ❤️ para Nova Casa Construção** 🏗️
