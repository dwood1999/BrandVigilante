import argon2 from 'argon2';
import { dev } from '$app/environment';
import { logger } from '$lib/logger';

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

// Session validation
export function validateSession(userId: string | undefined): boolean {
    logger.debug('Validating session ID', { 
        userId,
        userIdType: typeof userId,
        userIdLength: userId?.length,
        isNumeric: userId ? /^\d+$/.test(userId) : false
    });
    if (!userId) {
        logger.debug('No user ID provided');
        return false;
    }
    const isValid = /^\d+$/.test(userId);
    logger.debug('Session ID validation result', { 
        userId, 
        isValid,
        userIdType: typeof userId,
        userIdLength: userId.length
    });
    return isValid;
}

// Password hashing configuration
const hashingConfig: argon2.Options = {
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

// Improve session security
export const sessionConfig = {
    cookieName: 'session',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: !dev, // Only require HTTPS in production
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/'
}; 