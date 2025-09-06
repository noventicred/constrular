// ============================================================================
// ADMIN WRAPPER - OTIMIZAÇÃO DE PERFORMANCE
// ============================================================================
// Wrapper para páginas admin que evita re-renders desnecessários
// ============================================================================

import { memo, ReactNode } from 'react';
import { useAppFocus } from '@/hooks/useAppFocus';

interface AdminWrapperProps {
  children: ReactNode;
  className?: string;
}

const AdminWrapper = memo(({ children, className = '' }: AdminWrapperProps) => {
  const { isAppActive } = useAppFocus();

  return (
    <div 
      className={`admin-container ${className}`}
      data-app-active={isAppActive()}
    >
      {children}
    </div>
  );
});

AdminWrapper.displayName = 'AdminWrapper';

export default AdminWrapper;
