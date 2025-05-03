import { json } from '@sveltejs/kit';
import { executeQueryWithTimeout } from '$lib/db-utils';
import { logger } from '$lib/logger';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        logger.debug('Checking user with ID 4');
        const [rows] = await executeQueryWithTimeout<any[]>(
            'SELECT * FROM users WHERE id = ?',
            [4],
            5000
        );

        logger.debug('User check result', { rows });

        return json({
            success: true,
            user: rows?.[0]
        });
    } catch (error) {
        logger.error('Error checking user', { error });
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}; 