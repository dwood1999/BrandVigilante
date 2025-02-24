import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BrandModel } from '$lib/models/brand';
import { UserModel } from '$lib/models/user';
import { TrademarkTermModel } from '$lib/models/trademarkTerm';
import { MarketplaceModel } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    try {
        const [
            brands,
            users,
            terms,
            marketplaces
        ] = await Promise.all([
            BrandModel.count(),
            UserModel.count(),
            TrademarkTermModel.count(),
            MarketplaceModel.count()
        ]);

        return {
            stats: {
                brands,
                users,
                terms,
                marketplaces
            }
        };
    } catch (error) {
        logger.error('Error loading admin dashboard stats:', error);
        return {
            stats: {
                brands: 0,
                users: 0,
                terms: 0,
                marketplaces: 0
            }
        };
    }
}; 