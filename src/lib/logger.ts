import { dev } from '$app/environment';

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    error?: Error;
}

class Logger {
    private static instance: Logger;
    private logLevel: LogLevel = dev ? LogLevel.DEBUG : LogLevel.INFO;

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    private formatLog(entry: LogEntry): string {
        const { timestamp, level, message, context, error } = entry;
        let logMessage = `[${timestamp}] ${level}: ${message}`;

        if (context) {
            logMessage += `\nContext: ${JSON.stringify(context, null, 2)}`;
        }

        if (error) {
            logMessage += `\nError: ${error.message}`;
            if (error.stack) {
                logMessage += `\nStack: ${error.stack}`;
            }
        }

        return logMessage;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = Object.values(LogLevel);
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            error
        };

        const formattedMessage = this.formatLog(entry);

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(formattedMessage);
                break;
            case LogLevel.INFO:
                console.info(formattedMessage);
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage);
                break;
            case LogLevel.ERROR:
                console.error(formattedMessage);
                break;
        }

        // In production, you might want to send logs to a service like DataDog, New Relic, etc.
        if (!dev && level === LogLevel.ERROR) {
            // TODO: Implement production error reporting
            // this.sendToErrorReporting(entry);
        }
    }

    debug(message: string, context?: Record<string, any>) {
        this.log(LogLevel.DEBUG, message, context);
    }

    info(message: string, context?: Record<string, any>) {
        this.log(LogLevel.INFO, message, context);
    }

    warn(message: string, context?: Record<string, any>, error?: Error) {
        this.log(LogLevel.WARN, message, context, error);
    }

    error(message: string, context?: Record<string, any>, error?: Error) {
        this.log(LogLevel.ERROR, message, context, error);
    }
}

export const logger = Logger.getInstance(); 