// lib/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres', // Docker compose'da belirlediğiniz kullanıcı adı
    host: 'localhost', // Docker container host
    database: 'postgres', // Veritabanı adı
    password: '12345', // Docker compose'da belirlediğiniz şifre
    port: 5432 // Docker'da expose ettiğiniz port
});

const testConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('PostgreSQL Bağlantısı Başarılı:', res.rows[0]);
    } catch (err) {
        console.error('Bağlantı Hatası:', err);
    }
};

testConnection();