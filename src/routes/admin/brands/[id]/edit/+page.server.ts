import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BrandModel } from '$lib/models/brand';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const brandId = parseInt(params.id);
    if (isNaN(brandId)) {
        throw error(404, 'Brand not found');
    }

    const brand = await BrandModel.findById(brandId);
    if (!brand) {
        throw error(404, 'Brand not found');
    }

    return { brand };
};

export const actions: Actions = {
    update: async ({ request, params }) => {
        const brandId = parseInt(params.id);
        if (isNaN(brandId)) {
            return fail(400, { error: 'Invalid brand ID' });
        }

        const formData = await request.formData();
        const name = formData.get('name')?.toString().trim();
        const display_name = formData.get('display_name')?.toString().trim();
        const url = formData.get('url')?.toString().trim();
        const description = formData.get('description')?.toString().trim();
        const status = formData.get('status')?.toString() as 'active' | 'inactive';

        if (!name) {
            return fail(400, { 
                error: 'Brand name is required',
                fieldErrors: {
                    name: 'Brand name is required'
                }
            });
        }

        if (!display_name) {
            return fail(400, { 
                error: 'Display name is required',
                fieldErrors: {
                    display_name: 'Display name is required'
                }
            });
        }

        if (url && !isValidUrl(url)) {
            return fail(400, { 
                error: 'Please enter a valid URL',
                fieldErrors: {
                    url: 'Please enter a valid URL'
                }
            });
        }

        try {
            const brand = await BrandModel.update(brandId, {
                name,
                display_name,
                url: url || null,
                description: description || null,
                status: status || 'active'
            });

            return { 
                success: true,
                message: 'Brand updated successfully!',
                data: brand
            };
        } catch (error) {
            logger.error('Error updating brand:', error);
            return fail(500, { 
                error: 'Failed to update brand',
                data: {
                    name,
                    display_name,
                    url,
                    description,
                    status
                }
            });
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