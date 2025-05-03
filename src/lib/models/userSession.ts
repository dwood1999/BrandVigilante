import { executeQuery } from '$lib/db-utils';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { logger } from '$lib/logger';

interface UserSessionRow extends RowDataPacket {
    id: string;
    user_id: number;
    active_expires: number;
    idle_expires: number;
    created_at: string;
}

export interface UserSession {
    id: string;
    userId: number;
    activeExpires: number;
    idleExpires: number;
    createdAt: string;
}

function convertRowToUserSession(row: UserSessionRow): UserSession {
    return {
        id: row.id,
        userId: row.user_id,
        activeExpires: row.active_expires,
        idleExpires: row.idle_expires,
        createdAt: row.created_at
    };
}

export class UserSessionModel {
    static async findById(id: string): Promise<UserSession | null> {
        try {
            const rows = await executeQuery<UserSessionRow[]>(
                'SELECT * FROM user_session WHERE id = ?',
                [id]
            );
            return rows.length ? convertRowToUserSession(rows[0]) : null;
        } catch (error) {
            logger.error('Error in UserSessionModel.findById', { id }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async findByUserId(userId: number): Promise<UserSession[]> {
        try {
            const rows = await executeQuery<UserSessionRow[]>(
                'SELECT * FROM user_session WHERE user_id = ?',
                [userId]
            );
            return rows.map(convertRowToUserSession);
        } catch (error) {
            logger.error('Error in UserSessionModel.findByUserId', { userId }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async create(data: {
        id: string;
        userId: number;
        activeExpires: number;
        idleExpires: number;
    }): Promise<UserSession> {
        try {
            const result = await executeQuery<ResultSetHeader>(
                'INSERT INTO user_session (id, user_id, active_expires, idle_expires) VALUES (?, ?, ?, ?)',
                [data.id, data.userId, data.activeExpires, data.idleExpires]
            );

            const rows = await executeQuery<UserSessionRow[]>(
                'SELECT * FROM user_session WHERE id = ?',
                [data.id]
            );

            if (!rows.length) {
                throw new Error('Failed to create user session');
            }

            return convertRowToUserSession(rows[0]);
        } catch (error) {
            logger.error('Error in UserSessionModel.create', { data }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async delete(id: string): Promise<boolean> {
        try {
            const result = await executeQuery<ResultSetHeader>(
                'DELETE FROM user_session WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            logger.error('Error in UserSessionModel.delete', { id }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async deleteExpired(): Promise<number> {
        const timestamp = Date.now();
        try {
            const result = await executeQuery<ResultSetHeader>(
                'DELETE FROM user_session WHERE active_expires < ?',
                [timestamp]
            );
            return result.affectedRows;
        } catch (error) {
            logger.error('Error in UserSessionModel.deleteExpired', { timestamp }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
} 