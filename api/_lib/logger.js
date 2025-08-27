/**
 * Sistema de logging profissional para APIs
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_COLORS = {
  ERROR: '🔴',
  WARN: '🟡', 
  INFO: '🔵',
  DEBUG: '⚪'
};

class Logger {
  constructor(context = 'API') {
    this.context = context;
    this.level = process.env.LOG_LEVEL || 'INFO';
  }

  _shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
  }

  _formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level];
    const prefix = `${color} [${timestamp}] [${this.context}] [${level}]`;
    
    if (data) {
      return `${prefix} ${message}\n${JSON.stringify(data, null, 2)}`;
    }
    
    return `${prefix} ${message}`;
  }

  error(message, data = null) {
    if (this._shouldLog('ERROR')) {
      console.error(this._formatMessage('ERROR', message, data));
    }
  }

  warn(message, data = null) {
    if (this._shouldLog('WARN')) {
      console.warn(this._formatMessage('WARN', message, data));
    }
  }

  info(message, data = null) {
    if (this._shouldLog('INFO')) {
      console.log(this._formatMessage('INFO', message, data));
    }
  }

  debug(message, data = null) {
    if (this._shouldLog('DEBUG')) {
      console.log(this._formatMessage('DEBUG', message, data));
    }
  }

  request(req) {
    this.info(`${req.method} ${req.url}`, {
      headers: req.headers,
      query: req.query,
      body: req.body
    });
  }

  response(res, data = null) {
    this.info(`Response ${res.statusCode}`, data);
  }
}

// Exportar instância padrão
export const logger = new Logger();

// Exportar classe para criar loggers customizados
export { Logger };
