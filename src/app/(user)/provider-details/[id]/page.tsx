"use client";

import { useHealthcareData } from "@/components/User/find-services/hook/use-healthcare-data";
import ProviderDetailsContent from "@/components/User/providerdetails/provider-details";
import { useParams } from "next/navigation"; // to get [id] from URL

export default function ProviderDetailsPage() {
  const { data, isLoading, error } = useHealthcareData();
  const params = useParams();
  const id = params?.id as string;

  if (isLoading) {
    return <p>Loading provider details...</p>;
  }

  if (error) {
    return <p>Failed to load provider details.</p>;
  }

  if (!data) {
    return <p>No data found.</p>;
  }

  const providerId = Number(id);
  const provider = data.providers.find((p) => p.id === providerId);

  if (!provider) {
    return <p>Provider not found.</p>;
  }

  return <ProviderDetailsContent provider={provider} />;
}
