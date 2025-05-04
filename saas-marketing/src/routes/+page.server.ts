import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const schema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    company: z.string().min(2, "Company name must be at least 2 characters"),
    phone: z.string().optional(),
});

export const load = async () => {
    const form = await superValidate(zod(schema));
    return { form };
};

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(schema));
        
        if (!form.valid) {
            return fail(400, { form });
        }

        // Here you would typically:
        // 1. Save the data to your database
        // 2. Send a welcome email
        // 3. Create a user account
        // 4. etc.

        return { form };
    }
};