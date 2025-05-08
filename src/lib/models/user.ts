import { pool } from '$lib/db';
import { z } from 'zod';
import type { RowDataPacket } from 'mysql2';
import { logger } from '$lib/logger';
import crypto from 'crypto';
import { hashPassword } from '$lib/server/auth';

// Define the User schema using Zod for validation
const userSchema = z.object({
    id: z.number().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8).or(z.literal('')),
    role: z.enum(['user', 'admin', 'lead']).default('user'),
    first_name: z.string(),
    last_name: z.string(),
    email_verified: z.boolean().optional(),
    google_user_id: z.string().optional()
});

// TypeScript type derived from the schema
type User = z.infer<typeof userSchema>;

// Interface for database rows
interface UserRow extends RowDataPacket, User {}

export interface PaginatedUsers {
    users: UserRow[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

// Define the UserModel class
export class UserModel {
    private static tableName = 'users';

    static async create(userData: Omit<User, 'id'>): Promise<User> {
        try {
            logger.debug("=== USER MODEL CREATE START ===", {
                userData: {
                    ...userData,
                    password: userData.password ? '[REDACTED]' : undefined
                }
            });

            const validatedData = userSchema.omit({ id: true }).parse(userData);
            logger.debug("=== USER DATA VALIDATED BY SCHEMA ===", {
                validatedData: {
                    ...validatedData,
                    password: validatedData.password ? '[REDACTED]' : undefined
                }
            });

            try {
                const query = `INSERT INTO ${this.tableName} (email, phone, password, role, first_name, last_name, email_verified, google_user_id) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                let params = [
                    validatedData.email,
                    validatedData.phone,
                    validatedData.password,
                    validatedData.role,
                    validatedData.first_name,
                    validatedData.last_name,
                    validatedData.email_verified,
                    validatedData.google_user_id
                ];

                // Ensure all undefined parameters are converted to null
                params = params.map(p => p === undefined ? null : p);

                logger.debug("=== EXECUTING USER INSERT QUERY ===", {
                    query: query,
                    params: {
                        ...params.reduce((acc, val, i) => ({ ...acc, [`param${i + 1}`]: val }), {}),
                        password: validatedData.password ? '[REDACTED]' : null
                    }
                });

                // Get a connection from the pool
                const connection = await pool.getConnection();
                try {
                    // Start transaction
                    await connection.beginTransaction();
                    
                    // Log the query and params directly to console
                    console.log('Executing SQL Query:', query);
                    console.log('With Parameters (undefined converted to null):', params);

                    // Execute the insert
                    const [result] = await connection.execute(query, params);
                    
                    // Get the insert ID
                    const insertId = (result as any).insertId;
                    logger.debug("=== USER INSERTED INTO DATABASE ===", { insertId });

                    // Try to retrieve the user
                    const [rows] = await connection.execute(
                        `SELECT * FROM ${this.tableName} WHERE id = ?`,
                        [insertId]
                    );
                    
                    const newUser = (rows as User[])[0];
                    if (!newUser) {
                        throw new Error('Failed to retrieve created user');
                    }

                    // Commit the transaction
                    await connection.commit();
                    
                    logger.debug("=== USER CREATED SUCCESSFULLY ===", {
                        userId: newUser.id,
                        email: newUser.email
                    });

                    return newUser;
                } catch (dbError) {
                    // Rollback the transaction
                    await connection.rollback();
                    
                    // Log the raw error immediately
                    console.error('Raw database error:', dbError);
                    
                    // Log detailed error information
                    logger.error("=== DATABASE ERROR DURING USER CREATION ===", {
                        error: dbError instanceof Error ? dbError.message : String(dbError),
                        stack: dbError instanceof Error ? dbError.stack : undefined,
                        code: (dbError as any).code,
                        errno: (dbError as any).errno,
                        sqlState: (dbError as any).sqlState,
                        sqlMessage: (dbError as any).sqlMessage,
                        sql: (dbError as any).sql,
                        errorType: dbError?.constructor?.name,
                        errorName: dbError instanceof Error ? dbError.name : undefined,
                        errorCause: dbError instanceof Error ? dbError.cause : undefined,
                        // Log the actual values being inserted (excluding password)
                        insertValues: {
                            email: validatedData.email,
                            phone: validatedData.phone,
                            role: validatedData.role,
                            first_name: validatedData.first_name,
                            last_name: validatedData.last_name,
                            email_verified: validatedData.email_verified,
                            google_user_id: validatedData.google_user_id
                        }
                    });

                    // Also log the error to stderr for immediate visibility
                    process.stderr.write(`Database Error: ${JSON.stringify(dbError, null, 2)}\n`);
                    
                    throw dbError;
                } finally {
                    // Always release the connection
                    connection.release();
                }
            } catch (error) {
                logger.error("=== USER MODEL CREATE ERROR ===", {
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                    cause: error instanceof Error ? error.cause : undefined,
                    name: error instanceof Error ? error.name : undefined,
                    userData: {
                        ...userData,
                        password: userData.password ? '[REDACTED]' : undefined
                    }
                });
                throw error;
            }
        } catch (error) {
            logger.error("=== USER MODEL CREATE ERROR ===", {
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                cause: error instanceof Error ? error.cause : undefined,
                name: error instanceof Error ? error.name : undefined,
                userData: {
                    ...userData,
                    password: userData.password ? '[REDACTED]' : undefined
                }
            });
            throw error;
        }
    }

    static async findById(id: number): Promise<User | null> {
        const [rows] = await pool.execute(
            `SELECT * FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return (rows as User[])[0] || null;
    }

    static async findByEmail(email: string): Promise<User | null> {
        logger.debug('[UserModel.findByEmail] Looking up user by email:', { email });
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
            logger.debug('[UserModel.findByEmail] Executing query:', { query, params: [email] });
            const [rows] = await pool.execute(query, [email]);
            const user = (rows as User[])[0] || null;
            logger.debug('[UserModel.findByEmail] Query result:', { email, userFound: !!user, userId: user?.id });
            return user;
        } catch (error) {
            const errorContext = {
                errorObject: error,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
                errorType: error?.constructor?.name,
                method: 'UserModel.findByEmail',
                email
            };
            // Explicitly log message and stack using console.error
            console.error('[UserModel.findByEmail] CAUGHT ERROR - Message:', errorContext.errorMessage);
            if (errorContext.errorStack) {
                console.error('[UserModel.findByEmail] CAUGHT ERROR - Stack Trace:', errorContext.errorStack);
            }
            // Log the full context object using the logger for potentially better formatting
            logger.error('[UserModel.findByEmail] Full Error Context:', errorContext); 
            // Re-throw the error so the action catch block can handle the user-facing response
            throw error; 
        }
    }

    static async findByGoogleId(googleId: string): Promise<User | null> {
        const [rows] = await pool.execute(
            `SELECT * FROM ${this.tableName} WHERE google_user_id = ?`,
            [googleId]
        );
        return (rows as User[])[0] || null;
    }

    static async update(id: number, userData: Partial<User>): Promise<User | null> {
        const validatedData = userSchema.partial().parse(userData);
        const fields = Object.keys(validatedData);
        if (fields.length === 0) return null;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const values = fields.map(field => validatedData[field as keyof typeof validatedData]);

        await pool.execute(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
            [...values, id]
        );
        const updatedUser = await this.findById(id);
        if (!updatedUser) throw new Error('Failed to update user');
        return updatedUser;
    }

    static async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute(
            `DELETE FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return (result as any).affectedRows > 0;
    }

    static async findAll(page = 1, limit = 10): Promise<{ users: User[]; totalPages: number }> {
        const offset = (page - 1) * limit;
        const [rows] = await pool.execute(
            `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        const [total] = await pool.execute(
            `SELECT COUNT(*) as total FROM ${this.tableName}`
        );
        const totalPages = Math.ceil((total as any)[0].total / limit);
        return {
            users: rows as User[],
            totalPages
        };
    }

    static async list(options: {
        page: number;
        perPage: number;
        search?: string;
        role?: 'admin' | 'user' | 'lead';
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

    static async count(): Promise<number> {
        try {
            const [result] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(*) as count FROM users'
            );
            return parseInt(result[0].count);
        } catch (error) {
            logger.error('Error in UserModel.count:', error);
            throw error;
        }
    }

    static async findByBrandId(brandId: number): Promise<UserRow[]> {
        try {
            const [users] = await pool.query<UserRow[]>(
                `SELECT u.id, u.email, u.phone, u.role, u.first_name, u.last_name, 
                        u.created_at, u.email_verified 
                 FROM users u 
                 JOIN brands_user bu ON u.id = bu.user_id 
                 WHERE bu.brand_id = ? 
                 ORDER BY u.first_name, u.last_name`,
                [brandId]
            );
            return users;
        } catch (error) {
            logger.error('Error in UserModel.findByBrandId:', error);
            throw error;
        }
    }

    static async createPasswordResetToken(userId: string): Promise<string> {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

        await pool.execute(
            `INSERT INTO password_reset_tokens (user_id, token, expires_at)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
             token = VALUES(token), expires_at = VALUES(expires_at), created_at = NOW()`,
            [userId, token, expiresAt]
        );

        return token;
    }

    static async validatePasswordResetToken(token: string): Promise<string | null> {
        const [rows] = await pool.execute(
            `SELECT user_id FROM password_reset_tokens
             WHERE token = ? AND expires_at > NOW()`,
            [token]
        );

        if ((rows as any[]).length === 0) {
            return null;
        }

        return (rows as any[])[0].user_id;
    }

    static async deletePasswordResetToken(token: string): Promise<void> {
        await pool.execute(
            `DELETE FROM password_reset_tokens WHERE token = ?`,
            [token]
        );
    }

    static async updatePassword(userId: string, newPassword: string): Promise<void> {
        const hashedPassword = await hashPassword(newPassword);
        await pool.execute(
            `UPDATE users SET password = ? WHERE id = ?`,
            [hashedPassword, userId]
        );
    }
}

export { type User }; 