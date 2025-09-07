-- ============================================================================
-- ADICIONAR POLÍTICAS DE DELETE PARA ADMINISTRADORES
-- ============================================================================
-- Permite que administradores excluam pedidos e itens

-- Política para admins excluírem pedidos
CREATE POLICY "Admins can delete orders" 
ON public.orders 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Política para admins excluírem itens de pedidos
CREATE POLICY "Admins can delete order items" 
ON public.order_items 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Política para admins atualizarem itens de pedidos
CREATE POLICY "Admins can update order items" 
ON public.order_items 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Comentário
COMMENT ON POLICY "Admins can delete orders" ON public.orders IS 'Permite que administradores excluam pedidos do sistema';
