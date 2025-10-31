"use client";

import ProviderApprovedDashboard from "@/components/Provider/approved-dashboard";
import ProviderProfilePending from "@/components/Provider/pending-dashboard";
import WelcomeDashboard from "@/components/Provider/welcome-dashboard";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton"; // Or any loading spinner

export default function ProviderDashboardPage() {
  // 1. Get all states from your hook
  const { user, isLoading, isError } = useUser();

  // 2. Handle the loading state first. This prevents UI flicker.
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // 3. Handle any potential error state.
  if (isError) {
    return <div>Error loading your profile. Please try again.</div>;
  }

  // 4. Now that we know data is loaded and valid, handle the different provider statuses.
  if (user?.provider?.status === "pending") {
    return <ProviderProfilePending />;
  }

  if (user?.provider?.status === "verified") {
    return <ProviderApprovedDashboard provider={user.provider} />;
  }

  // 5. This is the final fallback for any other case (e.g., user has no provider profile).
  return <WelcomeDashboard />;
}

// A simple skeleton component for a good user experience
const DashboardSkeleton = () => (
  <div className="p-8">
    <Skeleton className="h-12 w-1/2 mb-4" />
    <Skeleton className="h-8 w-3/4" />
  </div>
);
