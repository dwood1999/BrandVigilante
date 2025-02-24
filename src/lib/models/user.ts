import type { RowDataPacket } from 'mysql2';
import { pool } from '$lib/db';
import { z } from 'zod'; // You already have zod as a dependency

// Define the User schema using Zod for validation
const UserSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    password: z.string(),
    phone: z.string().nullable(),
    role: z.enum(['admin', 'user']).default('user'),
    created_at: z.string().or(z.date())
});

// TypeScript type derived from the schema
export type User = z.infer<typeof UserSchema>;

// Interface for database rows
export interface UserRow extends RowDataPacket {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    role: 'admin' | 'user';
    created_at: Date;
    email_verified: boolean;
}

export interface PaginatedUsers {
    users: UserRow[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

// User model class with static methods for database operations
export class UserModel {
    static async findAll(): Promise<User[]> {
        const [rows] = await pool.query<UserRow[]>(
            'SELECT id, email, phone, role, created_at FROM users'
        );
        return rows.map(row => ({
            ...row,
            created_at: row.created_at.toISOString()
        }));
    }

    static async findById(id: number): Promise<UserRow | null> {
        const [rows] = await pool.query<UserRow[]>(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    static async findByEmail(email: string): Promise<UserRow | null> {
        const [rows] = await pool.query<UserRow[]>(
            'SELECT * FROM users WHERE email = ?',
            [email.toLowerCase()]
        );
        return rows[0] || null;
    }

    static async create(userData: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        phone: string;
        role: 'admin' | 'user';
    }): Promise<UserRow> {
        const [result] = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [
                userData.first_name,
                userData.last_name,
                userData.email.toLowerCase(),
                userData.password,
                userData.phone,
                userData.role
            ]
        );

        const newUser = await this.findById((result as any).insertId);
        if (!newUser) throw new Error('Failed to create user');
        return newUser;
    }

    static async update(id: number, userData: Partial<UserRow>): Promise<UserRow> {
        // Build the SET clause dynamically
        const updates = Object.entries(userData)
            .filter(([_, value]) => value !== undefined) // Only include defined values
            .map(([key, _]) => `${key} = ?`);
        
        const values = Object.entries(userData)
            .filter(([_, value]) => value !== undefined)
            .map(([_, value]) => value);

        const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id);

        await pool.query(sql, values);

        const updatedUser = await this.findById(id);
        if (!updatedUser) throw new Error('Failed to update user');
        return updatedUser;
    }

    static async delete(id: number): Promise<void> {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
    }

    static async list(options: {
        page: number;
        perPage: number;
        search?: string;
        role?: 'admin' | 'user';
    }): Promise<PaginatedUsers> {
        const { page, perPage, search, role } = options;
        const offset = (page - 1) * perPage;

        let whereClause = '';
        const whereParams: any[] = [];

        if (search) {
            whereClause = 'WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)';
            whereParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (role) {
            whereClause = whereClause ? `${whereClause} AND role = ?` : 'WHERE role = ?';
            whereParams.push(role);
        }

        // Get total count
        const [countResult] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) as total FROM users ${whereClause}`,
            whereParams
        );
        const total = countResult[0].total;

        // Get paginated users
        const [users] = await pool.query<UserRow[]>(
            `SELECT * FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...whereParams, perPage, offset]
        );

        return {
            users,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage)
        };
    }
} 