# Nova Casa Construção - E-commerce

Loja online completa de material de construção desenvolvida com tecnologias modernas.

## 🏗️ Sobre o Projeto

Sistema de e-commerce especializado em materiais de construção, oferecendo uma experiência completa de compra online com catálogo de produtos, carrinho de compras, sistema de autenticação e painel administrativo.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Estado**: React Context API + TanStack Query

## 📦 Funcionalidades

- ✅ Catálogo de produtos com filtros e busca
- ✅ Carrinho de compras persistente
- ✅ Sistema de autenticação (login/registro)
- ✅ Painel administrativo para gestão de produtos
- ✅ Checkout completo com múltiplas formas de pagamento
- ✅ Sistema de categorias
- ✅ Responsivo para mobile e desktop
- ✅ SEO otimizado

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório**

```bash
git clone <URL_DO_REPOSITORIO>
cd buildkit-ecom
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

   - Configure seu projeto no Supabase
   - As configurações do Supabase estão em `src/integrations/supabase/client.ts`

4. **Execute as migrações do banco de dados**

```bash
# Se estiver usando Supabase CLI
supabase db push
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── admin/          # Componentes do painel admin
│   └── auth/           # Componentes de autenticação
├── pages/              # Páginas da aplicação
├── contexts/           # Contextos React
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e helpers
├── types/              # Definições de tipos TypeScript
└── integrations/       # Integrações externas (Supabase)
```

## 🎯 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run build:dev` - Gera build de desenvolvimento
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🔧 Configuração do Banco de Dados

O projeto utiliza Supabase como backend. As migrações estão localizadas em `supabase/migrations/` e incluem:

- Tabelas de produtos, categorias e usuários
- Políticas de segurança (RLS)
- Funções e triggers necessários

## 📱 Responsividade

O projeto é totalmente responsivo, utilizando:

- Tailwind CSS para estilização responsiva
- Componentes adaptativos do shadcn/ui
- Hook customizado `use-mobile` para detecção de dispositivos

## 🔐 Autenticação e Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) configurado
- Proteção de rotas administrativas
- Validação de formulários com Zod

## 🚀 Deploy

O projeto pode ser facilmente deployado em plataformas como:

- Vercel (configuração incluída em `vercel.json`)
- Netlify (configuração incluída em `public/_redirects`)
- Qualquer provedor que suporte aplicações React/Vite

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request
