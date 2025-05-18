import { logger } from '$lib/logger';
import { env } from '$env/dynamic/private';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions): Promise<boolean> {
    try {
        // Use dynamic import for nodemailer
        const { default: nodemailer } = await import('nodemailer');
        
        // Log email attempt with full configuration
        logger.info('Attempting to send email:', { 
            to, 
            subject,
            smtpConfig: {
                host: env.SMTP_HOST,
                port: env.SMTP_PORT,
                user: env.SMTP_USER,
                from: env.SMTP_FROM
            }
        });

        // Check SMTP configuration
        if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
            logger.error('SMTP configuration missing:', {
                hasHost: !!env.SMTP_HOST,
                hasUser: !!env.SMTP_USER,
                hasPass: !!env.SMTP_PASS,
                hasFrom: !!env.SMTP_FROM
            });
            return false;
        }

        const transporter = nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: parseInt(env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: true // Enable debug logging
        });

        // Verify SMTP connection
        try {
            await transporter.verify();
            logger.info('SMTP connection verified successfully');
        } catch (verifyError) {
            logger.error('SMTP connection verification failed:', verifyError);
            return false;
        }

        const info = await transporter.sendMail({
            from: from || env.SMTP_FROM || env.SMTP_USER,
            to,
            subject,
            html
        });

        logger.info('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        // Enhanced error logging
        logger.error('Email sending failed:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            code: error instanceof Error ? (error as any).code : undefined,
            command: error instanceof Error ? (error as any).command : undefined,
            responseCode: error instanceof Error ? (error as any).responseCode : undefined,
            response: error instanceof Error ? (error as any).response : undefined
        });
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