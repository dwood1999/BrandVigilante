import { dev } from '$app/environment';

type LogLevel = 'info' | 'warn' | 'error';

class Logger {
    private log(level: LogLevel, message: string, ...args: any[]) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}`;

        if (dev) {
            switch (level) {
                case 'info':
                    console.log(logMessage, ...args);
                    break;
                case 'warn':
                    console.warn(logMessage, ...args);
                    break;
                case 'error':
                    console.error(logMessage, ...args);
                    break;
            }
        } else {
            // In production, you might want to send logs to a service
            // For now, we'll just use console.log
            console.log(logMessage, ...args);
        }
    }

    info(message: string, ...args: any[]) {
        this.log('info', message, ...args);
    }

    warn(message: string, ...args: any[]) {
        this.log('warn', message, ...args);
    }

    error(message: string, ...args: any[]) {
        this.log('error', message, ...args);
    }
}

export const logger = new Logger(); 