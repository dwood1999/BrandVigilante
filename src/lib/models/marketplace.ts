import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

export interface MarketplaceRow extends RowDataPacket {
    marketplace_id: number;
    name: string;
    url: string;
    status: 'active' | 'inactive';
}

export interface BrandMarketplaceRow extends RowDataPacket {
    marketplace_id: number;
    name: string;
    url: string;
    status: 'active' | 'inactive';
    created_at: Date;
    updated_at: Date | null;
    notes: string | null;
}

export interface Marketplace extends MarketplaceRow {
    brands?: {
        brand_id: number;
        name: string;
    }[];
}

export interface CreateMarketplaceData {
    name: string;
    url: string;
}

export interface UpdateMarketplaceData {
    name: string;
    url: string;
}

export class MarketplaceModel {
    static async count(): Promise<number> {
        try {
            const [result] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM marketplaces'
            );
            return parseInt(result[0].count);
        } catch (error) {
            logger.error('Error in MarketplaceModel.count:', error);
            throw error;
        }
    }

    static async findAll(): Promise<MarketplaceRow[]> {
        try {
            const [marketplaces] = await pool.query<MarketplaceRow[]>(
                'SELECT * FROM marketplaces ORDER BY name'
            );
            return marketplaces;
        } catch (error) {
            logger.error('Error in MarketplaceModel.findAll:', error);
            throw error;
        }
    }

    static async findById(marketplaceId: number): Promise<Marketplace | null> {
        try {
            // Get marketplace details
            const [marketplaces] = await pool.query<MarketplaceRow[]>(
                'SELECT * FROM marketplaces WHERE marketplace_id = ?',
                [marketplaceId]
            );

            if (marketplaces.length === 0) {
                return null;
            }

            const marketplace = marketplaces[0];

            // Get associated brands
            const [brands] = await pool.query<RowDataPacket[]>(
                `SELECT b.brand_id, b.name 
                 FROM brands b 
                 JOIN brand_marketplaces bm ON b.brand_id = bm.brand_id 
                 WHERE bm.marketplace_id = ? 
                 ORDER BY b.name`,
                [marketplaceId]
            );

            return {
                ...marketplace,
                brands
            };
        } catch (error) {
            logger.error('Error in MarketplaceModel.findById:', error);
            throw error;
        }
    }

    static async findByBrandId(brandId: number): Promise<BrandMarketplaceRow[]> {
        try {
            const [marketplaces] = await pool.query<BrandMarketplaceRow[]>(
                `SELECT m.*, bm.created_at, bm.status
                 FROM marketplaces m
                 JOIN brand_marketplaces bm ON m.marketplace_id = bm.marketplace_id
                 WHERE bm.brand_id = ?
                 ORDER BY m.name`,
                [brandId]
            );
            return marketplaces;
        } catch (error) {
            logger.error('Error in MarketplaceModel.findByBrandId:', error);
            throw error;
        }
    }

    static async create(data: CreateMarketplaceData): Promise<number> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO marketplaces (name, url) VALUES (?, ?)',
                [data.name, data.url]
            );
            return result.insertId;
        } catch (error) {
            logger.error('Error in MarketplaceModel.create:', error);
            throw error;
        }
    }

    static async update(marketplaceId: number, data: UpdateMarketplaceData): Promise<void> {
        try {
            await pool.query(
                'UPDATE marketplaces SET name = ?, url = ? WHERE marketplace_id = ?',
                [data.name, data.url, marketplaceId]
            );
        } catch (error) {
            logger.error('Error in MarketplaceModel.update:', error);
            throw error;
        }
    }

    static async delete(marketplaceId: number): Promise<void> {
        try {
            await pool.query('DELETE FROM marketplaces WHERE marketplace_id = ?', [marketplaceId]);
        } catch (error) {
            logger.error('Error in MarketplaceModel.delete:', error);
            throw error;
        }
    }

    static async addToBrand(brandId: number, marketplaceId: number): Promise<void> {
        try {
            await pool.query(
                'INSERT INTO brand_marketplaces (brand_id, marketplace_id) VALUES (?, ?)',
                [brandId, marketplaceId]
            );
        } catch (error) {
            logger.error('Error in MarketplaceModel.addToBrand:', error);
            throw error;
        }
    }

    static async removeFromBrand(brandId: number, marketplaceId: number): Promise<void> {
        try {
            await pool.query(
                'DELETE FROM brand_marketplaces WHERE brand_id = ? AND marketplace_id = ?',
                [brandId, marketplaceId]
            );
        } catch (error) {
            logger.error('Error in MarketplaceModel.removeFromBrand:', error);
            throw error;
        }
    }
} 