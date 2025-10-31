"use client";

import OnboardingInforPage from "@/components/Provider/onboarding-step1-info-form";
import { useHealthcareData } from "@/components/User/find-services/hook/use-healthcare-data";

export default function OnboardingInformationPage() {
  const { isLoading, isError, error, data } = useHealthcareData();
  return <OnboardingInforPage categories={data.categories} />;
}
