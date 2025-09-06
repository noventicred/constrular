// ============================================================================
// ERROR BOUNDARY - COMPONENTE UI
// ============================================================================
// Componente para capturar e tratar erros React
// ============================================================================

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Chama callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Em produção, enviar para serviço de monitoramento
    if (import.meta.env.PROD) {
      // Aqui seria enviado para Sentry, LogRocket, etc.
      console.error("Production error:", { error, errorInfo });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Renderizar fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback padrão
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full">
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Ops! Algo deu errado</AlertTitle>
              <AlertDescription>
                Ocorreu um erro inesperado. Você pode tentar recarregar a página
                ou voltar mais tarde.
              </AlertDescription>
            </Alert>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2 text-sm">
                  Detalhes do erro (desenvolvimento):
                </h3>
                <pre className="text-xs overflow-auto max-h-32 text-destructive">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button onClick={this.handleReload} variant="default" size="sm">
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar error boundary programaticamente
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Manual error:", error, errorInfo);

    if (import.meta.env.PROD) {
      // Enviar para serviço de monitoramento
      console.error("Production manual error:", { error, errorInfo });
    }
  };
}

// Componente funcional wrapper para facilitar o uso
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        Ocorreu um erro inesperado. Você pode tentar novamente ou recarregar a
        página.
      </p>

      {import.meta.env.DEV && (
        <details className="mb-4 w-full max-w-md">
          <summary className="cursor-pointer text-sm font-medium mb-2">
            Detalhes do erro (desenvolvimento)
          </summary>
          <pre className="text-xs bg-muted p-4 rounded overflow-auto text-left">
            {error.message}
            {"\n"}
            {error.stack}
          </pre>
        </details>
      )}

      <div className="flex gap-2">
        <Button onClick={resetError} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
        <Button onClick={() => window.location.reload()}>
          Recarregar Página
        </Button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
