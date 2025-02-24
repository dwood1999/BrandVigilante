import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

interface BrandRow extends RowDataPacket {
    brand_id: number;
    name: string;
    url: string;
    description: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface TrademarkTermRow extends RowDataPacket {
    term_id: number;
    term: string;
}

interface BrandMarketplaceRow extends RowDataPacket {
    marketplace_id: number;
    name: string;
    url: string;
}

export interface Brand extends BrandRow {
    trademark_terms?: {
        term_id: number;
        term: string;
    }[];
    marketplaces?: {
        marketplace_id: number;
        name: string;
        url: string;
    }[];
}

export interface CreateBrandData {
    name: string;
}

export interface UpdateBrandData {
    name: string;
}

export class BrandModel {
    static async findAll(): Promise<Brand[]> {
        try {
            const [brands] = await pool.query<BrandRow[]>(
                'SELECT * FROM brands ORDER BY name'
            );
            return brands;
        } catch (error) {
            logger.error('Error in BrandModel.findAll:', error);
            throw error;
        }
    }

    static async findById(brandId: number): Promise<Brand | null> {
        try {
            // Get brand details
            const [brands] = await pool.query<BrandRow[]>(
                'SELECT * FROM brands WHERE brand_id = ?',
                [brandId]
            );

            if (brands.length === 0) {
                return null;
            }

            const brand = brands[0];

            // Get trademark terms
            const [terms] = await pool.query<TrademarkTermRow[]>(
                'SELECT term_id, term FROM brand_tmterms WHERE brand_id = ? ORDER BY term',
                [brandId]
            );

            // Get marketplaces
            const [marketplaces] = await pool.query<BrandMarketplaceRow[]>(
                `SELECT m.marketplace_id, m.name, m.url 
                 FROM marketplaces m 
                 JOIN brand_marketplaces bm ON m.marketplace_id = bm.marketplace_id 
                 WHERE bm.brand_id = ? 
                 ORDER BY m.name`,
                [brandId]
            );

            return {
                ...brand,
                trademark_terms: terms,
                marketplaces: marketplaces
            };
        } catch (error) {
            logger.error('Error in BrandModel.findById:', error);
            throw error;
        }
    }

    static async findByUserId(userId: number): Promise<Brand[]> {
        try {
            const [brands] = await pool.query<BrandRow[]>(
                `SELECT b.* 
                 FROM brands b 
                 JOIN brands_user bu ON b.brand_id = bu.brand_id 
                 WHERE bu.user_id = ? 
                 ORDER BY b.name`,
                [userId]
            );
            return brands;
        } catch (error) {
            logger.error('Error in BrandModel.findByUserId:', error);
            throw error;
        }
    }

    static async create(data: CreateBrandData): Promise<number> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO brands (name) VALUES (?)',
                [data.name]
            );
            return result.insertId;
        } catch (error) {
            logger.error('Error in BrandModel.create:', error);
            throw error;
        }
    }

    static async update(brandId: number, data: UpdateBrandData): Promise<void> {
        try {
            await pool.query(
                'UPDATE brands SET name = ? WHERE brand_id = ?',
                [data.name, brandId]
            );
        } catch (error) {
            logger.error('Error in BrandModel.update:', error);
            throw error;
        }
    }

    static async delete(brandId: number): Promise<void> {
        try {
            await pool.query('DELETE FROM brands WHERE brand_id = ?', [brandId]);
        } catch (error) {
            logger.error('Error in BrandModel.delete:', error);
            throw error;
        }
    }

    static async addUser(brandId: number, userId: number): Promise<void> {
        try {
            await pool.query(
                'INSERT INTO brands_user (brand_id, user_id) VALUES (?, ?)',
                [brandId, userId]
            );
        } catch (error) {
            logger.error('Error in BrandModel.addUser:', error);
            throw error;
        }
    }

    static async removeUser(brandId: number, userId: number): Promise<void> {
        try {
            await pool.query(
                'DELETE FROM brands_user WHERE brand_id = ? AND user_id = ?',
                [brandId, userId]
            );
        } catch (error) {
            logger.error('Error in BrandModel.removeUser:', error);
            throw error;
        }
    }

    static async count(): Promise<number> {
        try {
            const [result] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM brands WHERE status = "active"'
            );
            return parseInt(result[0].count);
        } catch (error) {
            logger.error('Error in BrandModel.count:', error);
            throw error;
        }
    }
} 