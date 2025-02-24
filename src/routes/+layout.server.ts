import type { LayoutServerLoad } from './$types';
import { UserModel } from '$lib/models/user';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const userId = cookies.get('userId');
    
    if (!userId) {
        return {
            user: null
        };
    }

    try {
        const user = await UserModel.findById(parseInt(userId));
        if (!user) {
            cookies.delete('userId', { path: '/' });
            return {
                user: null
            };
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                initials: user.email[0].toUpperCase()
            }
        };
    } catch (error) {
        console.error('Error loading user:', error);
        return {
            user: null
        };
    }
}; 