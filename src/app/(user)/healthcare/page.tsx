"use client";

import { useHealthcareData } from "@/components/User/healthcare/hook/use-healthcare-data";
import { HealthCareSkeleton } from "@/components/User/healthcare/health-care-skeleton";
import HealthcareView from "@/components/User/healthcare/health-care-view";

export default function Healthcare() {
    // One hook call gets all data and state
    const { isLoading, isError, error, data } = useHealthcareData();

    // 1. Handle Loading State
    if (isLoading) {
        return <HealthCareSkeleton />;
    }

    // 2. Handle Error State
    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-red-600 text-lg">Error: {error?.message}</span>
            </div>
        );
    }

    // 3. Render Success State
    return (
        <HealthcareView
            providers={data.providers}
            categories={data.categories}
        />
    );

}