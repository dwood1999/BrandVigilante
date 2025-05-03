import { pool } from '$lib/db';
import { executeQuery } from '$lib/db-utils';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { logger } from '$lib/logger';

interface LIHTCProjectRow extends RowDataPacket {
    id: number;
    name: string;
    address: string;
    lihtc_type: string;
    closing_date: string;
    milestones: string;
    predevelopment_status: string;
    real_estate_status: string;
}

export interface LIHTCProject {
    id: number;
    name: string;
    address: string;
    lihtcType: string;
    closingDate: string;
    milestones: Record<string, any>;
    predevelopmentStatus: Record<string, any>;
    realEstateStatus: Record<string, any>;
}

function convertRowToLIHTCProject(row: LIHTCProjectRow): LIHTCProject {
    return {
        id: row.id,
        name: row.name,
        address: row.address,
        lihtcType: row.lihtc_type,
        closingDate: row.closing_date,
        milestones: JSON.parse(row.milestones),
        predevelopmentStatus: JSON.parse(row.predevelopment_status),
        realEstateStatus: JSON.parse(row.real_estate_status)
    };
}

export class LIHTCProjectModel {
    static async findById(id: number): Promise<LIHTCProject | null> {
        try {
            const rows = await executeQuery<LIHTCProjectRow[]>(
                'SELECT * FROM LIHTC_projects WHERE id = ?',
                [id]
            );
            return rows.length ? convertRowToLIHTCProject(rows[0]) : null;
        } catch (error) {
            logger.error('Error in LIHTCProjectModel.findById', { id }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async findAll(): Promise<LIHTCProject[]> {
        try {
            const rows = await executeQuery<LIHTCProjectRow[]>(
                'SELECT * FROM LIHTC_projects ORDER BY name'
            );
            return rows.map(convertRowToLIHTCProject);
        } catch (error) {
            logger.error('Error in LIHTCProjectModel.findAll', {}, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async create(data: {
        name: string;
        address: string;
        lihtcType: string;
        closingDate: string;
        milestones: Record<string, any>;
        predevelopmentStatus: Record<string, any>;
        realEstateStatus: Record<string, any>;
    }): Promise<LIHTCProject> {
        try {
            const result = await executeQuery<ResultSetHeader>(
                'INSERT INTO LIHTC_projects (name, address, lihtc_type, closing_date, milestones, predevelopment_status, real_estate_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    data.name,
                    data.address,
                    data.lihtcType,
                    data.closingDate,
                    JSON.stringify(data.milestones),
                    JSON.stringify(data.predevelopmentStatus),
                    JSON.stringify(data.realEstateStatus)
                ]
            );

            const rows = await executeQuery<LIHTCProjectRow[]>(
                'SELECT * FROM LIHTC_projects WHERE id = ?',
                [result.insertId]
            );

            if (!rows.length) {
                throw new Error('Failed to create LIHTC project');
            }

            return convertRowToLIHTCProject(rows[0]);
        } catch (error) {
            logger.error('Error in LIHTCProjectModel.create', { data }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async update(id: number, data: {
        name?: string;
        address?: string;
        lihtcType?: string;
        closingDate?: string;
        milestones?: Record<string, any>;
        predevelopmentStatus?: Record<string, any>;
        realEstateStatus?: Record<string, any>;
    }): Promise<LIHTCProject | null> {
        try {
            const updates: string[] = [];
            const values: (string | number)[] = [];

            if (data.name !== undefined) {
                updates.push('name = ?');
                values.push(data.name);
            }
            if (data.address !== undefined) {
                updates.push('address = ?');
                values.push(data.address);
            }
            if (data.lihtcType !== undefined) {
                updates.push('lihtc_type = ?');
                values.push(data.lihtcType);
            }
            if (data.closingDate !== undefined) {
                updates.push('closing_date = ?');
                values.push(data.closingDate);
            }
            if (data.milestones !== undefined) {
                updates.push('milestones = ?');
                values.push(JSON.stringify(data.milestones));
            }
            if (data.predevelopmentStatus !== undefined) {
                updates.push('predevelopment_status = ?');
                values.push(JSON.stringify(data.predevelopmentStatus));
            }
            if (data.realEstateStatus !== undefined) {
                updates.push('real_estate_status = ?');
                values.push(JSON.stringify(data.realEstateStatus));
            }

            if (updates.length === 0) {
                return this.findById(id);
            }

            values.push(id);

            await executeQuery<ResultSetHeader>(
                `UPDATE LIHTC_projects SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return this.findById(id);
        } catch (error) {
            logger.error('Error in LIHTCProjectModel.update', { id, data }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const result = await executeQuery<ResultSetHeader>(
                'DELETE FROM LIHTC_projects WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            logger.error('Error in LIHTCProjectModel.delete', { id }, error instanceof Error ? error : new Error(String(error)));
            throw error;
        }
    }
} 