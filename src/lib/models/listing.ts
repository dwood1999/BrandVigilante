import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

interface ListingRow extends RowDataPacket {
    id: number;
    url: string | null;
    product_id: number;
    marketplace_id: number;
    external_id: string | null;
    created_at: string;
    updated_at: string;
}

interface BrandTmtermRow extends RowDataPacket {
    id: number;
    brand_id: number | null;
    term: string;
    created_at: string;
}

export interface Listing extends ListingRow {
    marketplace?: {
        id: number;
        currency_code: string;
        platform_name: string;
        country_code: string;
        external_id: string | null;
        base_url: string;
        created_at: string;
        updated_at: string;
    };
    product?: {
        id: number;
        title: string | null;
        upc: string | null;
        ean: string | null;
        created_at: string;
        updated_at: string;
    };
    seller?: {
        id: number;
        external_seller_id: string;
        seller_name: string;
        seller_url: string;
        created_at: string;
        updated_at: string;
    };
    brand_tmterms?: BrandTmtermRow[];
}

export interface CreateListingData {
    url?: string;
    product_id: number;
    marketplace_id: number;
    external_id?: string;
    seller_id?: number;
    brand_tmterm_ids?: number[];
}

export interface UpdateListingData {
    url?: string;
    product_id?: number;
    marketplace_id?: number;
    external_id?: string;
    seller_id?: number;
    brand_tmterm_ids?: number[];
}

export class ListingModel {
    static async findAll(): Promise<Listing[]> {
        try {
            const [listings] = await pool.query<ListingRow[]>(
                `SELECT l.*, m.id, m.currency_code, m.platform_name, m.country_code, m.external_id, m.base_url, m.created_at, m.updated_at,
                        p.id as product_id, p.title, p.upc, p.ean, p.created_at as product_created_at, p.updated_at as product_updated_at,
                        s.id as seller_id, s.external_seller_id, s.seller_name, s.seller_url, s.created_at as seller_created_at, s.updated_at as seller_updated_at
                 FROM listings l 
                 JOIN marketplaces m ON l.marketplace_id = m.id 
                 JOIN products p ON l.product_id = p.id
                 LEFT JOIN sellers s ON l.seller_id = s.id
                 ORDER BY l.created_at DESC`
            );
            
            // Fetch brand trademark terms for each listing
            const listingsWithTerms = await Promise.all(
                listings.map(async (listing) => {
                    const [terms] = await pool.query<BrandTmtermRow[]>(
                        `SELECT bt.id, bt.brand_id, bt.term, bt.created_at
                         FROM brand_tmterms bt
                         JOIN listing_brand_tmterms lbt ON bt.id = lbt.brand_tmterm_id
                         WHERE lbt.listing_id = ?`,
                        [listing.id]
                    );
                    return { ...listing, brand_tmterms: terms };
                })
            );
            
            return listingsWithTerms;
        } catch (error: any) {
            logger.error('Error in ListingModel.findAll:', { error: error.message });
            throw error;
        }
    }

    static async findById(id: number): Promise<Listing | null> {
        try {
            const [listings] = await pool.query<ListingRow[]>(
                `SELECT l.*, m.id, m.currency_code, m.platform_name, m.country_code, m.external_id, m.base_url, m.created_at, m.updated_at,
                        p.id as product_id, p.title, p.upc, p.ean, p.created_at as product_created_at, p.updated_at as product_updated_at,
                        s.id as seller_id, s.external_seller_id, s.seller_name, s.seller_url, s.created_at as seller_created_at, s.updated_at as seller_updated_at
                 FROM listings l 
                 JOIN marketplaces m ON l.marketplace_id = m.id 
                 JOIN products p ON l.product_id = p.id
                 LEFT JOIN sellers s ON l.seller_id = s.id
                 WHERE l.id = ?`,
                [id]
            );
            
            if (listings.length === 0) return null;
            
            const listing = listings[0];
            
            // Fetch brand trademark terms for the listing
            const [terms] = await pool.query<BrandTmtermRow[]>(
                `SELECT bt.id, bt.brand_id, bt.term, bt.created_at
                 FROM brand_tmterms bt
                 JOIN listing_brand_tmterms lbt ON bt.id = lbt.brand_tmterm_id
                 WHERE lbt.listing_id = ?`,
                [id]
            );
            
            return { ...listing, brand_tmterms: terms };
        } catch (error: any) {
            logger.error('Error in ListingModel.findById:', { error: error.message });
            throw error;
        }
    }

