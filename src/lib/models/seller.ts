import { pool } from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { logger } from '$lib/logger';

interface SellerRow extends RowDataPacket {
    id: number;
    external_seller_id: string;
    seller_name: string;
    seller_url: string;
    created_at: string;
    updated_at: string;
}

export interface Seller {
    id: number;
    externalSellerId: string;
    sellerName: string;
    sellerUrl: string;
    createdAt: string;
    updatedAt: string;
}

function convertRowToSeller(row: SellerRow): Seller {
    return {
        id: row.id,
        externalSellerId: row.external_seller_id,
        sellerName: row.seller_name,
        sellerUrl: row.seller_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export class SellerModel {
    static async findById(id: number): Promise<Seller | null> {
        try {
            const [rows] = await pool.query<SellerRow[]>(
                'SELECT * FROM sellers WHERE id = ?',
                [id]
            );
            return rows.length ? convertRowToSeller(rows[0]) : null;
        } catch (error) {
            logger.error('Error in SellerModel.findById:', error);
            throw error;
        }
    }

    static async findByExternalId(externalId: string): Promise<Seller | null> {
        try {
            const [rows] = await pool.query<SellerRow[]>(
                'SELECT * FROM sellers WHERE external_seller_id = ?',
                [externalId]
            );
            return rows.length ? convertRowToSeller(rows[0]) : null;
        } catch (error) {
            logger.error('Error in SellerModel.findByExternalId:', error);
            throw error;
        }
    }

    static async create(data: {
        externalSellerId: string;
        sellerName: string;
        sellerUrl: string;
    }): Promise<Seller> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO sellers (external_seller_id, seller_name, seller_url) VALUES (?, ?, ?)',
                [data.externalSellerId, data.sellerName, data.sellerUrl]
            );

            const [rows] = await pool.query<SellerRow[]>(
                'SELECT * FROM sellers WHERE id = ?',
                [result.insertId]
            );

            if (!rows.length) {
                throw new Error('Failed to create seller');
            }

            return convertRowToSeller(rows[0]);
        } catch (error) {
            logger.error('Error in SellerModel.create:', error);
            throw error;
        }
    }

    static async update(id: number, data: {
        sellerName?: string;
        sellerUrl?: string;
    }): Promise<Seller | null> {
        try {
            const updates: string[] = [];
            const values: (string | number)[] = [];

            if (data.sellerName !== undefined) {
                updates.push('seller_name = ?');
                values.push(data.sellerName);
            }
            if (data.sellerUrl !== undefined) {
                updates.push('seller_url = ?');
                values.push(data.sellerUrl);
            }

            if (updates.length === 0) {
                return this.findById(id);
            }

            values.push(id);

            await pool.query(
                `UPDATE sellers SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return this.findById(id);
        } catch (error) {
            logger.error('Error in SellerModel.update:', error);
            throw error;
        }
    }
} 