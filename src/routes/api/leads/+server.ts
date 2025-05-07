import { json, type RequestHandler } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';
import { sendEmail } from '$lib/email';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const { firstName, lastName, email, company, phone } = data;

        // Create the lead user
        const user = await UserModel.create({
            email,
            phone: phone || '',
            password: '', // blank password for leads
            role: 'lead',
            first_name: firstName,
            last_name: lastName,
            email_verified: false
        });

        // Send confirmation email to the lead
        await sendEmail({
            to: email,
            subject: 'Thank you for your interest in BrandVigilante',
            html: `<p>Hi ${firstName},</p><p>Thank you for your interest in BrandVigilante. Our team will reach out to you soon to discuss your needs.</p><p>Best regards,<br/>BrandVigilante Team</p>`
        });

        // Send notification email to cbreaux@janusipm.com
        await sendEmail({
            to: 'cbreaux@janusipm.com',
            subject: 'New Lead Inquiry',
            html: `<p>A new lead has signed up:</p><ul><li>Name: ${firstName} ${lastName}</li><li>Email: ${email}</li><li>Company: ${company}</li><li>Phone: ${phone || 'N/A'}</li></ul>`
        });

        return json({ success: true, message: 'Thank you for your inquiry! We will be in touch soon.' });
    } catch (error) {
        if ((error as any).code === 'ER_DUP_ENTRY') {
            return json({ success: false, message: 'A user with this email already exists.' }, { status: 400 });
        }
        console.error('Lead signup error:', error);
        return json({ success: false, message: 'There was an error submitting your inquiry. Please try again later.' }, { status: 500 });
    }
}; 