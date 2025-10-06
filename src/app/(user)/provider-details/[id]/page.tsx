"use client";

import { useHealthcareData } from "@/components/User/find-services/hook/use-healthcare-data";
import UserLayout from "@/components/User/layout/user-layout";
import ProviderDetailsContent from "@/components/User/providerdetails/provider-details";
import { useParams } from "next/navigation"; // to get [id] from URL


export default function ProviderDetailsPage() {
    const { data, isLoading, error } = useHealthcareData();
    const params = useParams(); 
    const id = params?.id as string;

    if (isLoading) {
        return (
            <UserLayout>
                <p>Loading provider details...</p>
            </UserLayout>
        );
    }

    if (error) {
        return (
            <UserLayout>
                <p>Failed to load provider details.</p>
            </UserLayout>
        );
    }

    if (!data) {
        return (
            <UserLayout>
                <p>No data found.</p>
            </UserLayout>
        );
    }

    const providerId = Number(id);
    const provider = data.providers.find((p) => p.id === providerId);


    if (!provider) {
        return (
            <UserLayout>
                <p>Provider not found.</p>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <ProviderDetailsContent provider={provider} />
        </UserLayout>
    );
}
