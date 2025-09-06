// ============================================================================
// SISTEMA DE LOG - NOVA CASA CONSTRUÇÃO
// ============================================================================
// Sistema de logging que remove console.logs em produção
// ============================================================================

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  context?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const contextStr = this.context ? `[${this.context}]` : "";
    const dataStr = data ? ` ${JSON.stringify(data)}` : "";

    return `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}${dataStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) {
      // Em produção, só loga warnings e errors
      return level === "warn" || level === "error";
    }
    return true;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, data));
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, data));
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, data));
    }
  }

  error(message: string, error?: any): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, error));

      // Em produção, pode enviar para serviço de monitoramento
      if (!this.isDevelopment) {
        this.sendToMonitoring("error", message, error);
      }
    }
  }

  private sendToMonitoring(level: LogLevel, message: string, data?: any): void {
    // Implementar integração com serviço de monitoramento
    // Ex: Sentry, LogRocket, etc.
    try {
      // Placeholder para integração futura
      const logEntry: LogEntry = {
        level,
        message,
        data,
        timestamp: new Date(),
        context: this.context,
      };

      // Aqui seria enviado para o serviço de monitoramento
      console.warn("📊 Log entry would be sent to monitoring:", logEntry);
    } catch (error) {
      console.error("Failed to send log to monitoring service:", error);
    }
  }

  // Método para criar logger com contexto específico
  withContext(context: string): Logger {
    return new Logger(context);
  }
}

// Instância global do logger
export const logger = new Logger();

// Loggers com contexto específico para diferentes partes da aplicação
export const authLogger = logger.withContext("AUTH");
export const cartLogger = logger.withContext("CART");
export const apiLogger = logger.withContext("API");
export const uiLogger = logger.withContext("UI");
export const adminLogger = logger.withContext("ADMIN");

// Função utilitária para substituir console.log
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
};

// Helper para logging de performance
export const performanceLogger = {
  start(label: string): void {
    if (import.meta.env.DEV) {
      console.time(label);
    }
  },

  end(label: string): void {
    if (import.meta.env.DEV) {
      console.timeEnd(label);
    }
  },

  mark(name: string): void {
    if (import.meta.env.DEV && performance && performance.mark) {
      performance.mark(name);
    }
  },
};

export default logger;
