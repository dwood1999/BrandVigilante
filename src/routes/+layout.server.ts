import type { LayoutServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { sessionConfig } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const userId = cookies.get(sessionConfig.cookieName);
    
    if (!userId) {
        return {
            user: null
        };
    }

    try {
        const user = await UserModel.findById(parseInt(userId));
        if (!user) {
            cookies.delete(sessionConfig.cookieName, { path: '/' });
            return {
                user: null
            };
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }
        };
    } catch (error) {
        console.error('Error loading user:', error);
        return {
            user: null
        };
    }
}; 