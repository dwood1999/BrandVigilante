import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import type { PageData } from './types';

export const load = (async () => {
    let users = [];
    let userMessage = 'No user records found in the database.';
    let databaseStatus = 'failed';

    try {
        users = await UserModel.findAll();
        databaseStatus = 'working';
        userMessage = `Found ${users.length} user${users.length === 1 ? '' : 's'} in the database.`;
    } catch (error) {
        console.error('[DB] Failed to fetch users:', error);
        userMessage = 'Failed to fetch users from database.';
    }

    return {
        users,
        userMessage,
        databaseStatus
    } satisfies PageData;
}) satisfies PageServerLoad; 