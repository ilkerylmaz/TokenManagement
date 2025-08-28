// lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = '24h'; // Token geçerlilik süresi

interface JWTPayload {
    userId: string;
    email: string;
    role: 'admin' | 'customer';
}

export const createToken = (payload: JWTPayload): string => {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    } catch (error) {
        console.error('Token creation error:', error);
        throw new Error('Error creating token');
    }
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};

export const decodeToken = (token: string): JWTPayload | null => {
    try {
        return jwt.decode(token) as JWTPayload;
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
};

// Token'ın geçerlilik süresini kontrol et
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwt.decode(token) as { exp: number };
        if (!decoded.exp) return true;

        // exp, Unix timestamp olarak gelir (saniye cinsinden)
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};