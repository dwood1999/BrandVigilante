import { dev } from '$app/environment';

export const sessionConfig = {
    cookieName: 'session',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    secure: !dev, // Only require HTTPS in production
    httpOnly: true,
    sameSite: 'lax' as const, // 'lax' is more practical than 'strict' for most apps
    path: '/'
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; timestamp: number }>();

export function checkLoginRateLimit(identifier: string): boolean {
    const now = Date.now();
    const attempts = loginAttempts.get(identifier);

    if (!attempts || now - attempts.timestamp > RATE_LIMIT_WINDOW) {
        loginAttempts.set(identifier, { count: 1, timestamp: now });
        return true;
    }

    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        return false;
    }

    attempts.count++;
    return true;
}

// Clean up expired rate limit entries
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of loginAttempts.entries()) {
        if (now - data.timestamp > RATE_LIMIT_WINDOW) {
            loginAttempts.delete(key);
        }
    }
}, RATE_LIMIT_WINDOW);

// Add session validation helper
export function validateSession(userId: string | undefined): boolean {
    if (!userId) return false;
    try {
        const id = parseInt(userId);
        return !isNaN(id) && id > 0;
    } catch {
        return false;
    }
} 