import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
    try {
        // Token'ı al
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Kullanıcı bilgilerini getir
        const result = await pool.query(
            'SELECT id, name, email, role FROM users WHERE id = $1',
            [decodedToken.userId]
        );

        const user = result.rows[0];
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
