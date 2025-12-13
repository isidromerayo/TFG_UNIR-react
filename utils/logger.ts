/**
 * Logger utility to replace console statements
 * Respects environment and can be configured for production
 */

type LogLevel = 'log' | 'warn' | 'error' | 'debug';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    // Only log in development or when explicitly enabled
    this.config = {
      enabled: process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true',
      level: (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'log'
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    
    const levels: LogLevel[] = ['log', 'warn', 'error', 'debug'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  log(...args: unknown[]): void {
    if (this.shouldLog('log')) {
      console.log(...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;

