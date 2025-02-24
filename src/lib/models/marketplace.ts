import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

interface MarketplaceRow extends RowDataPacket {
    marketplace_id: number;
    name: string;
    url: string;
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
            return result[0].count;
        } catch (error) {
            logger.error('Error in MarketplaceModel.count:', error);
            throw error;
        }
    }

    static async findAll(): Promise<Marketplace[]> {
        try {
            const [marketplaces] = await pool.query<MarketplaceRow[]>('SELECT * FROM marketplaces');

            // Get associated brands for each marketplace
            for (const marketplace of marketplaces) {
                const [brands] = await pool.query<RowDataPacket[]>(
                    `SELECT b.brand_id, b.name 
                     FROM brands b 
                     JOIN brand_marketplaces bm ON b.brand_id = bm.brand_id 
                     WHERE bm.marketplace_id = ?`,
                    [marketplace.marketplace_id]
                );
                marketplace.brands = brands;
            }

            return marketplaces;
        } catch (error) {
            logger.error('Error in MarketplaceModel.findAll:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<Marketplace | null> {
        try {
            const [marketplaces] = await pool.query<MarketplaceRow[]>(
                'SELECT * FROM marketplaces WHERE marketplace_id = ?',
                [id]
            );
            
            if (!marketplaces[0]) return null;

            const marketplace = marketplaces[0];

            // Get associated brands
            const [brands] = await pool.query<RowDataPacket[]>(
                `SELECT b.brand_id, b.name 
                 FROM brands b 
                 JOIN brand_marketplaces bm ON b.brand_id = bm.brand_id 
                 WHERE bm.marketplace_id = ?`,
                [marketplace.marketplace_id]
            );
            marketplace.brands = brands;

            return marketplace;
        } catch (error) {
            logger.error('Error in MarketplaceModel.findById:', error);
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

    static async update(id: number, data: UpdateMarketplaceData): Promise<void> {
        try {
            await pool.query<ResultSetHeader>(
                'UPDATE marketplaces SET name = ?, url = ? WHERE marketplace_id = ?',
                [data.name, data.url, id]
            );
        } catch (error) {
            logger.error('Error in MarketplaceModel.update:', error);
            throw error;
        }
    }

    static async delete(id: number): Promise<void> {
        try {
            await pool.query('DELETE FROM marketplaces WHERE marketplace_id = ?', [id]);
        } catch (error) {
            logger.error('Error in MarketplaceModel.delete:', error);
            throw error;
        }
    }
} 