"use client";

import ProfileNavLinks from "@/components/Provider/profile-subnavbar";
import ProviderNavbar from "@/components/Provider/provider-navbar";

// This layout will wrap all the child pages (profile, services, etc.)
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (

        <>
            <ProviderNavbar />
            {/* The content of the actual page will be rendered here */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <ProfileNavLinks />
                {children}
            </main>
        </>
    );
}