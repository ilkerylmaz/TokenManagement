// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
    try {
        // Token kontrolü
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Token'ı doğrula ve admin kontrolü yap
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Tüm kullanıcıları getir
        const query = `
            SELECT id, name, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;

        const result = await pool.query(query);

        return NextResponse.json({ users: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}