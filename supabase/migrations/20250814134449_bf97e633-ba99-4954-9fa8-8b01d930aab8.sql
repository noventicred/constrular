-- Recriar o trigger para criar perfis automaticamente quando um usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Garantir que todos os usuários tenham is_admin = false por padrão (clientes)
UPDATE public.profiles SET is_admin = false WHERE is_admin IS NULL;