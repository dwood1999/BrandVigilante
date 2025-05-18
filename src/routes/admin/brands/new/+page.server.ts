import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BrandModel } from '$lib/models/brand';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString().trim();
        const display_name = formData.get('display_name')?.toString().trim();
        const url = formData.get('url')?.toString().trim();
        const description = formData.get('description')?.toString().trim();

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
            const brand = await BrandModel.create({
                name,
                display_name,
                url: url || undefined,
                description: description || undefined
            });

            return { 
                success: true,
                message: 'Brand created successfully!',
                data: brand
            };
        } catch (error) {
            logger.error('Error creating brand:', error);
            return fail(500, { 
                error: 'Failed to create brand',
                data: {
                    name,
                    display_name,
                    url,
                    description
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