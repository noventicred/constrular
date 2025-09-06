# 💻 Setup Local com Banco Real - Nova Casa Construção

## 🎯 Objetivo

Este guia te ajuda a configurar o projeto localmente conectado ao **banco de dados real** do Supabase para fazer testes antes do deploy.

## ⚠️ Importante

- Você estará conectado ao **banco de produção**
- **Teste com cuidado** para não afetar dados reais
- **Faça backup** antes de mudanças importantes

## 🔧 Configuração Passo a Passo

### 1. **Preparar Ambiente**

```bash
# Clone o projeto (se ainda não fez)
git clone https://github.com/noventicred/constrular.git
cd constrular

# Instale dependências
npm install
```

### 2. **Configurar Variáveis de Ambiente**

Crie o arquivo `.env.local` com suas configurações reais:

```bash
cp .env.example .env.local
```

Edite o `.env.local`:

```env
# ============================================================================
# CONFIGURAÇÕES REAIS - BANCO DE PRODUÇÃO
# ============================================================================

# Suas credenciais reais do Supabase
VITE_SUPABASE_URL=https://jynklrscgeshapzrogfa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bmtscnNjZ2VzaGFwenJvZ2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjE0NTYsImV4cCI6MjA3MDY5NzQ1Nn0.Erc_w4exzWUdtt0WXDbqwcFiJgPvAVWrYQYjj4s8ld0

# Configurações locais
VITE_APP_NAME="Nova Casa Construção"
VITE_APP_URL=http://localhost:8080

# WhatsApp real
VITE_WHATSAPP_NUMBER=5515999999999

# Ambiente de desenvolvimento
NODE_ENV=development
```

### 3. **Configurar Supabase CLI**

```bash
# Instalar Supabase CLI globalmente
npm install -g supabase

# Fazer login no Supabase
supabase login

# Linkar com seu projeto real
supabase link --project-ref jynklrscgeshapzrogfa
```

### 4. **Aplicar Migração (Se Necessário)**

⚠️ **CUIDADO:** Só execute se for um banco novo ou se souber o que está fazendo!

```bash
# Verificar status atual
npm run db:status

# Aplicar migração única (se necessário)
npm run db:push

# Ou usando Supabase CLI diretamente
supabase db push
```

### 5. **Iniciar Desenvolvimento**

```bash
# Iniciar servidor local
npm run dev
```

Acesse: `http://localhost:8080`

## 🔍 Verificações

### **Teste de Conexão:**
1. Abra o console do navegador (F12)
2. Procure por: `🔗 Supabase conectado:`
3. Deve mostrar sua URL e confirmação da chave

### **Teste de Autenticação:**
1. Acesse `/auth`
2. Tente fazer login ou registro
3. Verifique se o perfil é criado no banco

### **Teste do Admin:**
1. Acesse `/admin` (após login)
2. Teste criação/edição de produtos
3. Verifique se as mudanças aparecem no banco

### **Teste do Carrinho:**
1. Adicione produtos ao carrinho
2. Vá para `/checkout`
3. Teste o fluxo completo até o WhatsApp

## 🗄️ Gerenciamento do Banco

### **Comandos Úteis:**

```bash
# Ver status das migrações
npm run db:status

# Ver diferenças entre local e remoto
npm run db:diff

# Fazer backup antes de mudanças importantes
supabase db dump --file backup.sql

# Reset completo (MUITO CUIDADO!)
npm run db:reset
```

### **Painel do Supabase:**
- **URL**: https://supabase.com/dashboard/project/jynklrscgeshapzrogfa
- **Table Editor**: Ver/editar dados
- **SQL Editor**: Executar queries
- **Logs**: Monitorar atividade

## 🛡️ Segurança Local

### **Dados Sensíveis:**
- ✅ Variáveis em `.env.local` (ignorado pelo Git)
- ✅ Chaves não expostas no código
- ✅ Validação de ambiente configurada

### **Backup Regular:**
```bash
# Fazer backup dos dados importantes
supabase db dump --data-only --file backup_data.sql

# Backup da estrutura
supabase db dump --schema-only --file backup_schema.sql
```

## 🚨 Troubleshooting

### **Erro: "VITE_SUPABASE_URL não está configurada"**
**Solução:**
1. Verifique se `.env.local` existe
2. Confirme se as variáveis estão corretas
3. Reinicie o servidor: `npm run dev`

### **Erro: "Failed to connect to Supabase"**
**Solução:**
1. Verifique se o projeto Supabase está ativo
2. Confirme se as chaves estão corretas
3. Teste conexão: `supabase projects list`

### **Erro: "Migration failed"**
**Solução:**
1. Verifique se você tem permissões
2. Veja logs detalhados: `supabase db push --debug`
3. Se necessário, reset: `supabase db reset`

## 📊 Monitoramento Local

### **Console do Navegador:**
- Logs de conexão Supabase
- Erros de API
- Performance de componentes

### **Painel Supabase:**
- **Logs**: Monitorar queries
- **Auth**: Ver usuários registrados
- **Storage**: Gerenciar imagens

## ✅ Checklist de Funcionamento

- [ ] Projeto roda em `localhost:8080`
- [ ] Console mostra "🔗 Supabase conectado"
- [ ] Login/registro funcionam
- [ ] Produtos carregam da base real
- [ ] Carrinho persiste entre sessões
- [ ] Admin panel acessível
- [ ] WhatsApp redireciona corretamente

## 🎉 Resultado

Após seguir este guia, você terá:
- ✅ **Ambiente local** conectado ao banco real
- ✅ **Testes seguros** antes do deploy
- ✅ **Dados reais** para validação
- ✅ **Performance** testada
- ✅ **Funcionalidades** validadas

**Agora você pode testar tudo localmente antes do deploy!** 🚀
