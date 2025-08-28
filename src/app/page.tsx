// filepath: d:\Projects\tokenmanagement\src\app\page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-center mb-8">
                        Token Management System
                    </h1>
                </div>

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => router.push('/auth/signup')}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}