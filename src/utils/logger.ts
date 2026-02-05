/**
 * Logger utility for structured logging
 * Provides consistent logging across the application with different log levels
 * TODO: Consider migrating to winston or pino for production environments
 */

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

interface LogContext {
    userId?: string;
    companyId?: string;
    action?: string;
    metadata?: Record<string, any>;
}

class Logger {
    private static instance: Logger;
    private isDevelopment = process.env.NODE_ENV !== 'production';

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error): string {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...context,
            ...(error && {
                error: {
                    message: error.message,
                    stack: this.isDevelopment ? error.stack : undefined,
                    name: error.name
                }
            })
        };

        return JSON.stringify(logEntry, null, this.isDevelopment ? 2 : 0);
    }

    error(message: string, error?: Error, context?: LogContext): void {
        console.error(this.formatMessage(LogLevel.ERROR, message, context, error));
    }

    warn(message: string, context?: LogContext): void {
        console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }

    info(message: string, context?: LogContext): void {
        console.info(this.formatMessage(LogLevel.INFO, message, context));
    }

    debug(message: string, context?: LogContext): void {
        if (this.isDevelopment) {
            console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
        }
    }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export types for use in other modules
export type { LogContext };