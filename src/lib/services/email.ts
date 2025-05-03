import nodemailer from 'nodemailer';
import { dev } from '$app/environment';
import { logger } from '$lib/logger';

// Create a test account for development
const testAccount = dev ? await nodemailer.createTestAccount() : null;

// Create reusable transporter object
const transporter = nodemailer.createTransport({
    host: dev ? 'smtp.ethereal.email' : process.env.SMTP_HOST,
    port: dev ? 587 : Number(process.env.SMTP_PORT),
    secure: dev ? false : process.env.SMTP_SECURE === 'true',
    auth: {
        user: dev ? testAccount?.user : process.env.SMTP_USER,
        pass: dev ? testAccount?.pass : process.env.SMTP_PASS
    }
});

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@janusipm.com',
        to: email,
        subject: 'Reset your JanusIPM password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a56db;">Reset Your Password</h2>
                <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                <p>To reset your password, click the button below:</p>
                <div style="margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all;">${resetUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you have any questions, please contact our support team.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        if (dev) {
            logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        logger.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
} 