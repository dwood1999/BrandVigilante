import { pool } from '$lib/db';

export async function initializeDatabase() {
    try {
        // Create users table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('[DB] Database tables synchronized successfully');
    } catch (error) {
        console.error('[DB] Failed to synchronize database tables:', error);
        throw error;
    }
} 