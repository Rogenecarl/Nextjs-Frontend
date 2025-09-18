"use client";

import ProviderApprovedDashboard from "@/components/Provider/approved-dashboard";
import ProviderLayout from "@/components/Provider/layout/ProviderLayout";
import ProviderProfilePending from "@/components/Provider/pending-dashboard";
import WelcomeDashboard from "@/components/Provider/welcome-dashboard";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton"; // Or any loading spinner

export default function ProviderDashboardPage() {
    // 1. Get all states from your hook
    const { user, isLoading, isError } = useUser();

    // 2. Handle the loading state first. This prevents UI flicker.
    if (isLoading) {
        return (
            <ProviderLayout>
                {/* Show a skeleton loader or a spinner */}
                <DashboardSkeleton />
            </ProviderLayout>
        );
    }

    // 3. Handle any potential error state.
    if (isError) {
        return (
            <ProviderLayout>
                <div>Error loading your profile. Please try again.</div>
            </ProviderLayout>
        );
    }

    // 4. Now that we know data is loaded and valid, handle the different provider statuses.
    if (user?.provider?.status === 'pending') {
        return (
            <ProviderLayout>
                <ProviderProfilePending />
            </ProviderLayout>
        );
    }

    if (user?.provider?.status === 'verified') {
        return (
            <ProviderLayout>
                <ProviderApprovedDashboard provider={user.provider} />
            </ProviderLayout>
        );
    }

    // 5. This is the final fallback for any other case (e.g., user has no provider profile).
    return (
        <ProviderLayout>
            <WelcomeDashboard />
        </ProviderLayout>
    );
}

// A simple skeleton component for a good user experience
const DashboardSkeleton = () => (
    <div className="p-8">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-3/4" />
    </div>
);