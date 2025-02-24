import mysql from 'mysql2/promise';
import { dev } from '$app/environment';
import type { Pool, PoolConnection } from 'mysql2/promise';

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
    const config: DbConfig = {
        host: process.env.DATABASE_HOST ?? 'localhost',
        user: process.env.DATABASE_USER ?? '',
        password: process.env.DATABASE_PASSWORD ?? '',
        database: process.env.DATABASE_NAME ?? '',
        connectionLimit: dev ? 1 : 10,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };

    console.log('[DB] Initializing connection pool:', {
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
    console.log('[DB DEBUG] New connection established', {
        threadId: connection.threadId,
        timestamp: new Date().toISOString()
    });
});

pool.on('acquire', (connection: PoolConnection) => {
    console.log('[DB DEBUG] Connection acquired', {
        threadId: connection.threadId,
        timestamp: new Date().toISOString()
    });
});

pool.on('release', (connection: PoolConnection) => {
    console.log('[DB DEBUG] Connection released', {
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
        console.log('[DB] Connection test successful');
        return true;
    } catch (error) {
        console.error('[DB] Connection test failed:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        });
        return false;
    }
};

export { pool };
