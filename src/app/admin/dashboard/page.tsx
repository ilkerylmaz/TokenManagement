// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { adminApi } from '@/services/api';
import { getToken } from '@/utils/helper';
import { User } from '@/types';

interface AdminStats {
    totalUsers: number;
    totalAdmins: number;
    totalCustomers: number;
    activeTokens: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalAdmins: 0,
        totalCustomers: 0,
        activeTokens: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                await fetchData();
            } catch (error) {
                console.error('Error:', error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    router.push('/auth/login');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const fetchData = async () => {
        try {
            // Paralel istek at
            const [usersResponse, statsResponse] = await Promise.all([
                adminApi.getUsers(),
                adminApi.getStats()
            ]);

            setUsers(usersResponse.users);
            setStats(statsResponse);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCreateAdmin = async (adminData: { name: string; email: string; password: string }) => {
        try {
            await adminApi.createAdmin(adminData);
            await fetchData(); // Listeyi yenile
        } catch (error) {
            console.error('Error creating admin:', error);
        }
    };

    const handleUpdateUser = async (userId: string, userData: { name?: string; email?: string; role?: string }) => {
        try {
            await adminApi.updateUser(userId, userData);
            await fetchData(); // Listeyi yenile
            setSelectedUser(null); // Modal'ı kapat
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminApi.deleteUser(userId);
                await fetchData(); // Listeyi yenile
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Admin Panel</span>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    router.push('/auth/login');
                                }}
                                className="text-sm text-red-600 hover:text-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm font-medium">Admins</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalAdmins}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm font-medium">Customers</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-gray-500 text-sm font-medium">Active Tokens</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.activeTokens}</p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                        <button
                            onClick={() => setSelectedUser(null)} // Add new admin modal
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Add New Admin
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {/* Handle delete */ }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}