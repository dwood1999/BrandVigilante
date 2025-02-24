import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

interface TrademarkTermRow extends RowDataPacket {
    term_id: number;
    brand_id: number;
    term: string;
}

export class TrademarkTermModel {
    static async count(): Promise<number> {
        try {
            const [result] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM trademarked_terms'
            );
            return result[0].count;
        } catch (error) {
            logger.error('Error in TrademarkTermModel.count:', error);
            throw error;
        }
    }
} 