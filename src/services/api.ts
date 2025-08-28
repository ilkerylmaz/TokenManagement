// src/services/api.ts
import axios from 'axios';
import { getToken } from '@/utils/helper';

// Axios instance oluştur
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Customer API fonksiyonları
export const customerApi = {
    // Profil bilgilerini getir
    getProfile: async () => {
        const response = await api.get('/api/customer/profile');
        return response.data;
    }
};

// Admin API fonksiyonları
export const adminApi = {
    // Kullanıcıları getir
    getUsers: async () => {
        const response = await api.get('/api/admin/users');
        return response.data;
    },

    // İstatistikleri getir
    getStats: async () => {
        const response = await api.get('/api/admin/stats');
        return response.data;
    },

    // Yeni admin ekle
    createAdmin: async (adminData: { name: string; email: string; password: string }) => {
        const response = await api.post('/api/admin/create', adminData);
        return response.data;
    },

    // Kullanıcı güncelle
    updateUser: async (userId: string, userData: { name?: string; email?: string; role?: string }) => {
        const response = await api.put(`/api/admin/users/${userId}`, userData);
        return response.data;
    },

    // Kullanıcı sil
    deleteUser: async (userId: string) => {
        const response = await api.delete(`/api/admin/users/${userId}`);
        return response.data;
    }
};