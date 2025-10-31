"use client";

import SetAppointmentServiceForm from "@/components/User/appointment/set-appointment-step1";
import { useHealthcareData } from "@/components/User/find-services/hook/use-healthcare-data";
import { useParams } from "next/navigation"; // to get [id] from URL

export default function AppointmentPage() {
  const { data, isLoading, error } = useHealthcareData();
  const params = useParams();
  const id = params?.id as string;
  if (isLoading) {
    return <p>Appointment details...</p>;
  }

  if (error) {
    return <p>Failed to load appointment details.</p>;
  }

  if (!data) {
    return <p>No data found.</p>;
  }

  const providerId = Number(id);
  const provider = data.providers.find((p) => p.id === providerId);

  if (!provider) {
    return <p>Appointment id not found.</p>;
  }

  return <SetAppointmentServiceForm provider={provider} />;
}
