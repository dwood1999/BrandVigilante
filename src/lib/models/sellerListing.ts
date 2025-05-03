import { pool } from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { logger } from '$lib/logger';

interface SellerListingRow extends RowDataPacket {
    id: number;
    seller_id: number;
    listing_id: number;
    is_buybox_winner: boolean | null;
    keyword_id: number | null;
    created_at: string;
    updated_at: string;
}

export interface SellerListing {
    id: number;
    sellerId: number;
    listingId: number;
    isBuyboxWinner: boolean | null;
    keywordId: number | null;
    createdAt: string;
    updatedAt: string;
}

function convertRowToSellerListing(row: SellerListingRow): SellerListing {
    return {
        id: row.id,
        sellerId: row.seller_id,
        listingId: row.listing_id,
        isBuyboxWinner: row.is_buybox_winner,
        keywordId: row.keyword_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export class SellerListingModel {
    static async findById(id: number): Promise<SellerListing | null> {
        try {
            const [rows] = await pool.query<SellerListingRow[]>(
                'SELECT * FROM seller_listings WHERE id = ?',
                [id]
            );
            return rows.length ? convertRowToSellerListing(rows[0]) : null;
        } catch (error) {
            logger.error('Error in SellerListingModel.findById:', error);
            throw error;
        }
    }

    static async findBySellerId(sellerId: number): Promise<SellerListing[]> {
        try {
            const [rows] = await pool.query<SellerListingRow[]>(
                'SELECT * FROM seller_listings WHERE seller_id = ?',
                [sellerId]
            );
            return rows.map(convertRowToSellerListing);
        } catch (error) {
            logger.error('Error in SellerListingModel.findBySellerId:', error);
            throw error;
        }
    }

    static async findByListingId(listingId: number): Promise<SellerListing[]> {
        try {
            const [rows] = await pool.query<SellerListingRow[]>(
                'SELECT * FROM seller_listings WHERE listing_id = ?',
                [listingId]
            );
            return rows.map(convertRowToSellerListing);
        } catch (error) {
            logger.error('Error in SellerListingModel.findByListingId:', error);
            throw error;
        }
    }

    static async create(data: {
        sellerId: number;
        listingId: number;
        isBuyboxWinner?: boolean;
        keywordId?: number;
    }): Promise<SellerListing> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO seller_listings (seller_id, listing_id, is_buybox_winner, keyword_id) VALUES (?, ?, ?, ?)',
                [data.sellerId, data.listingId, data.isBuyboxWinner || null, data.keywordId || null]
            );

            const [rows] = await pool.query<SellerListingRow[]>(
                'SELECT * FROM seller_listings WHERE id = ?',
                [result.insertId]
            );

            if (!rows.length) {
                throw new Error('Failed to create seller listing');
            }

            return convertRowToSellerListing(rows[0]);
        } catch (error) {
            logger.error('Error in SellerListingModel.create:', error);
            throw error;
        }
    }

    static async update(id: number, data: {
        isBuyboxWinner?: boolean;
        keywordId?: number;
    }): Promise<SellerListing | null> {
        try {
            const updates: string[] = [];
            const values: (boolean | number)[] = [];

            if (data.isBuyboxWinner !== undefined) {
                updates.push('is_buybox_winner = ?');
                values.push(data.isBuyboxWinner);
            }
            if (data.keywordId !== undefined) {
                updates.push('keyword_id = ?');
                values.push(data.keywordId);
            }

            if (updates.length === 0) {
                return this.findById(id);
            }

            values.push(id);

            await pool.query(
                `UPDATE seller_listings SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return this.findById(id);
        } catch (error) {
            logger.error('Error in SellerListingModel.update:', error);
            throw error;
        }
    }
} 