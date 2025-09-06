# Migrações do Banco de Dados

## 📁 Estrutura

### `00000000000000_complete_schema.sql`

**Migração completa consolidada** - Este é o arquivo principal que contém toda a estrutura do banco de dados em uma única migração.

### `old_migrations/`

Pasta com as migrações antigas (backup) - Mantidas apenas para referência histórica.

## 🚀 Como Usar

### Para Novo Banco de Dados

Se você está configurando o banco pela primeira vez, apenas execute:

```bash
supabase db push
```

O Supabase executará automaticamente a migração `00000000000000_complete_schema.sql` que contém:

- ✅ Todas as tabelas necessárias
- ✅ Políticas de segurança (RLS)
- ✅ Funções e triggers
- ✅ Dados iniciais (categorias e produtos)
- ✅ Sistema de auditoria e LGPD
- ✅ Storage para imagens

### Para Banco Existente

Se você já tem um banco com as migrações antigas aplicadas, **NÃO execute** a migração consolidada, pois ela pode causar conflitos.

## 📋 O que a Migração Completa Inclui

### Tabelas Principais

- `categories` - Categorias de produtos
- `products` - Catálogo de produtos
- `profiles` - Perfis dos usuários
- `orders` - Pedidos dos clientes
- `order_items` - Itens dos pedidos
- `product_comments` - Avaliações dos produtos

### Segurança e LGPD

- `user_sensitive_data` - Dados pessoais criptografados
- `sensitive_data_audit` - Log de acessos a dados sensíveis
- Funções de criptografia e auditoria

### Funcionalidades

- **Row Level Security (RLS)** em todas as tabelas
- **Triggers** para timestamps automáticos
- **Storage** configurado para imagens de produtos
- **Funções** para operações seguras
- **Dados iniciais** para começar a usar imediatamente

## 🔧 Comandos Úteis

```bash
# Verificar status das migrações
supabase migration list

# Aplicar migrações pendentes
supabase db push

# Fazer reset completo do banco (CUIDADO!)
supabase db reset

# Ver diferenças entre local e remoto
supabase db diff
```

## ⚠️ Importante

- A migração consolidada substitui **todas** as migrações antigas
- Use apenas para novos projetos ou após backup completo
- As migrações antigas estão em `old_migrations/` para referência
- Sempre teste em ambiente de desenvolvimento primeiro
