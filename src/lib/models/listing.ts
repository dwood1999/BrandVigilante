import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { logger } from '$lib/logger';

export interface ListingRow extends RowDataPacket {
    id: number;
    product_id: number;
    marketplace_id: number;
    price: number;
    currency: string;
    url: string;
    created_at: string;
    updated_at: string;
    // Product fields
    product_title: string;
    product_upc: string;
    product_ean: string;
    // Marketplace fields
    marketplace_name: string;
    marketplace_country: string;
    seller_id: number;
    seller_name: string;
    seller_url: string;
    is_buybox_winner: boolean;
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

export interface PaginatedListings {
    listings: ListingRow[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface ListParams {
    page: number;
    perPage: number;
    search?: string;
    marketplace_id?: number;
    product_id?: number;
}

export class ListingModel {
    static async list(params: ListParams): Promise<PaginatedListings> {
        const offset = (params.page - 1) * params.perPage;
        const whereConditions: string[] = [];
        const queryParams: any[] = [];

        if (params.search) {
            whereConditions.push('(p.title LIKE ? OR p.upc LIKE ? OR p.ean LIKE ?)');
            queryParams.push(`%${params.search}%`, `%${params.search}%`, `%${params.search}%`);
        }

        if (params.marketplace_id) {
            whereConditions.push('l.marketplace_id = ?');
            queryParams.push(params.marketplace_id);
        }

        if (params.product_id) {
            whereConditions.push('l.product_id = ?');
            queryParams.push(params.product_id);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const [rows] = await pool.query<ListingRow[]>(
            `SELECT l.*, 
                    MAX(p.title) as product_title, MAX(p.upc) as product_upc, MAX(p.ean) as product_ean,
                    MAX(m.platform_name) as marketplace_name, MAX(m.country_code) as marketplace_country,
                    MAX(s.id) as seller_id, MAX(s.seller_name) as seller_name, MAX(s.seller_url) as seller_url,
                    MAX(sl.is_buybox_winner) as is_buybox_winner
             FROM listings l
             JOIN products p ON l.product_id = p.id
             JOIN marketplaces m ON l.marketplace_id = m.id
             LEFT JOIN seller_listings sl ON l.id = sl.listing_id AND sl.is_buybox_winner = TRUE
             LEFT JOIN sellers s ON sl.seller_id = s.id
             ${whereClause}
             GROUP BY l.id
             ORDER BY l.created_at DESC
             LIMIT ? OFFSET ?`,
            [...queryParams, params.perPage, offset]
        );

        const [countResult] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(DISTINCT l.id) as total
             FROM listings l
             JOIN products p ON l.product_id = p.id
             JOIN marketplaces m ON l.marketplace_id = m.id
             LEFT JOIN seller_listings sl ON l.id = sl.listing_id AND sl.is_buybox_winner = TRUE
             LEFT JOIN sellers s ON sl.seller_id = s.id
             ${whereClause}`,
            queryParams
        );

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / params.perPage);

        return {
            listings: rows,
            total,
            page: params.page,
            perPage: params.perPage,
            totalPages
        };
    }

    static async findById(id: number): Promise<ListingRow | null> {
        const [rows] = await pool.query<ListingRow[]>(
            `SELECT 
                l.*,
                p.title as product_title,
                p.upc as product_upc,
                p.ean as product_ean,
                m.platform_name as marketplace_name,
                m.country_code as marketplace_country
             FROM listings l
             JOIN products p ON l.product_id = p.id
             JOIN marketplaces m ON l.marketplace_id = m.id
             WHERE l.id = ?`,
            [id]
        );
        return rows[0] || null;
    }

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