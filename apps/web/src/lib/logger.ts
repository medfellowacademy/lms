/**
 * Application Logger
 * Centralized logging with different levels and structured output
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty format for development
      return JSON.stringify(entry, null, 2);
    }
    // Compact format for production
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, levelName: string, message: string, data?: any, context?: string) {
    if (level < this.level) return;

    const entry: LogEntry = {
      level: levelName,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
    }
  }

  debug(message: string, data?: any, context?: string) {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data, context);
  }

  info(message: string, data?: any, context?: string) {
    this.log(LogLevel.INFO, 'INFO', message, data, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log(LogLevel.WARN, 'WARN', message, data, context);
  }

  error(message: string, error?: Error | any, context?: string) {
    const entry: LogEntry = {
      level: 'ERROR',
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : error,
    };

    console.error(this.formatLog(entry));
  }

  // API-specific logging
  apiRequest(method: string, path: string, userId?: string) {
    this.info('API Request', {
      method,
      path,
      userId,
    }, 'API');
  }

  apiResponse(method: string, path: string, statusCode: number, duration: number) {
    this.info('API Response', {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
    }, 'API');
  }

  apiError(method: string, path: string, error: Error, userId?: string) {
    this.error('API Error', {
      method,
      path,
      userId,
      error: error.message,
      stack: error.stack,
    }, 'API');
  }

  // Database-specific logging
  dbQuery(operation: string, model: string, duration?: number) {
    this.debug('Database Query', {
      operation,
      model,
      duration: duration ? `${duration}ms` : undefined,
    }, 'DATABASE');
  }

  dbError(operation: string, model: string, error: Error) {
    this.error('Database Error', {
      operation,
      model,
      error: error.message,
    }, 'DATABASE');
  }

  // AI-specific logging
  aiRequest(model: string, tokens?: number, userId?: string) {
    this.info('AI Request', {
      model,
      tokens,
      userId,
    }, 'AI');
  }

  aiResponse(model: string, tokens: number, duration: number, cost?: number) {
    this.info('AI Response', {
      model,
      tokens,
      duration: `${duration}ms`,
      cost: cost ? `$${cost.toFixed(4)}` : undefined,
    }, 'AI');
  }

  // Performance monitoring
  performance(operation: string, duration: number, metadata?: any) {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, level === LogLevel.WARN ? 'WARN' : 'INFO', 'Performance', {
      operation,
      duration: `${duration}ms`,
      ...metadata,
    }, 'PERFORMANCE');
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Measure execution time of async functions
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: string
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.performance(operation, duration, { context });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, error as Error, context);
    throw error;
  }
}

/**
 * Measure execution time of sync functions
 */
export function measurePerformanceSync<T>(
  operation: string,
  fn: () => T,
  context?: string
): T {
  const start = Date.now();
  try {
    const result = fn();
    const duration = Date.now() - start;
    logger.performance(operation, duration, { context });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, error as Error, context);
    throw error;
  }
}

export default logger;

