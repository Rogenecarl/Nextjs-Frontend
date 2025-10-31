"use client";

import BookingSummary from "@/components/User/appointment/set-appointment-step3";
import { useHealthcareData } from "@/components/User/find-services/hook/use-healthcare-data";
import { useParams } from "next/navigation";

export default function BookingSummaryPage() {
  const { data, isLoading, error } = useHealthcareData();
  const params = useParams();
  const id = params?.id as string;

  if (isLoading) {
    return <p>Loading booking summary...</p>;
  }

  if (error) {
    return <p>Failed to load booking details.</p>;
  }

  if (!data) {
    return <p>No data found.</p>;
  }

  const providerId = Number(id);
  const provider = data.providers.find((p) => p.id === providerId);

  if (!provider) {
    return <p>Provider not found.</p>;
  }

  return <BookingSummary provider={provider} />;
}
