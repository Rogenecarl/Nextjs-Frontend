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
    all: number;
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

  // ALL useMemo, filtering, sorting, and pagination logic is REMOVED.

  const handleAppointmentClick = (appointment: AppointmentProps) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    onAdvancedFilterChange({
      search: "",
      status: null /* add other filters here */,
    });
  };

  return (
    <div className="space-y-6">
      <AppointmentFilter
        // Pass down the current filter values
        activeFilter={filters.status === null ? "all" : filters.status}
        searchQuery={filters.search ?? ""}
        // Pass down the handler functions
        onFilterChange={onPrimaryFilterChange}
        onSearchChange={(query) => onAdvancedFilterChange({ search: query })}
        onClearFilters={handleClearFilters}
        // Pass the appointment counts from the API
        appointmentCounts={appointmentCounts || {
          all: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        }}
      />

      {/* Now we handle loading and error states here */}
      {isLoading && (
        <div className="bg-white rounded-xl border p-6 text-center">
          Loading appointments...
        </div>
      )}

      {isError && (
        <div className="bg-white rounded-xl border p-6 text-center text-red-500">
          Error loading appointments.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <AppointmentsTable
              appointments={appointments} // Pass the already-paginated data
              onAppointmentClick={handleAppointmentClick}
            />
          </div>

          {paginationMeta && (
            <AppointmentsPagination
              currentPage={paginationMeta.current_page}
              totalPages={paginationMeta.last_page}
              pageSize={paginationMeta.per_page}
              totalItems={paginationMeta.total}
              filteredItems={paginationMeta.total}
              hasActiveFilters={!!(filters.search || filters.status)}
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
