import { pool } from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { logger } from '$lib/logger';

interface BrandRow extends RowDataPacket {
    id: number;
    name: string;
    display_name: string;
    url: string | null;
    description: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string | null;
    trademark_term_ids: string | null;
    trademark_terms: string | null;
}

interface BrandMarketplaceRow extends RowDataPacket {
    marketplace_id: number;
    name: string;
    url: string;
}

interface BrandTermRow extends RowDataPacket {
    id: number;
    brand_id: number | null;
    term: string;
    created_at: string;
}

export interface BrandMarketplace {
    marketplace_id: number;
    name: string;
    url: string;
}

export interface BrandTerm {
    id: number;
    brand_id: number | null;
    term: string;
    created_at: string;
}

export interface Brand {
    id: number;
    name: string;
    display_name: string;
    url: string | null;
    description: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string | null;
    marketplaces: BrandMarketplace[];
    trademark_terms: BrandTerm[];
}

export interface CreateBrandData {
    name: string;
    display_name: string;
    url?: string | null;
    description?: string | null;
    status?: 'active' | 'inactive';
}

export interface UpdateBrandData {
    name?: string;
    display_name?: string;
    url?: string | null;
    description?: string | null;
    status?: 'active' | 'inactive';
}

function convertRowToBrand(row: BrandRow): Brand {
    const trademark_terms = row.trademark_term_ids && row.trademark_terms
        ? row.trademark_term_ids.split(',').map((id: string, index: number) => {
            const terms = row.trademark_terms?.split(',') || [];
            return {
                id: parseInt(id),
                brand_id: row.id,
                term: terms[index] || '',
                created_at: new Date().toISOString()
            };
        })
        : [];

    return {
        ...row,
        marketplaces: [],
        trademark_terms
    };
}

export class BrandModel {
    static async findAll(): Promise<Brand[]> {
        const [rows] = await pool.query<BrandRow[]>(
            `SELECT b.*, 
                    GROUP_CONCAT(DISTINCT bt.id) as trademark_term_ids,
                    GROUP_CONCAT(DISTINCT bt.term) as trademark_terms
             FROM brands b
             LEFT JOIN brand_tmterms bt ON b.id = bt.brand_id
             GROUP BY b.id`
        );
        return rows.map(convertRowToBrand);
    }

    static async findById(id: number): Promise<Brand | null> {
        const [rows] = await pool.query<BrandRow[]>(
            `SELECT b.*, 
                    GROUP_CONCAT(DISTINCT bt.id) as trademark_term_ids,
                    GROUP_CONCAT(DISTINCT bt.term) as trademark_terms
             FROM brands b
             LEFT JOIN brand_tmterms bt ON b.id = bt.brand_id
             WHERE b.id = ?`,
            [id] as [number]
        );
        return rows.length ? convertRowToBrand(rows[0]) : null;
    }

    static async findByUserId(userId: number): Promise<Brand[]> {
        try {
            const [brands] = await pool.query<BrandRow[]>(
                `SELECT b.*, 
                        GROUP_CONCAT(DISTINCT bt.id) as trademark_term_ids,
                        GROUP_CONCAT(DISTINCT bt.term) as trademark_terms
                 FROM brands b 
                 JOIN brands_user bu ON b.id = bu.brand_id 
                 LEFT JOIN brand_tmterms bt ON b.id = bt.brand_id
                 WHERE bu.user_id = ? 
                 GROUP BY b.id
                 ORDER BY b.name`,
                [userId] as [number]
            );
            
            return brands.map(convertRowToBrand);
        } catch (error) {
            logger.error('Error in BrandModel.findByUserId:', error);
            throw error;
        }
    }

    static async create(data: CreateBrandData): Promise<Brand> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO brands (name, display_name, url, description, status) VALUES (?, ?, ?, ?, ?)',
            [data.name, data.display_name, data.url, data.description, data.status || 'active'] as [string, string, string | null, string | null, string]
        );
        const brand = await this.findById(result.insertId);
        if (!brand) throw new Error('Failed to create brand');
        return brand;
    }

    static async update(id: number, data: UpdateBrandData): Promise<Brand | null> {
        await pool.query(
            'UPDATE brands SET name = ?, display_name = ?, url = ?, description = ?, status = ? WHERE id = ?',
            [data.name, data.display_name, data.url, data.description, data.status, id] as [string, string, string | null, string | null, string, number]
        );
        return this.findById(id);
    }

    static async delete(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM brands WHERE id = ?',
            [id] as [number]
        );
        return result.affectedRows > 0;
    }

    static async addUser(brandId: number, userId: number): Promise<void> {
        try {
            await pool.query(
                'INSERT INTO brands_user (brand_id, user_id) VALUES (?, ?)',
                [brandId, userId] as [number, number]
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
                [brandId, userId] as [number, number]
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

    static async addMarketplace(brandId: number, marketplaceId: number): Promise<void> {
        await pool.query(
            'INSERT INTO brand_marketplaces (brand_id, marketplace_id) VALUES (?, ?)',
            [brandId, marketplaceId] as [number, number]
        );
    }

    static async removeMarketplace(brandId: number, marketplaceId: number): Promise<void> {
        await pool.query(
            'DELETE FROM brand_marketplaces WHERE brand_id = ? AND marketplace_id = ?',
            [brandId, marketplaceId] as [number, number]
        );
    }

    static async getMarketplaces(brandId: number): Promise<BrandMarketplace[]> {
        const [rows] = await pool.query<BrandMarketplaceRow[]>(
            `SELECT m.id as marketplace_id, m.platform_name as name, m.base_url as url
             FROM marketplaces m
             JOIN brand_marketplaces bm ON m.id = bm.marketplace_id
             WHERE bm.brand_id = ?`,
            [brandId] as [number]
        );
        return rows;
    }
} 