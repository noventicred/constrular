// ============================================================================
// LOADING SPINNER - COMPONENTE UI
// ============================================================================
// Componente de loading reutilizável e acessível
// ============================================================================

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "default" | "primary" | "secondary";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const variantClasses = {
  default: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
};

export function LoadingSpinner({
  size = "md",
  className,
  text,
  variant = "default",
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        aria-hidden="true"
      />
      {text && (
        <span className={cn("text-sm", variantClasses[variant])}>{text}</span>
      )}
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

// Componente para loading de página inteira
export function PageLoader({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Componente para loading inline
export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}

export default LoadingSpinner;
