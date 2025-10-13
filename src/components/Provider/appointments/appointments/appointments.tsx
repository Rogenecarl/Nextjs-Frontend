"use client";

import { useState } from "react";
import { AppointmentsTable } from "./appointments-table";
import { AppointmentDetailsModal } from "./appointment-details-modal";
import { AppointmentFilter } from "./appointment-filter";
import { AppointmentsPagination } from "./appointments-pagination";
import { AppointmentProps } from "@/types/types";
import { AppointmentFilters } from "./use-provider-appointment-hook";
import { PaginatedResponse } from "@/types/types";

// The component now receives isLoading, data, and handlers from the parent
interface AppointmentsProps {
  isLoading: boolean;
  isError: boolean;
  appointments: AppointmentProps[];
  paginationMeta?: PaginatedResponse<AppointmentProps>["meta"];
  filters: AppointmentFilters;
  appointmentCounts?: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  onPrimaryFilterChange: (status: AppointmentFilters["status"]) => void;
  onAdvancedFilterChange: (newFilters: Partial<AppointmentFilters>) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Appointments({
  isLoading,
  isError,
  appointments,
  paginationMeta,
  filters,
  appointmentCounts,
  onPrimaryFilterChange,
  onAdvancedFilterChange,
  onPageChange,
  onPageSizeChange,
}: AppointmentsProps) {
  // Modal state is the only state that should remain here
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAppointmentClick = (appointment: AppointmentProps) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    onAdvancedFilterChange({
      search: "",
      status: "pending",
    });
  };

  return (
    <div className="space-y-6">
      <AppointmentFilter
        activeFilter={filters.status || "pending"}
        searchQuery={filters.search ?? ""}
        onFilterChange={onPrimaryFilterChange}
        onSearchChange={(query) => onAdvancedFilterChange({ search: query })}
        onClearFilters={handleClearFilters}
        appointmentCounts={
          appointmentCounts || {
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
          }
        }
      />

      {/* Error State */}
      {isError && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-red-600">Error loading appointments.</div>
        </div>
      )}

      {/* Main Content */}
      {!isError && (
        <>
          <AppointmentsTable
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
            isLoading={isLoading}
          />

          {!isLoading && paginationMeta && (
            <AppointmentsPagination
              currentPage={paginationMeta.current_page}
              totalPages={paginationMeta.last_page}
              pageSize={paginationMeta.per_page}
              totalItems={paginationMeta.total}
              filteredItems={paginationMeta.total}
              hasActiveFilters={
                !!(
                  filters.search ||
                  (filters.status && filters.status !== "pending")
                )
              }
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </>
      )}

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
