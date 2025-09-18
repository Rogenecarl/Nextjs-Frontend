"use client";

import ProviderProfileTableComponent from "@/components/Provider/profile-table";
import { useHealthcareData } from "@/components/User/healthcare/hook/use-healthcare-data";
import { useUser } from "@/hooks/useUser";

export default function ProviderProfilePage() {
    const { user } = useUser();
    const { isLoading, isError, error, data } = useHealthcareData();
    return (
        <>
            <div className="flex items-center justify-between py-4">
                <div>
                    <h1 className="text-3xl font-medium text-gray-900">Manage Profile</h1>
                    <p className="text-gray-600">Manage Your Healthcare Provider Profile</p>
                </div>
                <div>{data.providers[0]?.services[0]?.name}</div>

            </div>
            <ProviderProfileTableComponent providers={user?.provider ? [user.provider] : []} />
        </>
    );
}