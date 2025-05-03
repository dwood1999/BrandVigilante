import { pool } from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { logger } from '$lib/logger';

interface ProductRow extends RowDataPacket {
    id: number;
    title: string | null;
    upc: string | null;
    ean: string | null;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    title: string | null;
    upc: string | null;
    ean: string | null;
    createdAt: string;
    updatedAt: string;
}

function convertRowToProduct(row: ProductRow): Product {
    return {
        id: row.id,
        title: row.title,
        upc: row.upc,
        ean: row.ean,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export class ProductModel {
    static async findById(id: number): Promise<Product | null> {
        try {
            const [rows] = await pool.query<ProductRow[]>(
                'SELECT * FROM products WHERE id = ?',
                [id]
            );
            return rows.length ? convertRowToProduct(rows[0]) : null;
        } catch (error) {
            logger.error('Error in ProductModel.findById:', error);
            throw error;
        }
    }

    static async findByUPC(upc: string): Promise<Product | null> {
        try {
            const [rows] = await pool.query<ProductRow[]>(
                'SELECT * FROM products WHERE upc = ?',
                [upc]
            );
            return rows.length ? convertRowToProduct(rows[0]) : null;
        } catch (error) {
            logger.error('Error in ProductModel.findByUPC:', error);
            throw error;
        }
    }

    static async findByEAN(ean: string): Promise<Product | null> {
        try {
            const [rows] = await pool.query<ProductRow[]>(
                'SELECT * FROM products WHERE ean = ?',
                [ean]
            );
            return rows.length ? convertRowToProduct(rows[0]) : null;
        } catch (error) {
            logger.error('Error in ProductModel.findByEAN:', error);
            throw error;
        }
    }

    static async create(data: {
        title?: string;
        upc?: string;
        ean?: string;
    }): Promise<Product> {
        try {
            const [result] = await pool.query<ResultSetHeader>(
                'INSERT INTO products (title, upc, ean) VALUES (?, ?, ?)',
                [data.title || null, data.upc || null, data.ean || null]
            );

            const [rows] = await pool.query<ProductRow[]>(
                'SELECT * FROM products WHERE id = ?',
                [result.insertId]
            );

            if (!rows.length) {
                throw new Error('Failed to create product');
            }

            return convertRowToProduct(rows[0]);
        } catch (error) {
            logger.error('Error in ProductModel.create:', error);
            throw error;
        }
    }

    static async update(id: number, data: {
        title?: string;
        upc?: string;
        ean?: string;
    }): Promise<Product | null> {
        try {
            const updates: string[] = [];
            const values: (string | number)[] = [];

            if (data.title !== undefined) {
                updates.push('title = ?');
                values.push(data.title);
            }
            if (data.upc !== undefined) {
                updates.push('upc = ?');
                values.push(data.upc);
            }
            if (data.ean !== undefined) {
                updates.push('ean = ?');
                values.push(data.ean);
            }

            if (updates.length === 0) {
                return this.findById(id);
            }

            values.push(id);

            await pool.query(
                `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return this.findById(id);
        } catch (error) {
            logger.error('Error in ProductModel.update:', error);
            throw error;
        }
    }
} 