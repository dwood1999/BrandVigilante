import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

interface BrandRow extends RowDataPacket {
    brand_id: number;
    name: string;
    url: string;
    description: string;
}

interface TrademarkTermRow extends RowDataPacket {
    id: number;
    term: string;
}

interface UserRow extends RowDataPacket {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

interface MarketplaceRow extends RowDataPacket {
    id: number;
    name: string;
    url: string;
}

export interface Brand extends BrandRow {
    trademarked_terms?: TrademarkTermRow[];
    users?: UserRow[];
    marketplaces?: MarketplaceRow[];
}

export interface CreateBrandData {
    name: string;
    url?: string;
    description?: string;
}

export interface UpdateBrandData {
    name: string;
    url?: string;
    description?: string;
}

type Include = ('trademarked_terms' | 'users' | 'marketplaces')[];

export class BrandModel {
    static async findAll({ include = [] as Include } = {}): Promise<Brand[]> {
        try {
            const [brands] = await pool.query<BrandRow[]>('SELECT * FROM brands');

            for (const brand of brands) {
                if (include.includes('trademarked_terms')) {
                    const [terms] = await pool.query<TrademarkTermRow[]>(
                        'SELECT * FROM trademarked_terms WHERE brand_id = ?',
                        [brand.brand_id]
                    );
                    brand.trademarked_terms = terms;
                }

                if (include.includes('users')) {
                    const [users] = await pool.query<UserRow[]>(
                        `SELECT u.id, u.email, u.first_name, u.last_name 
                         FROM users u 
                         JOIN brands_user bu ON u.id = bu.user_id 
                         WHERE bu.brand_id = ?`,
                        [brand.brand_id]
                    );
                    brand.users = users;
                }

                if (include.includes('marketplaces')) {
                    const [marketplaces] = await pool.query<MarketplaceRow[]>(
                        `SELECT m.* 
                         FROM marketplaces m 
                         JOIN brand_marketplaces bm ON m.marketplace_id = bm.marketplace_id 
                         WHERE bm.brand_id = ?`,
                        [brand.brand_id]
                    );
                    brand.marketplaces = marketplaces;
                }
            }

            return brands as Brand[];
        } catch (error) {
            logger.error('Error in BrandModel.findAll:', error);
            throw error;
        }
    }

    static async delete(brandId: number): Promise<void> {
        try {
            await pool.query<ResultSetHeader>(
                'DELETE FROM brands WHERE brand_id = ?', 
                [brandId]
            );
        } catch (error) {
            logger.error('Error in BrandModel.delete:', error);
            throw error;
        }
    }

    static async count(): Promise<number> {
        try {
            const [result] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM brands');
            return result[0].count;
        } catch (error) {
            logger.error('Error in BrandModel.count:', error);
            throw error;
        }
    }

    static async create(data: CreateBrandData): Promise<number> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO brands (name, url, description) VALUES (?, ?, ?)',
                [data.name, data.url || null, data.description || null]
            );
            return result.insertId;
        } catch (error) {
            logger.error('Error in BrandModel.create:', error);
            throw error;
        }
    }

    static async findById(brandId: number): Promise<Brand | null> {
        try {
            const [brands] = await pool.query<BrandRow[]>(
                'SELECT * FROM brands WHERE brand_id = ?',
                [brandId]
            );
            return brands[0] || null;
        } catch (error) {
            logger.error('Error in BrandModel.findById:', error);
            throw error;
        }
    }

    static async update(brandId: number, data: UpdateBrandData): Promise<void> {
        try {
            await pool.query<ResultSetHeader>(
                'UPDATE brands SET name = ?, url = ?, description = ? WHERE brand_id = ?',
                [data.name, data.url || null, data.description || null, brandId]
            );
        } catch (error) {
            logger.error('Error in BrandModel.update:', error);
            throw error;
        }
    }
} 