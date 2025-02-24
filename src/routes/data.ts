import type { RequestHandler } from './$types';
import pool from '$lib/db';
import { error } from '@sveltejs/kit';

interface User {
  id: string;
  email: string;
  role: string;
}

export const GET: RequestHandler = async ({ locals }) => {
  try {
    // Check authentication
    if (!locals.user) {
      throw error(401, 'Unauthorized');
    }

    const [rows] = await pool.query<User[]>('SELECT id, email, role FROM users');
    
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err) {
    console.error('Database query failed:', err);
    
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    
    throw error(500, 'Internal Server Error');
  }
};
