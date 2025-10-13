"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppointmentsNavigation } from "@/components/Provider/appointments/appointments-navigation";
import { Calendar } from "@/components/Provider/appointments/calendar/calendar";
import { Appointments as AppointmentsSection } from "@/components/Provider/appointments/appointments/appointments";
import ProviderLayout from "@/components/Provider/layout/ProviderLayout";
import {
  useProviderAppointments,
  useProviderAppointmentCounts,
  AppointmentFilters,
} from "@/components/Provider/appointments/appointments/use-provider-appointment-hook";

export default function AppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<
    "appointments" | "calendar"
  >("appointments");

  // Initialize filters from URL params
  const [filters, setFilters] = useState<AppointmentFilters>(() => ({
    page: parseInt(searchParams.get("page") || "1"),
    per_page: parseInt(searchParams.get("per_page") || "25"),
    status:
      (searchParams.get("status") as AppointmentFilters["status"]) || "pending",
    search: searchParams.get("search") || "",
  }));

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.page && filters.page > 1)
      params.set("page", filters.page.toString());
    if (filters.per_page && filters.per_page !== 25)
      params.set("per_page", filters.per_page.toString());
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/provider/appointments${newUrl}`, { scroll: false });
  }, [filters, router]);

  // Fetch data using our hooks
  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useProviderAppointments(filters);
  const { data: appointmentCounts } = useProviderAppointmentCounts();

  // The component now receives its data directly from the API call.
  const appointments = (paginatedData as any)?.data ?? [];
  const paginationMeta = (paginatedData as any)?.meta;

  // --- Handler Functions to be Passed Down ---

  // This handler will be passed to the main filter buttons (All, Today, Upcoming, etc.)
  const handlePrimaryFilterChange = (status: AppointmentFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status: status, page: 1 }));
  };

  // This handler will be passed to the search input and dropdowns
  const handleAdvancedFilterChange = (
    newFilters: Partial<AppointmentFilters>
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, per_page: size, page: 1 }));
  };

  return (
    <ProviderLayout>
      <div className="min-h-screen bg-gray-50">
        <AppointmentsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="px-6 py-8 max-w-7xl mx-auto">
          {activeSection === "calendar" ? (
            <Calendar />
          ) : (
            <AppointmentsSection
              isLoading={isLoading}
              isError={isError}
              appointments={appointments}
              paginationMeta={paginationMeta}
              filters={filters}
              appointmentCounts={appointmentCounts}
              onPrimaryFilterChange={handlePrimaryFilterChange}
              onAdvancedFilterChange={handleAdvancedFilterChange}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </main>
      </div>
    </ProviderLayout>
  );
}
