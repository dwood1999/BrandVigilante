import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { ListingModel } from '$lib/models/listing';

export interface PageData {
    listings: {
        id: number;
        product_id: number;
        marketplace_id: number;
        price: number;
        currency: string;
        url: string;
        created_at: string;
        updated_at: string;
        product_title: string;
        product_upc: string;
        product_ean: string;
        marketplace_name: string;
        marketplace_country: string;
        seller_id: number | null;
        seller_name: string | null;
        seller_url: string | null;
        is_buybox_winner: boolean;
    }[];
    pagination: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
    meta: {
        title: string;
        description: string;
    };
    databaseStatus: "working" | "failed";
    features: {
        title: string;
        description: string;
        icon?: string;
    }[];
    userMessage?: string;
    users: never[];
}

export const load = (async ({ locals, url }: ServerLoadEvent) => {
    // Check if user is logged in
    if (!locals.user) {
        throw redirect(302, '/sign-in');
    }

    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('perPage')) || 10;
    const search = url.searchParams.get('search') || undefined;
    const marketplace_id = url.searchParams.get('marketplace_id') ? 
        Number(url.searchParams.get('marketplace_id')) : undefined;
    const product_id = url.searchParams.get('product_id') ? 
        Number(url.searchParams.get('product_id')) : undefined;

    try {
        const result = await ListingModel.list({ 
            page, 
            perPage, 
            search, 
            marketplace_id, 
            product_id 
        });

        return {
            listings: result.listings.map(listing => ({
                ...listing,
                created_at: listing.created_at.toISOString(),
                updated_at: listing.updated_at.toISOString()
            })),
            pagination: {
                total: result.total,
                page: result.page,
                perPage: result.perPage,
                totalPages: result.totalPages
            },
            meta: {
                title: 'Product Listings',
                description: 'Browse product listings across all marketplaces'
            },
            databaseStatus: "working",
            features: [
                {
                    title: 'Search',
                    description: 'Search listings by product title, UPC, or EAN'
                },
                {
                    title: 'Filter',
                    description: 'Filter listings by marketplace or product'
                },
                {
                    title: 'Pagination',
                    description: 'Navigate through pages of listings'
                }
            ],
            users: []
        } satisfies PageData;
    } catch (error) {
        console.error('Error loading listings:', error);
        throw error(500, 'Failed to load listings');
    }
}) satisfies PageServerLoad; 