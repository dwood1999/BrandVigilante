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
}

interface BrandMarketplaceRow extends RowDataPacket {
    id: number;
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

export class BrandModel {
    static async findAll(): Promise<Brand[]> {
        const [rows] = await pool.query<BrandRow[]>(
            'SELECT * FROM brands ORDER BY name'
        );
        return rows.map((row: BrandRow): Brand => ({
            ...row,
            marketplaces: [],
            trademark_terms: []
        }));
    }

    static async findById(id: number): Promise<Brand | null> {
        const [rows] = await pool.query<BrandRow[]>(
            'SELECT * FROM brands WHERE id = ?',
            [id]
        );
        if (rows.length === 0) return null;

        const brand: Brand = {
            ...rows[0],
            marketplaces: [],
            trademark_terms: []
        };

        // Get trademark terms
        const [terms] = await pool.query<BrandTermRow[]>(
            'SELECT id, brand_id, term, created_at FROM brand_tmterms WHERE brand_id = ? ORDER BY term',
            [id]
        );

        // Get marketplaces
        const marketplaces = await this.getMarketplaces(id);
        brand.marketplaces = marketplaces;
        brand.trademark_terms = terms;

        return brand;
    }

    static async findByUserId(userId: number): Promise<Brand[]> {
        try {
            const [brands] = await pool.query<BrandRow[]>(
                `SELECT b.* 
                 FROM brands b 
                 JOIN brands_user bu ON b.id = bu.brand_id 
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

    static async create(data: CreateBrandData): Promise<Brand> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO brands (name, display_name, url, description, status) VALUES (?, ?, ?, ?, ?)',
            [data.name, data.display_name, data.url || null, data.description || null, data.status || 'active']
        );
        const brand = await this.findById(result.insertId);
        if (!brand) throw new Error('Failed to create brand');
        return brand;
    }

    static async update(id: number, data: UpdateBrandData): Promise<Brand | null> {
        const updates: string[] = [];
        const values: (string | null | number)[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.display_name !== undefined) {
            updates.push('display_name = ?');
            values.push(data.display_name);
        }
        if (data.url !== undefined) {
            updates.push('url = ?');
            values.push(data.url);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            values.push(data.status);
        }

        if (updates.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE brands SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    static async delete(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'DELETE FROM brands WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
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

    static async addMarketplace(brandId: number, marketplaceId: number): Promise<void> {
        await pool.query(
            'INSERT INTO brand_marketplaces (brand_id, marketplace_id) VALUES (?, ?)',
            [brandId, marketplaceId]
        );
    }

    static async removeMarketplace(brandId: number, marketplaceId: number): Promise<void> {
        await pool.query(
            'DELETE FROM brand_marketplaces WHERE brand_id = ? AND marketplace_id = ?',
            [brandId, marketplaceId]
        );
    }

    static async getMarketplaces(brandId: number): Promise<BrandMarketplace[]> {
        const [rows] = await pool.query<BrandMarketplaceRow[]>(
            `SELECT m.id as marketplace_id, m.name, m.url
             FROM marketplaces m
             JOIN brand_marketplaces bm ON m.id = bm.marketplace_id
             WHERE bm.brand_id = ?
             ORDER BY m.name`,
            [brandId]
        );
        return rows.map((row: BrandMarketplaceRow): BrandMarketplace => ({
            marketplace_id: row.id,
            name: row.name,
            url: row.url
        }));
    }
} 