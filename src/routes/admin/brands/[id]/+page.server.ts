import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { BrandModel } from '$lib/models/brand';
import { UserModel } from '$lib/models/user';
import { TrademarkTermModel } from '$lib/models/trademarkTerm';
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
        const [brand, terms, users, availableUsers] = await Promise.all([
            BrandModel.findById(brandId),
            TrademarkTermModel.findByBrandId(brandId),
            UserModel.findByBrandId(brandId),
            UserModel.findAll() // We'll filter out already associated users in the UI
        ]);

        if (!brand) {
            throw redirect(302, '/admin/brands');
        }

        return {
            brand,
            terms,
            users,
            availableUsers
        };
    } catch (error) {
        logger.error('Error loading brand management data:', error);
        throw redirect(302, '/admin/brands');
    }
}; 