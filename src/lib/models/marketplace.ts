import { pool } from '$lib/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { logger } from '$lib/logger';

interface MarketplaceRow extends RowDataPacket {
    id: number;
    currency_code: string;
    platform_name: string;
    country_code: string;
    external_id: string | null;
    base_url: string;
    created_at: string;
    updated_at: string;
}

export interface Marketplace {
    id: number;
    currency_code: string;
    platform_name: string;
    country_code: string;
    external_id: string | null;
    base_url: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateMarketplaceData {
    currency_code: string;
    platform_name: string;
    country_code: string;
    external_id?: string;
    base_url: string;
}

export interface UpdateMarketplaceData {
    currency_code?: string;
    platform_name?: string;
    country_code?: string;
    external_id?: string;
    base_url?: string;
}

const convertRowToMarketplace = (row: MarketplaceRow): Marketplace => {
    console.log('[DEBUG] Converting row to marketplace. Raw row:', JSON.stringify(row, null, 2));
    
    if (!row) {
        console.error('[DEBUG] No row data provided to convert');
        throw new Error('No row data provided to convert');
    }
    
    // Ensure all required fields are present
    if (!row.platform_name || !row.base_url || !row.currency_code || !row.country_code) {
        console.error('[DEBUG] Row data is incomplete:', row);
        throw new Error('Row data is incomplete');
    }
    
    const marketplace = {
        ...row,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at)
    };
    
    console.log('[DEBUG] Converted marketplace:', JSON.stringify(marketplace, null, 2));
    return marketplace;
};

export class MarketplaceModel {
    static async findAll(): Promise<Marketplace[]> {
        const [rows] = await pool.query<MarketplaceRow[]>(
            'SELECT * FROM marketplaces ORDER BY platform_name ASC'
        );
        return rows.map(convertRowToMarketplace);
    }

    static async findById(id: number): Promise<Marketplace | null> {
        console.log('[DEBUG] Finding marketplace by ID:', id);
        
        try {
            // First, check if the table exists and has data
            const [tables] = await pool.query<RowDataPacket[]>(
                'SHOW TABLES LIKE "marketplaces"'
            );
            console.log('[DEBUG] Tables check result:', JSON.stringify(tables, null, 2));
            
            if (tables.length === 0) {
                console.error('[DEBUG] marketplaces table does not exist');
                return null;
            }
            
            // Check the structure of the table
            const [columns] = await pool.query<RowDataPacket[]>(
                'SHOW COLUMNS FROM marketplaces'
            );
            console.log('[DEBUG] Table columns:', JSON.stringify(columns, null, 2));
            
            // Check if there are any records in the table
            const [countResult] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM marketplaces'
            );
            console.log('[DEBUG] Total records:', countResult[0].count);
            
            // Now try to find the specific marketplace
            const [rows] = await pool.query<MarketplaceRow[]>(
                'SELECT * FROM marketplaces WHERE id = ?',
                [id]
            );
            console.log('[DEBUG] Database rows:', JSON.stringify(rows, null, 2));
            
            if (rows.length === 0) {
                console.log('[DEBUG] No marketplace found with ID:', id);
                return null;
            }
            
            const marketplace = convertRowToMarketplace(rows[0]);
            console.log('[DEBUG] Found and converted marketplace:', JSON.stringify(marketplace, null, 2));
            return marketplace;
        } catch (error) {
            console.error('[DEBUG] Error in findById:', error);
            throw error;
        }
    }

    static async findByExternalId(externalId: string): Promise<Marketplace | null> {
        const [rows] = await pool.query<MarketplaceRow[]>(
            'SELECT * FROM marketplaces WHERE external_id = ?',
            [externalId]
        );
        return rows[0] ? convertRowToMarketplace(rows[0]) : null;
    }

    static async findByCountryCode(countryCode: string): Promise<Marketplace[]> {
        const [rows] = await pool.query<MarketplaceRow[]>(
            'SELECT * FROM marketplaces WHERE country_code = ? ORDER BY platform_name',
            [countryCode]
        );
        return rows.map(convertRowToMarketplace);
    }

    static async create(data: CreateMarketplaceData): Promise<Marketplace> {
        const [result] = await pool.query(
            'INSERT INTO marketplaces (currency_code, platform_name, country_code, external_id, base_url) VALUES (?, ?, ?, ?, ?)',
            [data.currency_code, data.platform_name, data.country_code, data.external_id || null, data.base_url]
        );
        const id = (result as any).insertId;
        const marketplace = await this.findById(id);
        if (!marketplace) throw new Error('Failed to create marketplace');
        return marketplace;
    }

    static async update(id: number, data: UpdateMarketplaceData): Promise<Marketplace | null> {
        const sets: string[] = [];
        const values: any[] = [];

        if (data.currency_code !== undefined) {
            sets.push('currency_code = ?');
            values.push(data.currency_code);
        }
        if (data.platform_name !== undefined) {
            sets.push('platform_name = ?');
            values.push(data.platform_name);
        }
        if (data.country_code !== undefined) {
            sets.push('country_code = ?');
            values.push(data.country_code);
        }
        if (data.external_id !== undefined) {
            sets.push('external_id = ?');
            values.push(data.external_id);
        }
        if (data.base_url !== undefined) {
            sets.push('base_url = ?');
            values.push(data.base_url);
        }

        if (sets.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE marketplaces SET ${sets.join(', ')} WHERE id = ?`,
            values
        );

        return this.findById(id);
    }

    static async delete(id: number): Promise<void> {
        await pool.query('DELETE FROM marketplaces WHERE id = ?', [id]);
    }

    static async count(): Promise<number> {
        const [result] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM marketplaces'
        );
        return parseInt(result[0].count);
    }
} 