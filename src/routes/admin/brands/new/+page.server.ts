import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BrandModel } from '../../../../lib/models/brand';
import { logger } from '../../../../lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
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
            await BrandModel.create({
                name,
                url: url || undefined,
                description: description || undefined
            });

            return { success: true };
        } catch (error) {
            logger.error('Error creating brand:', error);
            return fail(500, { error: 'Failed to create brand' });
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