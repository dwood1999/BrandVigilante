import { pool } from '$lib/db';
import crypto from 'crypto';
import type { RowDataPacket } from 'mysql2';

interface VerificationTokenRow extends RowDataPacket {
    id: number;
    user_id: number;
    token: string;
    created_at: Date;
    expires_at: Date;
    attempts: number;
}

export class VerificationTokenModel {
    static async create(userId: number): Promise<string> {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        await pool.query(
            'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );

        return token;
    }

    static async findByToken(token: string): Promise<VerificationTokenRow | null> {
        const [rows] = await pool.query<VerificationTokenRow[]>(
            'SELECT * FROM verification_tokens WHERE token = ?',
            [token]
        );
        return rows[0] || null;
    }

    static async incrementAttempts(userId: number): Promise<number> {
        const [result] = await pool.query<VerificationTokenRow[]>(
            'SELECT attempts FROM verification_tokens WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        const attempts = (result[0]?.attempts || 0) + 1;

        await pool.query(
            'UPDATE verification_tokens SET attempts = ? WHERE user_id = ?',
            [attempts, userId]
        );

        return attempts;
    }

    static async delete(token: string): Promise<void> {
        await pool.query('DELETE FROM verification_tokens WHERE token = ?', [token]);
    }
} 