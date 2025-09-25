"use client";

import SetAppointmentServiceForm from "@/components/User/appointment/set-appointment-step1";
import { useHealthcareData } from "@/components/User/healthcare/hook/use-healthcare-data";
import UserLayout from "@/components/User/layout/user-layout";
import { useParams } from "next/navigation"; // to get [id] from URL

export default function AppointmentPage() {
  const { data, isLoading, error } = useHealthcareData();
  const params = useParams();
  const id = params?.id as string;
  if (isLoading) {
    return (
      <UserLayout>
        <p>Appointment details...</p>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <p>Failed to load appointment details.</p>
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
        <p>Appointment id not found.</p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <SetAppointmentServiceForm provider={provider} />
    </UserLayout>
  );
}
