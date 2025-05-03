import { pool } from './db';
import type { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Custom error classes for better error handling
export class DatabaseError extends Error {
    constructor(
        message: string,
        public code?: string,
        public sqlState?: string,
        public sqlMessage?: string
    ) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class ConnectionError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = 'ConnectionError';
    }
}

export class QueryError extends DatabaseError {
    constructor(message: string, code?: string, sqlState?: string, sqlMessage?: string) {
        super(message, code, sqlState, sqlMessage);
        this.name = 'QueryError';
    }
}

// Transaction helper
export async function withTransaction<T>(
    callback: (connection: PoolConnection) => Promise<T>
): Promise<T> {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Query helper with proper error handling
export async function executeQuery<T extends RowDataPacket[] | ResultSetHeader>(
    query: string,
    params?: (string | number | boolean | null)[]
): Promise<T> {
    try {
        const [results] = await pool.execute(query, params);
        return results as T;
    } catch (error) {
        if (error instanceof Error) {
            throw new QueryError(
                `Query execution failed: ${error.message}`,
                (error as any).code,
                (error as any).sqlState,
                (error as any).sqlMessage
            );
        }
        throw new QueryError('Unknown query error occurred');
    }
}

// Connection pool health check
export async function checkPoolHealth(): Promise<{
    healthy: boolean;
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
}> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SHOW STATUS LIKE "Threads_%"');
        const status = rows.reduce((acc, row) => {
            acc[row.Variable_name] = parseInt(row.Value);
            return acc;
        }, {} as Record<string, number>);

        return {
            healthy: true,
            totalConnections: status['Threads_connected'] || 0,
            activeConnections: status['Threads_running'] || 0,
            idleConnections: (status['Threads_connected'] || 0) - (status['Threads_running'] || 0)
        };
    } catch (error) {
        throw new ConnectionError('Failed to check pool health');
    }
}

// Query timeout helper
export async function executeQueryWithTimeout<T extends RowDataPacket[] | ResultSetHeader>(
    query: string,
    params: (string | number | boolean | null)[],
    timeoutMs: number = 5000
): Promise<T> {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new QueryError('Query execution timed out'));
        }, timeoutMs);
    });

    try {
        const result = await Promise.race([
            executeQuery<T>(query, params),
            timeoutPromise
        ]);
        return result as T;
    } catch (error) {
        if (error instanceof QueryError) {
            throw error;
        }
        throw new QueryError('Query execution failed');
    }
} 