    static async findByProductId(productId: number): Promise<Listing[]> {
        try {
            const [listings] = await pool.query<ListingRow[]>(
                `SELECT l.*, m.id, m.currency_code, m.platform_name, m.country_code, m.external_id, m.base_url, m.created_at, m.updated_at,
                        p.id as product_id, p.title, p.upc, p.ean, p.created_at as product_created_at, p.updated_at as product_updated_at,
                        s.id as seller_id, s.external_seller_id, s.seller_name, s.seller_url, s.created_at as seller_created_at, s.updated_at as seller_updated_at
                 FROM listings l 
                 JOIN marketplaces m ON l.marketplace_id = m.id 
                 JOIN products p ON l.product_id = p.id
                 LEFT JOIN sellers s ON l.seller_id = s.id
                 WHERE l.product_id = ? 
                 ORDER BY l.created_at DESC`,
                [productId]
            );
            
            // Fetch brand trademark terms for each listing
            const listingsWithTerms = await Promise.all(
                listings.map(async (listing) => {
                    const [terms] = await pool.query<BrandTmtermRow[]>(
                        `SELECT bt.id, bt.brand_id, bt.term, bt.created_at
                         FROM brand_tmterms bt
                         JOIN listing_brand_tmterms lbt ON bt.id = lbt.brand_tmterm_id
                         WHERE lbt.listing_id = ?`,
                        [listing.id]
                    );
                    return { ...listing, brand_tmterms: terms };
                })
            );
            
            return listingsWithTerms;
        } catch (error: any) {
            logger.error('Error in ListingModel.findByProductId:', { error: error.message });
            throw error;
        }
    }

    static async findByMarketplaceId(marketplaceId: number): Promise<Listing[]> {
        try {
            const [listings] = await pool.query<ListingRow[]>(
                `SELECT l.*, m.id, m.currency_code, m.platform_name, m.country_code, m.external_id, m.base_url, m.created_at, m.updated_at,
                        p.id as product_id, p.title, p.upc, p.ean, p.created_at as product_created_at, p.updated_at as product_updated_at,
                        s.id as seller_id, s.external_seller_id, s.seller_name, s.seller_url, s.created_at as seller_created_at, s.updated_at as seller_updated_at
                 FROM listings l 
                 JOIN marketplaces m ON l.marketplace_id = m.id 
                 JOIN products p ON l.product_id = p.id
                 LEFT JOIN sellers s ON l.seller_id = s.id
                 WHERE l.marketplace_id = ? 
                 ORDER BY l.created_at DESC`,
                [marketplaceId]
            );
            
            // Fetch brand trademark terms for each listing
            const listingsWithTerms = await Promise.all(
                listings.map(async (listing) => {
                    const [terms] = await pool.query<BrandTmtermRow[]>(
                        `SELECT bt.id, bt.brand_id, bt.term, bt.created_at
                         FROM brand_tmterms bt
                         JOIN listing_brand_tmterms lbt ON bt.id = lbt.brand_tmterm_id
                         WHERE lbt.listing_id = ?`,
                        [listing.id]
                    );
                    return { ...listing, brand_tmterms: terms };
                })
            );
            
            return listingsWithTerms;
        } catch (error: any) {
            logger.error('Error in ListingModel.findByMarketplaceId:', { error: error.message });
            throw error;
        }
    }

    static async findBySellerId(sellerId: number): Promise<Listing[]> {
        try {
            const [listings] = await pool.query<ListingRow[]>(
                `SELECT l.*, m.id, m.currency_code, m.platform_name, m.country_code, m.external_id, m.base_url, m.created_at, m.updated_at,
                        p.id as product_id, p.title, p.upc, p.ean, p.created_at as product_created_at, p.updated_at as product_updated_at,
                        s.id as seller_id, s.external_seller_id, s.seller_name, s.seller_url, s.created_at as seller_created_at, s.updated_at as seller_updated_at
                 FROM listings l 
                 JOIN marketplaces m ON l.marketplace_id = m.id 
                 JOIN products p ON l.product_id = p.id
                 JOIN sellers s ON l.seller_id = s.id
                 WHERE l.seller_id = ? 
                 ORDER BY l.created_at DESC`,
                [sellerId]
            );
            
            // Fetch brand trademark terms for each listing
            const listingsWithTerms = await Promise.all(
                listings.map(async (listing) => {
                    const [terms] = await pool.query<BrandTmtermRow[]>(
                        `SELECT bt.id, bt.brand_id, bt.term, bt.created_at
                         FROM brand_tmterms bt
                         JOIN listing_brand_tmterms lbt ON bt.id = lbt.brand_tmterm_id
                         WHERE lbt.listing_id = ?`,
                        [listing.id]
                    );
                    return { ...listing, brand_tmterms: terms };
                })
            );
            
            return listingsWithTerms;
        } catch (error: any) {
            logger.error('Error in ListingModel.findBySellerId:', { error: error.message });
            throw error;
        }
    }

