// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { createToken } from '@/lib/jwt';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // 1. Email kontrolü
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { error: 'Bu email zaten kullanımda' },
                { status: 400 }
            );
        }

        // 2. Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Yeni kullanıcı oluştur (default role: customer)
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, 'customer') 
             RETURNING id, name, email, role`,
            [name, email, hashedPassword]
        );

        // 4. Token oluştur
        const token = createToken({
            userId: newUser.rows[0].id,
            email: newUser.rows[0].email,
            role: newUser.rows[0].role
        });

        // 5. Token'ı veritabanına kaydet
        await pool.query(
            `INSERT INTO tokens (user_id, token, expires_at) 
             VALUES ($1, $2, NOW() + INTERVAL '24 hours')`,
            [newUser.rows[0].id, token]
        );

        // 6. Kullanıcı bilgilerini ve token'ı dön
        return NextResponse.json({
            user: newUser.rows[0],
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}