# API Documentation - ConstrutorPro

Este diretório contém todas as APIs serverless do projeto, otimizadas para deploy no Vercel.

## 📁 Estrutura

```
api/
├── _lib/                 # Utilitários compartilhados
│   ├── cors.js          # Configuração CORS
│   ├── response.js      # Respostas padronizadas
│   ├── validation.js    # Validações
│   ├── logger.js        # Sistema de logs
│   └── data.js          # Dados mockados
├── categories/          # Gerenciamento de categorias
│   └── index.js
├── products/           # Gerenciamento de produtos
│   └── index.js
├── settings/           # Configurações da loja
│   └── index.js
├── auth/              # Autenticação
│   ├── login.js
│   └── register.js
└── users/             # Gerenciamento de usuários
    └── [id].js
```

## 🚀 Características

### ✅ Padronização Profissional
- **CORS configurado** em todas as rotas
- **Logging estruturado** com diferentes níveis
- **Respostas padronizadas** com formato consistente
- **Validação robusta** de entrada
- **Tratamento de erro** centralizado

### ✅ Segurança
- **Sanitização** de inputs
- **Validação** de tipos de dados
- **Headers de segurança** configurados
- **Rate limiting** preparado (futuro)

### ✅ Performance
- **Dados mockados** otimizados
- **Paginação** implementada
- **Filtros eficientes**
- **Caching headers** (futuro)

## 📚 APIs Disponíveis

### 🏷️ Categorias (`/api/categories`)

**GET** - Lista categorias
```bash
GET /api/categories
GET /api/categories?active=true
GET /api/categories?search=ferramentas
```

**POST** - Cria categoria
```bash
POST /api/categories
Content-Type: application/json

{
  "name": "Nova Categoria",
  "description": "Descrição da categoria"
}
```

### 📦 Produtos (`/api/products`)

**GET** - Lista produtos com filtros avançados
```bash
GET /api/products
GET /api/products?featured=true
GET /api/products?specialOffers=true
GET /api/products?categoryId=1
GET /api/products?search=furadeira
GET /api/products?minPrice=50&maxPrice=200
GET /api/products?page=2&limit=10
GET /api/products?sortBy=price&sortOrder=desc
```

**POST** - Cria produto
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Produto Novo",
  "description": "Descrição do produto",
  "price": 99.90,
  "categoryId": "1",
  "brand": "Marca"
}
```

### ⚙️ Configurações (`/api/settings`)

**GET** - Busca configurações
```bash
GET /api/settings
GET /api/settings?category=store
GET /api/settings?category=shipping
```

**PUT** - Atualiza configurações
```bash
PUT /api/settings
Content-Type: application/json

{
  "store_name": "Novo Nome",
  "whatsapp_number": "5511999999999"
}
```

### 🔐 Autenticação (`/api/auth/*`)

**POST** - Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST** - Registro
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nome Completo"
}
```

## 📋 Formato de Resposta Padrão

### ✅ Sucesso
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### ❌ Erro
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 🔍 Com Paginação
```json
{
  "success": true,
  "message": "Dados recuperados com sucesso",
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🛠️ Desenvolvimento Local

Para testar as APIs localmente:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Executar em modo desenvolvimento
npm run vercel:dev

# Ou usar o Vite (APIs via proxy)
npm run dev
```

## 🚀 Deploy

As APIs são automaticamente deployadas no Vercel quando o código é pushed para a branch main.

### Configuração do Vercel
- **Runtime**: Node.js 18.x
- **Região**: Washington D.C. (iad1)
- **CORS**: Configurado para todos os origins

## 🔧 Utilitários

### Logger
```javascript
import { logger } from '../_lib/logger.js';

logger.info('Mensagem informativa');
logger.error('Erro ocorreu', error);
logger.debug('Debug info', data);
```

### Validação
```javascript
import { validateRequiredFields, validateEmail } from '../_lib/validation.js';

const errors = validateRequiredFields(data, ['name', 'email']);
const isValid = validateEmail('test@example.com');
```

### Respostas
```javascript
import { successResponse, errorResponse } from '../_lib/response.js';

return successResponse(res, data, 'Sucesso!');
return errorResponse(res, 'Erro!', 400);
```

## 📊 Monitoramento

- **Logs**: Vercel Dashboard > Functions > Logs
- **Métricas**: Vercel Analytics
- **Erros**: Vercel Dashboard > Functions > Errors

---

**Última atualização**: Janeiro 2024  
**Versão**: 2.0.0 (Refatoração Profissional)
