import { error, redirect } from '@sveltejs/kit';
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
    default: async ({ request, params }) => {
        const formData = await request.formData();
        const id = parseInt(params.id);

        if (!id) {
            return {
                success: false,
                error: 'Invalid marketplace ID'
            };
        }

        try {
            const platformName = formData.get('platform_name')?.toString();
            const baseUrl = formData.get('base_url')?.toString();
            const currencyCode = formData.get('currency_code')?.toString();
            const countryCode = formData.get('country_code')?.toString();
            const externalId = formData.get('external_id')?.toString();

            if (!platformName || !baseUrl || !currencyCode || !countryCode) {
                return {
                    success: false,
                    error: 'Missing required fields'
                };
            }

            await MarketplaceModel.update(id, {
                platform_name: platformName,
                base_url: baseUrl,
                currency_code: currencyCode,
                country_code: countryCode,
                external_id: externalId || undefined
            });

            return {
                type: 'redirect',
                location: '/admin/marketplaces'
            };
        } catch (err) {
            console.error('Error updating marketplace:', err);
            return {
                type: 'failure',
                data: {
                    error: err instanceof Error ? err.message : 'An unexpected error occurred'
                }
            };
        }
    }
} satisfies Actions; 