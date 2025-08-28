export interface User {
    id: string;
    email: string;
    password: string;
    role: 'admin' | 'customer';
    name: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    name: string;
    role: string | 'admin' | 'customer';
}