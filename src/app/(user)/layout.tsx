"use client";

import UserNavbar from "@/components/User/user-navbar";
import { useUser } from "@/hooks/useUser";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useUser();

    return (
        <div className="min-h-screen bg-background">
            <UserNavbar user={user}/>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    )
}
