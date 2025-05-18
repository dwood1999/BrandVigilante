import { error, redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MarketplaceModel } from '$lib/models/marketplace';
import type { Marketplace } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

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
    const { id } = params;
    const user = locals.user;

    if (!user || user.role !== 'admin') {
        throw redirect(302, '/sign-in');
    }

    if (!id) {
        throw redirect(302, '/admin/marketplaces');
    }

    const marketplace = await MarketplaceModel.findById(parseInt(id));
    if (!marketplace) {
        throw error(404, {
            message: 'Marketplace not found',
            status: 404
        });
    }

    return {
        marketplace,
        databaseStatus: 'working',
        features: [],
        users: [],
        userMessage: '',
        meta: {
            title: `Edit Marketplace - ${marketplace.platform_name}`,
            description: `Edit marketplace details for ${marketplace.platform_name}`,
            severity: 1
        },
        severity: 'info'
    };
}) satisfies PageServerLoad;

export const actions = {
    update: async ({ request, params }) => {
        const formData = await request.formData();
        const id = parseInt(params.id);

        if (!id) {
            return fail(400, { error: 'Invalid marketplace ID' });
        }

        try {
            const platformName = formData.get('platform_name')?.toString().trim();
            const baseUrl = formData.get('base_url')?.toString().trim();
            const currencyCode = formData.get('currency_code')?.toString().trim();
            const countryCode = formData.get('country_code')?.toString().trim();
            const externalId = formData.get('external_id')?.toString().trim();

            if (!platformName || !baseUrl || !currencyCode || !countryCode) {
                return fail(400, { 
                    error: 'Missing required fields',
                    fieldErrors: {
                        platform_name: !platformName ? 'Platform name is required' : undefined,
                        base_url: !baseUrl ? 'Base URL is required' : undefined,
                        currency_code: !currencyCode ? 'Currency code is required' : undefined,
                        country_code: !countryCode ? 'Country code is required' : undefined
                    }
                });
            }

            if (!isValidUrl(baseUrl)) {
                return fail(400, { 
                    error: 'Please enter a valid URL',
                    fieldErrors: {
                        base_url: 'Please enter a valid URL'
                    }
                });
            }

            await MarketplaceModel.update(id, {
                platform_name: platformName,
                base_url: baseUrl,
                currency_code: currencyCode,
                country_code: countryCode,
                external_id: externalId || undefined
            });

            return { 
                success: true,
                message: 'Marketplace updated successfully!'
            };
        } catch (err) {
            logger.error('Error updating marketplace:', err);
            return fail(500, { 
                error: err instanceof Error ? err.message : 'Failed to update marketplace',
                data: {
                    platform_name: platformName,
                    base_url: baseUrl,
                    currency_code: currencyCode,
                    country_code: countryCode,
                    external_id: externalId
                }
            });
        }
    }
} satisfies Actions;

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
} 