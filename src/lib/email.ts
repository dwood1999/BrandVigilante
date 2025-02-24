import { dev } from '$app/environment';
import { logger } from '$lib/logger';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
    try {
        // Use dynamic import for nodemailer
        const { default: nodemailer } = await import('nodemailer');
        
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        if (dev) {
            logger.info('Email would be sent:', {
                to,
                subject,
                html
            });
            // Still send in dev if SMTP is configured
            if (!process.env.SMTP_HOST) {
                return true;
            }
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html
        });

        logger.info('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        logger.error('Email sending failed:', error);
        return false;
    }
}

export function getVerificationEmailContent(token: string, firstName: string): string {
    // Always use ORIGIN for consistency
    const baseUrl = process.env.ORIGIN || 'http://localhost:5173';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to JanusIPM!</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 4px; display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #4b5563;">${verificationUrl}</p>
            <p>This link will expire in 7 days.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
    `;
} 