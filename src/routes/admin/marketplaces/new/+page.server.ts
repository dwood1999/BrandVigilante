import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MarketplaceModel } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

interface PageData {
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

export const load = (async ({ locals }): Promise<PageData> => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    return {
        databaseStatus: 'working',
        features: [],
        users: [],
        userMessage: '',
        meta: {
            title: 'Add New Marketplace',
            description: 'Create a new marketplace',
            severity: 1
        },
        severity: 'info'
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const platform_name = formData.get('name')?.toString().trim();
        const base_url = formData.get('url')?.toString().trim();

        if (!platform_name || !base_url) {
            return {
                type: 'failure',
                data: {
                    error: 'Name and URL are required',
                    fieldErrors: {
                        name: !platform_name ? 'Name is required' : undefined,
                        url: !base_url ? 'URL is required' : undefined
                    }
                }
            };
        }

        if (!isValidUrl(base_url)) {
            return {
                type: 'failure',
                data: {
                    error: 'Please enter a valid URL',
                    fieldErrors: {
                        url: 'Please enter a valid URL'
                    }
                }
            };
        }

        try {
            await MarketplaceModel.create({
                platform_name,
                base_url,
                currency_code: 'USD',
                country_code: 'US'
            });

            return {
                type: 'redirect',
                location: '/admin/marketplaces'
            };
        } catch (err) {
            logger.error('Error creating marketplace:', err);
            return {
                type: 'failure',
                data: {
                    error: err instanceof Error ? err.message : 'Failed to create marketplace'
                }
            };
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