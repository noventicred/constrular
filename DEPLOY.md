# 🚀 Guia de Deploy - Nova Casa Construção

## 📋 Configuração para Desenvolvimento Local

### 1. **Configurar Variáveis de Ambiente**

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env.local
```

Edite o `.env.local` com suas configurações reais:

```env
# Suas configurações do Supabase
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

### 2. **Configurar Banco de Dados**

Execute a migração única para criar toda a estrutura:

```bash
# Instalar Supabase CLI (se não tiver)
npm install -g supabase

# Fazer login no Supabase
supabase login

# Linkar com seu projeto
supabase link --project-ref SEU_PROJECT_ID

# Aplicar a migração única
supabase db push
```

### 3. **Executar Localmente**

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:8080`

## 🌐 Deploy na Vercel

### 1. **Preparar Repositório**

Certifique-se de que tudo está commitado:

```bash
git add .
git commit -m "Configuração para deploy"
git push origin main
```

### 2. **Configurar Projeto na Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Conecte com sua conta GitHub
3. Importe o repositório: `noventicred/constrular`
4. Configure as seguintes **Environment Variables**:

#### **Variáveis Obrigatórias:**

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
VITE_APP_NAME=Nova Casa Construção
VITE_APP_URL=https://seu-dominio.vercel.app
VITE_WHATSAPP_NUMBER=5515999999999
NODE_ENV=production
```

### 3. **Deploy Automático**

A Vercel detectará automaticamente:
- ✅ **Framework:** Vite
- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `dist`
- ✅ **Install Command:** `npm install`

### 4. **Configurações Avançadas**

O `vercel.json` já está configurado com:
- ✅ **Rewrites** para SPA
- ✅ **Headers de segurança**
- ✅ **Cache otimizado**
- ✅ **Variáveis de ambiente**

## 🔧 Configuração do Supabase para Produção

### 1. **Configurar Domínio**

No painel do Supabase:
1. Vá em **Settings > API**
2. Adicione seu domínio da Vercel em **Site URL**
3. Adicione em **Redirect URLs:**
   - `https://seu-dominio.vercel.app/auth`
   - `https://seu-dominio.vercel.app/`

### 2. **Aplicar Migrações em Produção**

```bash
# Conectar ao projeto de produção
supabase link --project-ref SEU_PROJECT_ID_PRODUCAO

# Aplicar migração única
supabase db push
```

## 🛠️ Scripts Disponíveis

### **Desenvolvimento:**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build:dev    # Build de desenvolvimento
npm run preview      # Preview do build
npm run lint         # Verificar código
```

### **Produção:**
```bash
npm run build        # Build de produção
npm run preview      # Testar build localmente
```

### **Banco de Dados:**
```bash
supabase db push     # Aplicar migrações
supabase db reset    # Reset completo (CUIDADO!)
supabase db diff     # Ver diferenças
supabase migration list  # Listar migrações
```

## 🔍 Verificação de Deploy

### **Checklist Pré-Deploy:**
- [ ] Variáveis de ambiente configuradas
- [ ] Migração aplicada no banco
- [ ] Build local funcionando (`npm run build`)
- [ ] Testes passando
- [ ] URLs do Supabase atualizadas

### **Checklist Pós-Deploy:**
- [ ] Site carregando corretamente
- [ ] Autenticação funcionando
- [ ] Banco de dados conectado
- [ ] WhatsApp redirecionando
- [ ] Admin panel acessível

## 🚨 Troubleshooting

### **Erro: Variáveis não configuradas**
```
VITE_SUPABASE_URL não está configurada
```
**Solução:** Verifique se o arquivo `.env.local` existe e está configurado.

### **Erro: Banco não conecta**
```
Failed to connect to database
```
**Solução:** 
1. Verifique se as URLs do Supabase estão corretas
2. Execute `supabase db push` para aplicar migrações
3. Verifique se o projeto está ativo no Supabase

### **Erro: Build falha na Vercel**
**Solução:**
1. Teste o build localmente: `npm run build`
2. Verifique se todas as variáveis estão configuradas na Vercel
3. Veja os logs detalhados no dashboard da Vercel

## 📊 Monitoramento

### **Logs da Vercel:**
- Acesse o dashboard da Vercel
- Vá em **Functions** > **View Logs**
- Monitore erros e performance

### **Logs do Supabase:**
- Acesse o painel do Supabase
- Vá em **Logs** para ver queries e erros
- Configure alertas se necessário

## 🎯 Resultado Final

Após seguir este guia, você terá:
- ✅ **Desenvolvimento local** funcionando com banco real
- ✅ **Deploy automático** na Vercel
- ✅ **Variáveis seguras** configuradas
- ✅ **Banco sincronizado** entre ambientes
- ✅ **Monitoramento** configurado

**Seu e-commerce estará pronto para produção!** 🛒✨
