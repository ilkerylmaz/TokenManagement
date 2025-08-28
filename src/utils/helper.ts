import { AuthResponse, LoginCredentials, SignupCredentials } from "@/types";
import axios from "axios";


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

//token kaydetme
export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};

//token'ı çekme
export const getToken = () => {
    return localStorage.getItem('token');
};

//login işlemi
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        const { token, user } = response.data;

        saveToken(token);
        return { token, user };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'login failed');
        }
        throw error;
    }
}
//signup işlemi 
export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post('/api/auth/signup', credentials);
        const { token, user } = response.data;
        saveToken(token);
        return { token, user };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Signup Failed');

        }
        throw error;
    }
}
