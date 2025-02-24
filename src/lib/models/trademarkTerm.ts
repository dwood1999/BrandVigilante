import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

interface TrademarkTermRow extends RowDataPacket {
    term_id: number;
    brand_id: number;
    term: string;
    created_at: string;
    updated_at: string;
}

export interface TrademarkTerm extends TrademarkTermRow {
    brand_name?: string;
}

export interface CreateTrademarkTermData {
    brand_id: number;
    term: string;
}

export interface UpdateTrademarkTermData {
    brand_id: number;
    term: string;
}

export class TrademarkTermModel {
    static async findAll(): Promise<TrademarkTerm[]> {
        try {
            const [terms] = await pool.query<TrademarkTermRow[]>(
                `SELECT t.*, b.name as brand_name 
                 FROM brand_tmterms t 
                 JOIN brands b ON t.brand_id = b.brand_id 
                 ORDER BY b.name, t.term`
            );
            return terms;
        } catch (error) {
            logger.error('Error in TrademarkTermModel.findAll:', error);
            throw error;
        }
    }

    static async findById(termId: number): Promise<TrademarkTerm | null> {
        try {
            const [terms] = await pool.query<TrademarkTermRow[]>(
                `SELECT t.*, b.name as brand_name 
                 FROM brand_tmterms t 
                 JOIN brands b ON t.brand_id = b.brand_id 
                 WHERE t.term_id = ?`,
                [termId]
            );
            return terms[0] || null;
        } catch (error) {
            logger.error('Error in TrademarkTermModel.findById:', error);
            throw error;
        }
    }

    static async findByBrandId(brandId: number): Promise<TrademarkTerm[]> {
        try {
            const [terms] = await pool.query<TrademarkTermRow[]>(
                `SELECT t.*, b.name as brand_name 
                 FROM brand_tmterms t 
                 JOIN brands b ON t.brand_id = b.brand_id 
                 WHERE t.brand_id = ? 
                 ORDER BY t.term`,
                [brandId]
            );
            return terms;
        } catch (error) {
            logger.error('Error in TrademarkTermModel.findByBrandId:', error);
            throw error;
        }
    }

    static async create(data: CreateTrademarkTermData): Promise<number> {
        try {
            // Check for duplicate term
            const [existing] = await pool.query<TrademarkTermRow[]>(
                'SELECT term_id FROM brand_tmterms WHERE brand_id = ? AND term = ?',
                [data.brand_id, data.term]
            );

            if (existing.length > 0) {
                throw new Error('This term already exists for the selected brand');
            }

            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO brand_tmterms (brand_id, term) VALUES (?, ?)',
                [data.brand_id, data.term]
            );
            return result.insertId;
        } catch (error) {
            logger.error('Error in TrademarkTermModel.create:', error);
            throw error;
        }
    }

    static async update(termId: number, data: UpdateTrademarkTermData): Promise<void> {
        try {
            // Check for duplicate term (excluding current term)
            const [existing] = await pool.query<TrademarkTermRow[]>(
                'SELECT term_id FROM brand_tmterms WHERE brand_id = ? AND term = ? AND term_id != ?',
                [data.brand_id, data.term, termId]
            );

            if (existing.length > 0) {
                throw new Error('This term already exists for the selected brand');
            }

            await pool.query(
                'UPDATE brand_tmterms SET brand_id = ?, term = ? WHERE term_id = ?',
                [data.brand_id, data.term, termId]
            );
        } catch (error) {
            logger.error('Error in TrademarkTermModel.update:', error);
            throw error;
        }
    }

    static async delete(termId: number): Promise<void> {
        try {
            await pool.query('DELETE FROM brand_tmterms WHERE term_id = ?', [termId]);
        } catch (error) {
            logger.error('Error in TrademarkTermModel.delete:', error);
            throw error;
        }
    }

    static async exists(termId: number): Promise<boolean> {
        try {
            const [result] = await pool.query<TrademarkTermRow[]>(
                'SELECT term_id FROM brand_tmterms WHERE term_id = ?',
                [termId]
            );
            return result.length > 0;
        } catch (error) {
            logger.error('Error in TrademarkTermModel.exists:', error);
            throw error;
        }
    }

    static async count(): Promise<number> {
        try {
            const [result] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM brand_tmterms'
            );
            return parseInt(result[0].count);
        } catch (error) {
            logger.error('Error in TrademarkTermModel.count:', error);
            throw error;
        }
    }
} 