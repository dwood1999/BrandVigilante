import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BrandModel } from '$lib/models/brand';
import { UserModel } from '$lib/models/user';
import { TrademarkTermModel } from '$lib/models/trademarkTerm';
import { MarketplaceModel } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const brandId = parseInt(params.id);
    if (isNaN(brandId)) {
        throw redirect(302, '/admin/brands');
    }

    try {
        // Load all required data in parallel
        const [brand, terms, users, availableUsers, brandMarketplaces, allMarketplaces] = await Promise.all([
            BrandModel.findById(brandId),
            TrademarkTermModel.findByBrandId(brandId),
            UserModel.findByBrandId(brandId),
            UserModel.findAll(),
            MarketplaceModel.findByBrandId(brandId),
            MarketplaceModel.findAll()
        ]);

        // Debug log the available users
        console.log('Server-side available users:', availableUsers);

        if (!brand) {
            throw redirect(302, '/admin/brands');
        }

        return {
            brand,
            terms,
            users,
            availableUsers,
            brandMarketplaces,
            allMarketplaces
        };
    } catch (error) {
        logger.error('Error loading brand management data:', error);
        throw redirect(302, '/admin/brands');
    }
}; 