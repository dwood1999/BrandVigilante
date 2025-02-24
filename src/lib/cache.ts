// Basic in-memory cache implementation
// TODO: Replace with Redis or another production-ready cache solution

interface CacheEntry {
    value: any;
    expiry: number;
}

class Cache {
    private store = new Map<string, CacheEntry>();

    async get(key: string): Promise<any | null> {
        const entry = this.store.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.store.delete(key);
            return null;
        }

        return entry.value;
    }

    async set(key: string, value: any, ttlSeconds: number): Promise<void> {
        this.store.set(key, {
            value,
            expiry: Date.now() + (ttlSeconds * 1000)
        });
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key);
    }

    // Clean up expired entries periodically
    private cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiry) {
                this.store.delete(key);
            }
        }
    }
}

export const cacheManager = new Cache();

// Run cleanup every 5 minutes
setInterval(() => {
    cacheManager.cleanup();
}, 5 * 60 * 1000); 