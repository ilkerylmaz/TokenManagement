'use client';


import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getToken } from '@/utils/helper';


interface UserProfile {
    name: string;
    email: string;
    role: string;
    token: string;
}

export default function CustomerDashboard() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();

            if (!token) {
                router.push('/auth/login');
                return;
            }

            //örnek api( kendi apimizi tasarladıktan sonra burada kullanacağız! )
            setUserProfile({
                name: "ilker",
                email: "ilker@hotmail.com",
                role: "customer",
                token: token
            });
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Customer Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    // Token'ı sil ve login'e yönlendir
                                    localStorage.removeItem('token');
                                    router.push('/auth/login');
                                }}
                                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Profile Section */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <p className="mt-1 text-sm text-gray-900">{userProfile?.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{userProfile?.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-sm text-gray-900">{userProfile?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Token Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Token</h2>
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-mono break-all">{userProfile?.token}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        This is your authentication token. Keep it secure and do not share it with anyone.
                    </p>
                </div>
            </main>
        </div>
    );

}