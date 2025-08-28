// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { createToken } from '@/lib/jwt';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Kullanıcıyı emaile göre bul
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = userResult.rows[0];

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Şifre kontrolü
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        // JWT token oluştur
        const token = createToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Token'ı veritabanına kaydet
        await pool.query(
            'INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'24 hours\')',
            [user.id, token]
        );

        // Kullanıcı bilgilerini ve token'ı dön
        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}