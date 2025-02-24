import { z } from 'zod';
import argon2 from 'argon2';
import { dev } from '$app/environment';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Track login attempts
const loginAttempts = new Map<string, { count: number; timestamp: number }>();

// Rate limiting function
export function checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = loginAttempts.get(identifier);

    if (!userAttempts || (now - userAttempts.timestamp) > RATE_LIMIT_WINDOW) {
        loginAttempts.set(identifier, { count: 1, timestamp: now });
        return true;
    }

    if (userAttempts.count >= MAX_ATTEMPTS) {
        return false;
    }

    userAttempts.count++;
    return true;
}

// Validation schemas
export const SignUpSchema = z.object({
    first_name: z.string()
        .min(1, 'First name is required')
        .max(50, 'First name cannot exceed 50 characters'),
    last_name: z.string()
        .min(1, 'Last name is required')
        .max(50, 'Last name cannot exceed 50 characters'),
    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    phone: z.string()
        .min(10, 'Phone number is required')
        .transform(val => val.replace(/\D/g, '')),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const SignInSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(1, 'Password is required'),
});

// Password hashing configuration
const hashingConfig = {
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
    type: argon2.argon2id
};

// Password functions
export const hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password, hashingConfig);
};

export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
    if (!hash?.trim() || !password?.trim()) {
        return false;
    }
    try {
        return await argon2.verify(hash, password, hashingConfig);
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
};

// Add CSRF protection
export const csrfConfig = {
    checkOrigin: true,
    allowedOrigins: [process.env.APP_URL || 'http://localhost:5173']
};

// Improve session security
export const sessionConfig = {
    cookieName: 'session',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined
};

// Add rate limiting with memory cleanup
const RATE_LIMIT_CLEANUP_INTERVAL = 15 * 60 * 1000; // 15 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of loginAttempts.entries()) {
        if (now - data.timestamp > RATE_LIMIT_WINDOW) {
            loginAttempts.delete(key);
        }
    }
}, RATE_LIMIT_CLEANUP_INTERVAL);

// Auth types
export interface AuthSession {
    userId: number;
    email: string;
    role: string;
} 