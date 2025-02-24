import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserModel } from '$lib/models/user';

export const DELETE: RequestHandler = async ({ params, locals }) => {
    // Check if user is admin
    if (!locals.user || locals.user.role !== 'admin') {
        throw error(403, 'Unauthorized');
    }

    try {
        const userId = parseInt(params.id);
        
        // Don't allow deleting your own account
        if (userId === locals.user.id) {
            throw error(400, 'Cannot delete your own account');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw error(404, 'User not found');
        }

        await UserModel.delete(userId);
        return json({ success: true });

    } catch (err) {
        console.error('Error deleting user:', err);
        throw error(500, 'Failed to delete user');
    }
}; 