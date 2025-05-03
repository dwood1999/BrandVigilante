import { pool } from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { logger } from '$lib/logger';

interface KeywordRow extends RowDataPacket {
    id: number;
    keyword_text: string | null;
    brand_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface Keyword {
    id: number;
    keywordText: string | null;
    brandId: number | null;
    createdAt: string;
    updatedAt: string;
}

function convertRowToKeyword(row: KeywordRow): Keyword {
    return {
        id: row.id,
        keywordText: row.keyword_text,
        brandId: row.brand_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export class KeywordModel {
    static async findById(id: number): Promise<Keyword | null> {
        try {
            const [rows] = await pool.query<KeywordRow[]>(
                'SELECT * FROM keywords WHERE id = ?',
                [id]
            );
            return rows.length ? convertRowToKeyword(rows[0]) : null;
        } catch (error) {
            logger.error('Error in KeywordModel.findById:', error);
            throw error;
        }
    }

    static async findByBrandId(brandId: number): Promise<Keyword[]> {
        try {
            const [rows] = await pool.query<KeywordRow[]>(
                'SELECT * FROM keywords WHERE brand_id = ?',
                [brandId]
            );
            return rows.map(convertRowToKeyword);
        } catch (error) {
            logger.error('Error in KeywordModel.findByBrandId:', error);
            throw error;
        }
    }

    static async create(data: {
        keywordText?: string;
        brandId?: number;
    }): Promise<Keyword> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO keywords (keyword_text, brand_id) VALUES (?, ?)',
                [data.keywordText || null, data.brandId || null]
            );

            const [rows] = await pool.query<KeywordRow[]>(
                'SELECT * FROM keywords WHERE id = ?',
                [result.insertId]
            );

            if (!rows.length) {
                throw new Error('Failed to create keyword');
            }

            return convertRowToKeyword(rows[0]);
        } catch (error) {
            logger.error('Error in KeywordModel.create:', error);
            throw error;
        }
    }

    static async update(id: number, data: {
        keywordText?: string;
        brandId?: number;
    }): Promise<Keyword | null> {
        try {
            const updates: string[] = [];
            const values: (string | number)[] = [];

            if (data.keywordText !== undefined) {
                updates.push('keyword_text = ?');
                values.push(data.keywordText);
            }
            if (data.brandId !== undefined) {
                updates.push('brand_id = ?');
                values.push(data.brandId);
            }

            if (updates.length === 0) {
                return this.findById(id);
            }

            values.push(id);

            await pool.query(
                `UPDATE keywords SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return this.findById(id);
        } catch (error) {
            logger.error('Error in KeywordModel.update:', error);
            throw error;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'DELETE FROM keywords WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            logger.error('Error in KeywordModel.delete:', error);
            throw error;
        }
    }
} 