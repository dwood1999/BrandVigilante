import mysql from 'mysql2/promise';
import { dev } from '$app/environment';
import type { Pool, PoolConnection } from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import { logger } from '$lib/logger';

// Define MySQL error interface
interface MySQLError extends Error {
    code?: string;
    errno?: number;
    sqlState?: string;
    sqlMessage?: string;
}

// Define the pool configuration interface
interface DbConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
    enableKeepAlive: boolean;
    keepAliveInitialDelay: number;
}

const getDbConfig = (): DbConfig => {
    // Get environment variables with fallbacks
    const host = env.DB_HOST || env.DATABASE_HOST || 'localhost';
    const user = env.DB_USER || env.DATABASE_USER || 'dwood';
    const password = env.DB_PASSWORD || env.DATABASE_PASSWORD || '';
    const database = env.DB_NAME || env.DATABASE_NAME || 'dwood_db';
    const connectionLimit = parseInt(env.DB_CONNECTION_LIMIT || '10');

    if (!password) {
        throw new Error('Database password is required');
    }

    const config: DbConfig = {
        host,
        user,
        password,
        database,
        connectionLimit,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };

    logger.info('[DB] Initializing connection pool:', {
        host: config.host,
        user: config.user,
        database: config.database,
        connectionLimit: config.connectionLimit,
        timestamp: new Date().toISOString()
    });

    return config;
};

// Create the connection pool
const pool = mysql.createPool(getDbConfig());

// Handle pool events
pool.on('connection', (connection: PoolConnection) => {
    logger.debug('[DB DEBUG] New connection established', {
        threadId: connection.threadId,
        timestamp: new Date().toISOString()
    });
});

pool.on('acquire', (connection: PoolConnection) => {
    logger.debug('[DB DEBUG] Connection acquired', {
        threadId: connection.threadId,
        timestamp: new Date().toISOString()
    });
});

pool.on('release', (connection: PoolConnection) => {
    logger.debug('[DB DEBUG] Connection released', {
        threadId: connection.threadId,
        timestamp: new Date().toISOString()
    });
});

// Add connection testing with detailed logging
export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        logger.info('[DB] Connection test successful');
        return true;
    } catch (error) {
        logger.error('[DB] Connection test failed:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
        return false;
    }
};

export { pool };
