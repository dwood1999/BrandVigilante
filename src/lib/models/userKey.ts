import { executeQuery } from '$lib/db-utils';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { logger } from '$lib/logger';

interface UserKeyRow extends RowDataPacket {
    id: string;
    user_id: number;
    hashed_password: string;
    created_at: string;
}

export interface UserKey {
    id: string;
    userId: number;
    hashedPassword: string;
    createdAt: string;
}

function convertRowToUserKey(row: UserKeyRow): UserKey {
    return {
        id: row.id,
        userId: row.user_id,
        hashedPassword: row.hashed_password,
        createdAt: row.created_at
    };
}

export class UserKeyModel {
    static async findById(id: string): Promise<UserKey | null> {
        try {
            const rows = await executeQuery<UserKeyRow[]>(
                'SELECT * FROM user_key WHERE id = ?',
                [id]
            );
            return rows.length ? convertRowToUserKey(rows[0]) : null;
        } catch (error) {
            logger.error('Error in UserKeyModel.findById', { id }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async findByUserId(userId: number): Promise<UserKey | null> {
        try {
            const rows = await executeQuery<UserKeyRow[]>(
                'SELECT * FROM user_key WHERE user_id = ?',
                [userId]
            );
            return rows.length ? convertRowToUserKey(rows[0]) : null;
        } catch (error) {
            logger.error('Error in UserKeyModel.findByUserId', { userId }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async create(data: {
        id: string;
        userId: number;
        hashedPassword: string;
    }): Promise<UserKey> {
        try {
            const result = await executeQuery<ResultSetHeader>(
                'INSERT INTO user_key (id, user_id, hashed_password) VALUES (?, ?, ?)',
                [data.id, data.userId, data.hashedPassword]
            );

            const rows = await executeQuery<UserKeyRow[]>(
                'SELECT * FROM user_key WHERE id = ?',
                [data.id]
            );

            if (!rows.length) {
                throw new Error('Failed to create user key');
            }

            return convertRowToUserKey(rows[0]);
        } catch (error) {
            logger.error('Error in UserKeyModel.create', { data }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async delete(id: string): Promise<boolean> {
        try {
            const result = await executeQuery<ResultSetHeader>(
                'DELETE FROM user_key WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            logger.error('Error in UserKeyModel.delete', { id }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
} 