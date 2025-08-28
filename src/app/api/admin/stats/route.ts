// app/api/admin/stats/route.ts
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

        // İstatistikleri getir
        const statsQuery = `
            SELECT 
                COUNT(*) as totalUsers,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as totalAdmins,
                COUNT(CASE WHEN role = 'customer' THEN 1 END) as totalCustomers,
                (
                    SELECT COUNT(*) 
                    FROM tokens 
                    WHERE expires_at > NOW()
                ) as activeTokens
            FROM users
        `;

        const result = await pool.query(statsQuery);

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}