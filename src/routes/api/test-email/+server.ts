import { json, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '$lib/email';
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const { to } = data;

        if (!to) {
            return json({ success: false, message: 'Email address is required' }, { status: 400 });
        }

        const testEmailSent = await sendEmail({
            to,
            subject: 'Test Email from BrandVigilante',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Test Email</h2>
                    <p>This is a test email to verify the email sending functionality is working correctly.</p>
                    <p>If you received this email, the email system is configured and working properly.</p>
                    <p>Sent at: ${new Date().toLocaleString()}</p>
                </div>
            `
        });

        if (testEmailSent) {
            logger.info('Test email sent successfully to:', to);
            return json({ success: true, message: 'Test email sent successfully' });
        } else {
            logger.error('Failed to send test email to:', to);
            return json({ success: false, message: 'Failed to send test email. Check server logs for details.' }, { status: 500 });
        }
    } catch (error) {
        logger.error('Error in test email endpoint:', error);
        return json({ success: false, message: 'An error occurred while sending test email' }, { status: 500 });
    }
}; 