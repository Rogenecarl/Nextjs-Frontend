"use client";

import ProviderLayout from "@/components/Provider/layout/ProviderLayout";
import OnboardingInforPage from "@/components/Provider/onboarding-step1-info-form";
import { useHealthcareData } from "@/components/User/find-services/hook/use-healthcare-data";


export default function OnboardingInformationPage() {
    const { isLoading, isError, error, data } = useHealthcareData();
    return (
        <ProviderLayout>
            <OnboardingInforPage categories={data.categories} />

        </ProviderLayout>
    )
};
