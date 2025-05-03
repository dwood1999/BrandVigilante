import { pool } from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { logger } from '$lib/logger';

interface ActivityLogRow extends RowDataPacket {
    id: number;
    entity_type: 'brand' | 'term' | 'user' | 'marketplace' | 'alert';
    entity_id: number;
    action: string;
    details: string | null;
    user_id: number | null;
    created_at: string;
}

export interface ActivityLog {
    id: number;
    entityType: 'brand' | 'term' | 'user' | 'marketplace' | 'alert';
    entityId: number;
    action: string;
    details: string | null;
    userId: number | null;
    createdAt: string;
}

function convertRowToActivityLog(row: ActivityLogRow): ActivityLog {
    return {
        id: row.id,
        entityType: row.entity_type,
        entityId: row.entity_id,
        action: row.action,
        details: row.details,
        userId: row.user_id,
        createdAt: row.created_at
    };
}

export class ActivityLogModel {
    static async create(data: {
        entityType: 'brand' | 'term' | 'user' | 'marketplace' | 'alert';
        entityId: number;
        action: string;
        details?: string;
        userId?: number;
    }): Promise<ActivityLog> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO activity_logs (entity_type, entity_id, action, details, user_id) VALUES (?, ?, ?, ?, ?)',
                [data.entityType, data.entityId, data.action, data.details || null, data.userId || null]
            );

            const [rows] = await pool.query<ActivityLogRow[]>(
                'SELECT * FROM activity_logs WHERE id = ?',
                [result.insertId]
            );

            if (!rows.length) {
                throw new Error('Failed to create activity log');
            }

            return convertRowToActivityLog(rows[0]);
        } catch (error) {
            logger.error('Error in ActivityLogModel.create:', error);
            throw error;
        }
    }

    static async findByEntity(entityType: 'brand' | 'term' | 'user' | 'marketplace' | 'alert', entityId: number): Promise<ActivityLog[]> {
        try {
            const [rows] = await pool.query<ActivityLogRow[]>(
                'SELECT * FROM activity_logs WHERE entity_type = ? AND entity_id = ? ORDER BY created_at DESC',
                [entityType, entityId]
            );
            return rows.map(convertRowToActivityLog);
        } catch (error) {
            logger.error('Error in ActivityLogModel.findByEntity:', error);
            throw error;
        }
    }

    static async findByUserId(userId: number): Promise<ActivityLog[]> {
        try {
            const [rows] = await pool.query<ActivityLogRow[]>(
                'SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC',
                [userId]
            );
            return rows.map(convertRowToActivityLog);
        } catch (error) {
            logger.error('Error in ActivityLogModel.findByUserId:', error);
            throw error;
        }
    }

    static async findRecent(limit: number = 50): Promise<ActivityLog[]> {
        try {
            const [rows] = await pool.query<ActivityLogRow[]>(
                'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?',
                [limit]
            );
            return rows.map(convertRowToActivityLog);
        } catch (error) {
            logger.error('Error in ActivityLogModel.findRecent:', error);
            throw error;
        }
    }
} 