// src/scripts/generate-hash.ts
import bcrypt from 'bcrypt';

const password = '1234';
bcrypt.hash(password, 10).then(hash => {
    console.log('Kullanabileceğiniz hash:', hash);
});