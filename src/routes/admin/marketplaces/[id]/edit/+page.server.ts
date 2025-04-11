import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MarketplaceModel } from '$lib/models/marketplace';
import type { Marketplace } from '$lib/models/marketplace';

interface PageData {
    marketplace: Marketplace;
    databaseStatus: 'working';
    features: { title: string; description: string; icon?: string }[];
    users: { id: string; email: string; role: string }[];
    userMessage: string;
    meta: { 
        title: string;
        description: string;
        severity: number;
    };
    severity: 'info';
}

export const load = (async ({ params, locals }): Promise<PageData> => {
    console.log('Loading marketplace with ID:', params.id);
    
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(303, '/login');
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
        console.error('Invalid marketplace ID:', params.id);
        throw redirect(303, '/admin/marketplaces');
    }

    const marketplace = await MarketplaceModel.findById(id);
    console.log('Loaded marketplace:', marketplace);
    
    if (!marketplace) {
        console.log('No marketplace found, redirecting to list');
        throw redirect(303, '/admin/marketplaces');
    }

    const pageData: PageData = {
        marketplace,
        databaseStatus: 'working',
        features: [],
        users: [],
        userMessage: '',
        meta: { 
            title: 'Edit Marketplace',
            description: 'Edit marketplace details',
            severity: 1
        },
        severity: 'info'
    };
    
    console.log('Returning page data:', pageData);
    return pageData;
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ request, params }) => {
        const formData = await request.formData();
        const platform_name = formData.get('platform_name')?.toString();
        const base_url = formData.get('base_url')?.toString();
        const currency_code = formData.get('currency_code')?.toString();
        const country_code = formData.get('country_code')?.toString();
        const external_id = formData.get('external_id')?.toString() || undefined;

        if (!platform_name || !base_url || !currency_code || !country_code) {
            return fail(400, {
                error: 'Required fields are missing',
                fieldErrors: {
                    platform_name: !platform_name ? 'Platform name is required' : undefined,
                    base_url: !base_url ? 'Base URL is required' : undefined,
                    currency_code: !currency_code ? 'Currency code is required' : undefined,
                    country_code: !country_code ? 'Country code is required' : undefined
                }
            });
        }

        // Validate URL format
        try {
            new URL(base_url);
        } catch (e) {
            return fail(400, {
                error: 'Invalid URL format',
                fieldErrors: {
                    base_url: 'Please enter a valid URL'
                }
            });
        }

        // Validate currency code format (3 characters)
        if (currency_code.length !== 3) {
            return fail(400, {
                error: 'Invalid currency code format',
                fieldErrors: {
                    currency_code: 'Currency code must be 3 characters (e.g., USD)'
                }
            });
        }

        // Validate country code format (2 characters)
        if (country_code.length !== 2) {
            return fail(400, {
                error: 'Invalid country code format',
                fieldErrors: {
                    country_code: 'Country code must be 2 characters (e.g., US)'
                }
            });
        }

        try {
            await MarketplaceModel.update(parseInt(params.id), {
                platform_name,
                base_url,
                currency_code,
                country_code,
                external_id
            });

            return { success: true };
        } catch (e) {
            console.error('Error updating marketplace:', e);
            return fail(500, {
                error: 'Failed to update marketplace'
            });
        }
    }
}; 