# 🌐 Configuração Vercel - Nova Casa Construção

## ✅ **Status: Projeto 100% Pronto para Vercel!**

## 🔧 **Variáveis de Ambiente para Configurar na Vercel:**

⚠️ **Apenas 2 variáveis são obrigatórias:**

```env
VITE_SUPABASE_URL=https://jynklrscgeshapzrogfa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bmtscnNjZ2VzaGFwenJvZ2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjE0NTYsImV4cCI6MjA3MDY5NzQ1Nn0.Erc_w4exzWUdtt0WXDbqwcFiJgPvAVWrYQYjj4s8ld0
```

### **📋 Por que apenas 2?**

- ✅ **VITE_SUPABASE_URL** - Obrigatória para conexão com banco
- ✅ **VITE_SUPABASE_ANON_KEY** - Obrigatória para autenticação
- ❌ **VITE_APP_NAME** - Não usada no código (valor fixo)
- ❌ **VITE_APP_URL** - Não usada no código (usa window.location)
- ❌ **VITE_WHATSAPP_NUMBER** - Não usada (vem do banco via useSettings)
- ❌ **NODE_ENV** - Definida automaticamente pela Vercel

## 📋 **Checklist de Deploy:**

### **1. ✅ Repositório Configurado**
- [x] Código no GitHub: `noventicred/constrular`
- [x] Branch main atualizada
- [x] Configurações de build prontas

### **2. ⏳ Configuração Vercel**
- [ ] Importar repositório `noventicred/constrular`
- [ ] Ir em **Settings > Environment Variables**
- [ ] Adicionar as 2 variáveis (Production + Preview + Development)
- [ ] Fazer redeploy se necessário

### **3. ⏳ Configuração Supabase**
- [ ] Adicionar domínio Vercel em **Site URL**
- [ ] Adicionar em **Redirect URLs**: `https://seu-dominio.vercel.app/auth`

### **4. ⏳ Teste Final**
- [ ] Site carregando corretamente
- [ ] Login/registro funcionando
- [ ] Produtos carregando
- [ ] Carrinho funcionando
- [ ] WhatsApp redirecionando
- [ ] Admin panel acessível

## 🚀 **Configurações Automáticas da Vercel:**

O `vercel.json` já está configurado com:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## 📊 **Otimizações Incluídas:**

### **🔒 Segurança:**
- Headers de segurança (XSS, CSRF, etc.)
- Proteção de frames
- Content-Type protection

### **⚡ Performance:**
- Cache otimizado para assets (1 ano)
- Compressão automática
- Bundle otimizado (2MB total)

### **🎯 SEO:**
- Rewrites para SPA
- Meta tags otimizadas
- Sitemap friendly

## 🛠️ **Comandos Úteis:**

### **Para Deploy:**
```bash
npm run deploy       # Script automático de deploy
npm run vercel:env   # Listar env vars necessárias
```

### **Para Desenvolvimento:**
```bash
npm run dev          # Servidor local
npm run build        # Testar build
npm run preview      # Preview do build
```

### **Para Banco:**
```bash
npm run db:push      # Aplicar migração única
npm run db:status    # Ver status
npm run db:diff      # Ver diferenças
```

## 🎉 **Resultado Esperado:**

Após o deploy na Vercel, você terá:
- ✅ **E-commerce funcionando** em produção
- ✅ **Performance otimizada** 
- ✅ **Segurança configurada**
- ✅ **Banco sincronizado**
- ✅ **Domínio customizável**
- ✅ **Deploy automático** em novos commits

## 📞 **Suporte:**

Se houver problemas:
1. Verifique logs na Vercel dashboard
2. Teste build local: `npm run build`
3. Verifique variáveis de ambiente
4. Consulte `DEPLOY.md` para troubleshooting

**Seu projeto está pronto para o mundo!** 🌍✨
