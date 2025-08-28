'use client';

import { User } from "@/types";
import { useRouter } from "next/router";
import { useState } from "react";

interface UserProfile {
    name: string;
    email: string;
    role: string;
    token: string;
}

export default function CustomerDashboard() {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

}