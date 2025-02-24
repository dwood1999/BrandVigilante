import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { TrademarkTermModel } from '$lib/models/trademarkTerm';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    try {
        const terms = await TrademarkTermModel.findAll();
        return {
            terms
        };
    } catch (error) {
        logger.error('Error loading trademark terms:', error);
        return {
            terms: []
        };
    }
};

export const actions: Actions = {
    deleteTerm: async ({ request }) => {
        const formData = await request.formData();
        const termId = formData.get('termId');

        if (!termId) {
            return fail(400, { error: 'Term ID is required' });
        }

        try {
            await TrademarkTermModel.delete(parseInt(termId.toString()));
            return { success: true };
        } catch (error) {
            logger.error('Error deleting trademark term:', error);
            return fail(500, { error: 'Failed to delete trademark term' });
        }
    }
}; 