    static async findByBrandTmtermId(brandTmtermId: number): Promise<Listing[]> {
        try {
            const [listings] = await pool.query<ListingRow[]>(
                `SELECT l.*, m.id, m.currency_code, m.platform_name, m.country_code, m.external_id, m.base_url, m.created_at, m.updated_at,
                        p.id as product_id, p.title, p.upc, p.ean, p.created_at as product_created_at, p.updated_at as product_updated_at,
                        s.id as seller_id, s.external_seller_id, s.seller_name, s.seller_url, s.created_at as seller_created_at, s.updated_at as seller_updated_at
                 FROM listings l 
                 JOIN marketplaces m ON l.marketplace_id = m.id 
                 JOIN products p ON l.product_id = p.id
                 LEFT JOIN sellers s ON l.seller_id = s.id
                 JOIN listing_brand_tmterms lbt ON l.id = lbt.listing_id
                 WHERE lbt.brand_tmterm_id = ? 
                 ORDER BY l.created_at DESC`,
                [brandTmtermId]
            );
            
            // Fetch brand trademark terms for each listing
            const listingsWithTerms = await Promise.all(
                listings.map(async (listing) => {
                    const [terms] = await pool.query<BrandTmtermRow[]>(
                        `SELECT bt.id, bt.brand_id, bt.term, bt.created_at
                         FROM brand_tmterms bt
                         JOIN listing_brand_tmterms lbt ON bt.id = lbt.brand_tmterm_id
                         WHERE lbt.listing_id = ?`,
                        [listing.id]
                    );
                    return { ...listing, brand_tmterms: terms };
                })
            );
            
            return listingsWithTerms;
        } catch (error: any) {
            logger.error('Error in ListingModel.findByBrandTmtermId:', { error: error.message });
            throw error;
        }
    }

    static async create(data: CreateListingData): Promise<number> {
        try {
            // Start a transaction
            await pool.query('START TRANSACTION');
            
            try {
                // Insert the listing
                const [result] = await pool.query<ResultSetHeader>(
                    'INSERT INTO listings (url, product_id, marketplace_id, external_id, seller_id) VALUES (?, ?, ?, ?, ?)',
                    [data.url || null, data.product_id, data.marketplace_id, data.external_id || null, data.seller_id || null]
                );
                
                const listingId = result.insertId;
                
                // Insert brand trademark term associations if provided
                if (data.brand_tmterm_ids && data.brand_tmterm_ids.length > 0) {
                    const values = data.brand_tmterm_ids.map(termId => [listingId, termId]);
                    await pool.query(
                        'INSERT INTO listing_brand_tmterms (listing_id, brand_tmterm_id) VALUES ?',
                        [values]
                    );
                }
                
                // Commit the transaction
                await pool.query('COMMIT');
                
                return listingId;
            } catch (error) {
                // Rollback the transaction in case of error
                await pool.query('ROLLBACK');
                throw error;
            }
        } catch (error: any) {
            logger.error('Error in ListingModel.create:', { error: error.message });
            throw error;
        }
    }

    static async update(id: number, data: UpdateListingData): Promise<void> {
        try {
            // Start a transaction
            await pool.query('START TRANSACTION');
            
            try {
                const updates: string[] = [];
                const values: any[] = [];

                if (data.url !== undefined) {
                    updates.push('url = ?');
                    values.push(data.url);
                }
                if (data.product_id !== undefined) {
                    updates.push('product_id = ?');
                    values.push(data.product_id);
                }
                if (data.marketplace_id !== undefined) {
                    updates.push('marketplace_id = ?');
                    values.push(data.marketplace_id);
                }
                if (data.external_id !== undefined) {
                    updates.push('external_id = ?');
                    values.push(data.external_id);
                }
                if (data.seller_id !== undefined) {
                    updates.push('seller_id = ?');
                    values.push(data.seller_id);
                }

                if (updates.length > 0) {
                    values.push(id);
                    await pool.query(
                        `UPDATE listings SET ${updates.join(', ')} WHERE id = ?`,
                        values
                    );
                }
                
                // Update brand trademark term associations if provided
                if (data.brand_tmterm_ids !== undefined) {
                    // Delete existing associations
                    await pool.query(
                        'DELETE FROM listing_brand_tmterms WHERE listing_id = ?',
                        [id]
                    );
                    
                    // Insert new associations if any
                    if (data.brand_tmterm_ids.length > 0) {
                        const values = data.brand_tmterm_ids.map(termId => [id, termId]);
                        await pool.query(
                            'INSERT INTO listing_brand_tmterms (listing_id, brand_tmterm_id) VALUES ?',
                            [values]
                        );
                    }
                }
                
                // Commit the transaction
                await pool.query('COMMIT');
            } catch (error) {
                // Rollback the transaction in case of error
                await pool.query('ROLLBACK');
                throw error;
            }
        } catch (error: any) {
            logger.error('Error in ListingModel.update:', { error: error.message });
            throw error;
        }
    }

    static async delete(id: number): Promise<void> {
        try {
            // Start a transaction
            await pool.query('START TRANSACTION');
            
            try {
                // Delete brand trademark term associations
                await pool.query(
                    'DELETE FROM listing_brand_tmterms WHERE listing_id = ?',
                    [id]
                );
                
                // Delete the listing
                await pool.query('DELETE FROM listings WHERE id = ?', [id]);
                
                // Commit the transaction
                await pool.query('COMMIT');
            } catch (error) {
                // Rollback the transaction in case of error
                await pool.query('ROLLBACK');
                throw error;
            }
        } catch (error: any) {
            logger.error('Error in ListingModel.delete:', { error: error.message });
            throw error;
        }
    }

    static async count(): Promise<number> {
        try {
            const [result] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM listings'
            );
            return parseInt(result[0].count);
        } catch (error: any) {
            logger.error('Error in ListingModel.count:', { error: error.message });
            throw error;
        }
    }
} 