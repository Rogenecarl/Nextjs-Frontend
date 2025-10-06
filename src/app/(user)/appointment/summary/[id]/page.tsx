"use client";

import BookingSummary from "@/components/User/appointment/set-appointment-step3";
import { useHealthcareData } from "@/components/User/find-services/hook/use-healthcare-data";
import UserLayout from "@/components/User/layout/user-layout";
import { useParams } from "next/navigation";

export default function BookingSummaryPage() {
  const { data, isLoading, error } = useHealthcareData();
  const params = useParams();
  const id = params?.id as string;
  


  if (isLoading) {
    return (
      <UserLayout>
        <p>Loading booking summary...</p>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <p>Failed to load booking details.</p>
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
      <BookingSummary provider={provider} />
    </UserLayout>
  );
}