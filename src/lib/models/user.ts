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
    phone: z.string().optional().nullable(),
    password: z.string().min(8).or(z.literal('')),
    role: z.enum(['user', 'admin', 'lead']).default('user'),
    first_name: z.string(),
    last_name: z.string(),
    email_verified: z.preprocess(
        (val) => (typeof val === 'number' ? val === 1 : val),
        z.boolean().optional().nullable()
    ),
    google_user_id: z.string().optional().nullable(),
    created_at: z.string().datetime({ offset: true }).optional().nullable(),
    updated_at: z.string().datetime({ offset: true }).optional().nullable()
});

// TypeScript type derived from the schema
type User = z.infer<typeof userSchema>;

// Interface for database rows (raw data from DB before Zod parse on read)
interface UserRow extends RowDataPacket {
    id: number;
    email: string;
    phone?: string | null;
    password?: string; // Might not always be selected
    role: 'user' | 'admin' | 'lead';
    first_name: string;
    last_name: string;
    email_verified?: boolean | null;
    google_user_id?: string | null;
    created_at: string; // Expected as ISO string after DATE_FORMAT
    updated_at: string; // Expected as ISO string after DATE_FORMAT
}

export interface PaginatedUsers {
    users: User[]; // Return fully parsed User objects
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

// Define the UserModel class
export class UserModel {
    private static tableName = 'users';

