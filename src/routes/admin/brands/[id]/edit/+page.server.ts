import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BrandModel } from '../../../../../lib/models/brand';
import { logger } from '../../../../../lib/logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const brandId = parseInt(params.id);
    if (isNaN(brandId)) {
        throw redirect(302, '/admin/brands');
    }

    try {
        const brand = await BrandModel.findById(brandId);
        if (!brand) {
            throw redirect(302, '/admin/brands');
        }

        return {
            brand
        };
    } catch (error) {
        logger.error('Error loading brand:', error);
        throw redirect(302, '/admin/brands');
    }
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const brandId = parseInt(params.id);
        if (isNaN(brandId)) {
            return fail(400, { error: 'Invalid brand ID' });
        }

        const formData = await request.formData();
        const name = formData.get('name')?.toString().trim();
        const url = formData.get('url')?.toString().trim();
        const description = formData.get('description')?.toString().trim();

        if (!name) {
            return fail(400, { error: 'Brand name is required' });
        }

        if (url && !isValidUrl(url)) {
            return fail(400, { error: 'Please enter a valid URL' });
        }

        try {
            await BrandModel.update(brandId, {
                name,
                url: url || undefined,
                description: description || undefined
            });

            return { success: true };
        } catch (error) {
            logger.error('Error updating brand:', error);
            return fail(500, { error: 'Failed to update brand' });
        }
    }
};

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
} 