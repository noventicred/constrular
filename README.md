# ConstrutorPro - Loja de Material de Construção

E-commerce moderno para venda de materiais de construção, desenvolvido com React, TypeScript, Vite, Prisma e Neon Database.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **React Router** - Roteamento para aplicações React
- **Prisma** - ORM moderno para TypeScript
- **Neon Database** - PostgreSQL serverless
- **Vercel** - Platform de deploy
- **Lucide React** - Biblioteca de ícones

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no [Neon Database](https://neon.tech)
- Conta na [Vercel](https://vercel.com)

## 🔧 Instalação Local

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd constrular
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

4. Configure sua conexão com Neon Database no `.env.local`:

```bash
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/database?sslmode=require"
```

5. Gere o cliente Prisma e execute as migrações:

```bash
npm run db:generate
npm run db:push
```

6. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🗄️ Configuração do Banco de Dados

### Neon Database Setup

1. Acesse [neon.tech](https://neon.tech) e crie uma conta
2. Crie um novo projeto
3. Copie a connection string fornecida
4. Cole no arquivo `.env.local` como `DATABASE_URL`

### Schema do Banco

O banco possui as seguintes tabelas principais:

- `users` - Usuários e administradores
- `categories` - Categorias de produtos
- `products` - Catálogo de produtos
- `orders` - Pedidos
- `order_items` - Itens dos pedidos

## 🚀 Deploy na Vercel

### Preparação

1. Instale a CLI da Vercel:

```bash
npm i -g vercel
```

2. Faça login na Vercel:

```bash
vercel login
```

### Deploy

1. Execute o deploy:

```bash
vercel --prod
```

2. Configure as variáveis de ambiente na Vercel:

   - `DATABASE_URL` - Sua connection string do Neon
   - `VITE_API_URL` - URL da sua aplicação (ex: https://constrular.vercel.app/api)

3. Execute as migrações no ambiente de produção:

```bash
npx prisma migrate deploy
```

### Configuração Automática

Você também pode conectar seu repositório GitHub à Vercel para deploys automáticos.

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza o build de produção
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:migrate` - Executa migrações em desenvolvimento
- `npm run db:deploy` - Executa migrações em produção
- `npm run db:push` - Sincroniza schema com o banco
- `npm run db:seed` - Popula o banco com dados iniciais

## 🏗️ Estrutura do Projeto

```
src/
├── api/                # APIs serverless para Vercel
│   ├── auth/          # Endpoints de autenticação
│   ├── products/      # Endpoints de produtos
│   ├── orders/        # Endpoints de pedidos
│   └── categories/    # Endpoints de categorias
├── components/        # Componentes reutilizáveis
│   ├── ui/           # Componentes base (shadcn/ui)
│   ├── admin/        # Componentes específicos do admin
│   └── auth/         # Componentes de autenticação
├── contexts/         # Context providers do React
├── hooks/            # Custom hooks
├── lib/              # Utilitários e configurações
│   ├── auth.ts       # Serviços de autenticação
│   ├── db.ts         # Configuração do Prisma
│   └── services.ts   # Serviços de negócio
├── pages/            # Páginas da aplicação
└── types/            # Definições de tipos TypeScript
```

## 🎨 Features

- **Frontend moderno** com React 18 e TypeScript
- **Interface responsiva** com Tailwind CSS
- **Componentes acessíveis** com shadcn/ui
- **Sistema de autenticação** completo com bcrypt
- **Painel administrativo** para gestão de produtos
- **Carrinho de compras** funcional
- **Sistema de checkout** integrado
- **APIs RESTful** serverless
- **Banco PostgreSQL** com Prisma ORM
- **Deploy automatizado** na Vercel
- **SEO otimizado** para melhor posicionamento

## 🔐 Autenticação

O projeto utiliza um sistema próprio de autenticação com:

- Hash de senhas com bcrypt
- Sessões armazenadas no localStorage
- Perfis de usuário e administrador
- Rotas protegidas
- APIs seguras

## 🛒 Funcionalidades do E-commerce

- Catálogo de produtos com categorias
- Sistema de busca avançada
- Carrinho de compras persistente
- Processo de checkout
- Gestão de pedidos
- Painel administrativo completo
- Sistema de estoque
- Ofertas especiais

## 🌍 Variáveis de Ambiente

### Desenvolvimento (.env.local)

```bash
DATABASE_URL="postgresql://..."
VITE_APP_URL="http://localhost:3000"
VITE_API_URL="http://localhost:3000/api"
```

### Produção (Vercel)

```bash
DATABASE_URL="postgresql://..."
VITE_APP_URL="https://seu-projeto.vercel.app"
VITE_API_URL="https://seu-projeto.vercel.app/api"
```

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se a DATABASE_URL está correta
- Confirme se o banco Neon está ativo
- Execute `npm run db:generate` após mudanças no schema

### Erro no deploy Vercel

- Verifique se todas as variáveis de ambiente estão configuradas
- Execute `npm run build` localmente para testar
- Verifique os logs na dashboard da Vercel

### Problemas com Prisma

- Execute `npm run db:generate` após instalar dependências
- Use `npm run db:push` para sincronizar o schema
- Para reset completo: exclua e recrie o banco no Neon

## 📄 Licença

Este projeto é privado e proprietário.

## 🤝 Contribuição

Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Faça push para a branch
5. Abra um Pull Request