    static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        try {
            logger.debug("=== USER MODEL CREATE START ===", {
                userData: {
                    ...userData,
                    password: userData.password ? '[REDACTED]' : '' // Ensure password is not undefined
                }
            });

            // Validate input, excluding id, created_at, updated_at which are DB-generated or set
            // Also, password for create can be empty string (for OAuth) or needs hashing if provided.
            const schemaForCreate = userSchema.omit({ id: true, created_at: true, updated_at: true });
            const validatedData = schemaForCreate.parse(userData);
            
            logger.debug("=== USER DATA VALIDATED BY SCHEMA (for create) ===", {
                validatedData: {
                    ...validatedData,
                    password: validatedData.password ? '[REDACTED]' : ''
                }
            });
            
            // Hash password if it's provided and not an empty string (for OAuth users)
            let passwordToStore = validatedData.password;
            if (validatedData.password && validatedData.password !== '') {
                passwordToStore = await hashPassword(validatedData.password);
            }

            try {
                const query = `INSERT INTO \`${this.tableName}\` 
                                 (email, phone, password, role, first_name, last_name, email_verified, google_user_id, created_at, updated_at) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
                
                let params: (string | number | boolean | null)[] = [
                    validatedData.email,
                    validatedData.phone ?? null,
                    passwordToStore ?? null,
                    validatedData.role,
                    validatedData.first_name,
                    validatedData.last_name,
                    validatedData.email_verified ?? null,
                    validatedData.google_user_id ?? null
                ];

                params = params.map(p => (p === undefined ? null : p));

                logger.debug("=== EXECUTING USER INSERT QUERY ===", {
                    query: query.replace(/\s+/g, ' '),
                    paramsPreview: {
                        email: params[0], phone: params[1], role: params[3], 
                        password_is_hashed_or_empty: !!params[2],
                        email_verified: params[6]
                    }
                });

                const connection = await pool.getConnection();
                try {
                    await connection.beginTransaction();
                    
                    console.log('Executing SQL Query (Create User):', query.replace(/\s+/g, ' '));
                    console.log('With Parameters (Create User):', params);

                    const [result] = await connection.execute(query, params);
                    const insertId = (result as any).insertId;
                    logger.debug("=== USER INSERTED INTO DATABASE ===", { insertId });

                    const [rows] = await connection.execute(
                        `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at FROM \`${this.tableName}\` WHERE id = ?`,
                        [insertId]
                    );
                    
                    const userRows = rows as UserRow[];
                    if (userRows.length === 0) {
                        await connection.rollback();
                        throw new Error('Failed to retrieve created user immediately after insert.');
                    }
                    const rawNewUser = userRows[0];

                    await connection.commit();
                    logger.debug("=== USER CREATED SUCCESSFULLY (raw data retrieved) ===", { newUserFromDB: rawNewUser });
                    
                    // Validate the fetched user against the full schema before returning
                    const parsedUser = userSchema.parse(rawNewUser);
                    logger.debug("=== PARSED NEW USER WITH ZOD ===", { userId: parsedUser.id, email: parsedUser.email });
                    return parsedUser;

                } catch (dbError) {
                    await connection.rollback();
                    console.error('Raw database error (Create User):', dbError);
                    const err = dbError as any;
                    logger.error("=== DATABASE ERROR DURING USER CREATION ===", { 
                        message: String(err.message), sqlState: err.sqlState, sqlMessage: err.sqlMessage 
                    }); 
                    throw err;
                } finally {
                    connection.release();
                }
            } catch (parseOrDbError) { 
                const err = parseOrDbError as any;
                logger.error("=== USER MODEL CREATE INNER ERROR (Validation/DB) ===", { 
                    message: String(err.message), 
                    input: userData, 
                    isZodError: err.errors // Check if Zod error
                });
                throw err;
            }
        } catch (outerError) { 
            logger.error("=== USER MODEL CREATE OUTER UNEXPECTED ERROR ===", { 
                message: String(outerError), 
                input: userData 
            });
            throw outerError;
        }
    }

    static async findById(id: number): Promise<User | null> {
        const [rows] = await pool.execute(
             `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at FROM \`${this.tableName}\` WHERE id = ?`,
            [id]
        );
        const userRows = rows as UserRow[];
        if (userRows.length === 0) return null;
        return userSchema.parse(userRows[0]);
    }

    static async findByEmail(email: string): Promise<User | null> {
        logger.debug('[UserModel.findByEmail] Looking up user by email:', { email });
        try {
            const query =  `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at FROM \`${this.tableName}\` WHERE email = ?`;
            const [rows] = await pool.execute(query, [email]);
            const userRows = rows as UserRow[];
            if (userRows.length === 0) return null;
            const parsedUser = userSchema.parse(userRows[0]);
            logger.debug('[UserModel.findByEmail] Query result:', { email, userFound: !!parsedUser, userId: parsedUser?.id });
            return parsedUser;
        } catch (error) {
            logger.error('[UserModel.findByEmail] Full Error Context:', { message: String(error), email }); 
            throw error; 
        }
    }

    static async findByGoogleId(googleId: string): Promise<User | null> {
        const [rows] = await pool.execute(
             `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at FROM \`${this.tableName}\` WHERE google_user_id = ?`,
            [googleId]
        );
        const userRows = rows as UserRow[];
        if (userRows.length === 0) return null;
        return userSchema.parse(userRows[0]);
    }

    static async update(id: number, userData: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | null> {
        const schemaForUpdate = userSchema.partial().omit({ id: true, created_at: true, email: true });
        const validatedInputData = schemaForUpdate.parse(userData);

        if (Object.keys(validatedInputData).length === 0 && !Object.prototype.hasOwnProperty.call(userData, 'updated_at')) {
            logger.debug("UserModel.update: No valid fields to update (excluding updated_at unless explicitly provided).", { input: userData });
            if (!Object.prototype.hasOwnProperty.call(userData, 'updated_at') && Object.keys(validatedInputData).length === 0) {
                 return this.findById(id); 
            }
        }
        
        let passwordToUpdate: string | undefined = undefined;
        if (validatedInputData.password && validatedInputData.password !== '') {
            passwordToUpdate = await hashPassword(validatedInputData.password);
        }

        const dataToUpdate: Record<string, any> = { ...validatedInputData };
        if (passwordToUpdate) {
            dataToUpdate.password = passwordToUpdate;
        } else {
            delete dataToUpdate.password; // Don't try to set password if it wasn't provided or was empty
        }
        
        // Ensure updated_at is always set, unless it's the only thing and was not in input
        // If other fields are being updated, always touch updated_at.
        // If updated_at is explicitly passed, use that value.
        // Otherwise, if there are other fields to update, set updated_at to NOW().
        
        const fieldsToUpdateInDb = Object.keys(dataToUpdate).filter(key => key !== 'updated_at');

        if (fieldsToUpdateInDb.length > 0 && !Object.prototype.hasOwnProperty.call(dataToUpdate, 'updated_at')) {
            // Only add updated_at = NOW() if other fields are being changed and updated_at isn't already specified
        } else if (fieldsToUpdateInDb.length === 0 && !Object.prototype.hasOwnProperty.call(userData, 'updated_at')) {
            // No actual data fields to update, and updated_at wasn't explicitly in the input.
            // This case is tricky, if findById was already called, this is redundant.
            // If this was reached because only 'password' was empty string, then we should still proceed if updated_at was intended.
            // For now, if fieldsToUpdateInDb is empty AND updated_at is not in original userData, return current user.
             logger.debug("UserModel.update: No actual data fields to update and updated_at not explicitly provided. Returning current user.", { userId: id });
             return this.findById(id);
        }


        // Prepare for SQL query construction
        const fields = Object.keys(dataToUpdate).filter(key => dataToUpdate[key] !== undefined && key !== 'updated_at');
        
        if (fields.length === 0 && !Object.prototype.hasOwnProperty.call(userData, 'updated_at')) {
             logger.debug("UserModel.update: No fields to update after filtering undefined (and not explicitly setting updated_at). Returning user.", { userId: id });
            return this.findById(id);
        }

        try {
          logger.debug("=== USER MODEL UPDATE START ===", { id, userData: validatedInputData });

          // Filter out undefined values explicitly, except for fields that can be set to null
          const finalDataToUpdate: Record<string, any> = {};
          const allowedNullFields = ['phone', 'google_user_id', 'email_verified']; // Add other fields that can be explicitly set to null

          for (const key of Object.keys(dataToUpdate)) {
              if (dataToUpdate[key] !== undefined) {
                  finalDataToUpdate[key] = dataToUpdate[key];
              } else if (dataToUpdate[key] === undefined && allowedNullFields.includes(key) && Object.prototype.hasOwnProperty.call(userData, key)) {
                  // if userData explicitly set a field to undefined, and it's an allowedNullField, respect it as null
                  finalDataToUpdate[key] = null; 
              }
          }
          
          const setFields = Object.keys(finalDataToUpdate).filter(k => k !== 'updated_at');
          
          if (setFields.length === 0 && !Object.prototype.hasOwnProperty.call(userData, 'updated_at')) {
            logger.warn("UserModel.update: No fields to update after final filtering. This shouldn't usually happen if initial checks passed.", { id });
            return this.findById(id);
          }

          const setClause = setFields.map(field => `\`${field}\` = ?`).join(', ');
          const values = setFields.map(field => finalDataToUpdate[field]);
  
          let queryBase = `UPDATE \`${this.tableName}\` SET ${setClause}`;

          if (Object.prototype.hasOwnProperty.call(userData, 'updated_at') && userData.updated_at) {
              queryBase += `, updated_at = ?`;
              values.push(new Date(userData.updated_at).toISOString());
          }

          logger.debug("=== EXECUTING USER UPDATE QUERY ===", { id, setClause, updatePayload: finalDataToUpdate });

          await pool.execute(
              `${queryBase} WHERE \`id\` = ?`,
              [...values, id]
          );

          return this.findById(id);
      } catch (error) {
          logger.error("=== USER MODEL UPDATE ERROR ===", { message: String(error), id, userData: validatedInputData });
          throw error;
      }
  }

  static async delete(id: number): Promise<boolean> {
      const [result] = await pool.execute(
          `DELETE FROM \`${this.tableName}\` WHERE \`id\` = ?`,
          [id]
      );
      return (result as any).affectedRows > 0;
  }

  static async findAll(page = 1, limit = 10): Promise<{ users: User[]; totalPages: number }> {
      const offset = (page - 1) * limit;
      const [rows] = await pool.execute(
          `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at FROM \`${this.tableName}\` ORDER BY id DESC LIMIT ? OFFSET ?`,
          [limit, offset]
      );
      const [totalResult] = await pool.execute(
          `SELECT COUNT(*) as total FROM \`${this.tableName}\``
      );
      const totalCount = (totalResult as any)[0].total;
      const totalPages = Math.ceil(totalCount / limit);
      const userRows = rows as UserRow[];
      return {
          users: userRows.map(row => userSchema.parse(row)),
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

      let whereConditions: string[] = [];
      const queryParams: any[] = [];

      if (search) {
          whereConditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
          queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      if (role) {
          whereConditions.push(`role = ?`);
          queryParams.push(role);
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      const [countResult] = await pool.query<RowDataPacket[]> (
          `SELECT COUNT(*) as total FROM \`${this.tableName}\` ${whereClause}`,
          queryParams
      );
      const total = countResult[0].total as number;

      const finalQueryParams = [...queryParams, perPage, offset];
      const [userRowsFromDb] = await pool.query<UserRow[]> (
          `SELECT *, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at FROM \`${this.tableName}\` ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          finalQueryParams
      );

      return {
          users: userRowsFromDb.map(row => userSchema.parse(row)),
          total,
          page,
          perPage,
          totalPages: Math.ceil(total / perPage)
      };
  }

  static async count(): Promise<number> {
      try {
          const [result] = await pool.query<RowDataPacket[]> (
              `SELECT COUNT(*) as count FROM \`${this.tableName}\``
          );
          return parseInt(result[0].count as string);
      } catch (error) {
          logger.error('Error in UserModel.count:', error);
          throw error;
      }
  }

  static async findByBrandId(brandId: number): Promise<User[]> { 
      try {
          const [userRowsFromDb] = await pool.query<UserRow[]> (
              `SELECT u.*, DATE_FORMAT(u.created_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS created_at, DATE_FORMAT(u.updated_at, '%Y-%m-%dT%H:%i:%s.%fZ') AS updated_at \
               FROM \`${this.tableName}\` u \
               JOIN \`brands_user\` bu ON u.id = bu.user_id \
               WHERE bu.brand_id = ? \
               ORDER BY u.first_name, u.last_name`,
              [brandId]
          );
          return userRowsFromDb.map(row => userSchema.parse(row));
      } catch (error) {
          logger.error('Error in UserModel.findByBrandId:', error);
          throw error;
      }
  }

  static async createPasswordResetToken(userId: string): Promise<string> {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await pool.execute(
          `INSERT INTO \`password_reset_tokens\` (user_id, token, expires_at)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE
           token = VALUES(token), expires_at = VALUES(expires_at), created_at = NOW()`,
          [userId, token, expiresAt]
      );

      return token;
  }

  static async validatePasswordResetToken(token: string): Promise<string | null> {
      const [rows] = await pool.execute(
          `SELECT user_id FROM \`password_reset_tokens\`
           WHERE token = ? AND expires_at > NOW()`,
          [token]
      );

      if ((rows as any[]).length === 0) {
          return null;
      }

      return (rows as any[])[0].user_id as string;
  }

  static async deletePasswordResetToken(token: string): Promise<void> {
      await pool.execute(
          `DELETE FROM \`password_reset_tokens\` WHERE token = ?`,
          [token]
      );
  }

  static async updatePassword(userId: string, newPassword: string): Promise<void> {
      const hashedPassword = await hashPassword(newPassword);
      await pool.execute(
          `UPDATE \`${this.tableName}\` SET password = ? WHERE id = ?`,
          [hashedPassword, userId]
      );
  }
}

export { type User };
