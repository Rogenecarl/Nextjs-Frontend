"use client";

import { useState, useMemo } from "react";
import { AppointmentsList } from "@/components/Provider/appointments/appointments-list";
import { AppointmentDetailsModal } from "@/components/Provider/appointments/appointment-details-modal";
import { AppointmentsFilters } from "@/components/Provider/appointments/appointments-filters";
import { AppointmentsPagination } from "@/components/Provider/appointments/appointments-pagination";
import type { Appointment } from "@/types/calendar";

interface AppointmentsSectionProps {
  appointments: Appointment[];
  filter: "all" | "today" | "upcoming" | "history" | "cancelled";
  onFilterChange?: (filter: "all" | "today" | "upcoming" | "history" | "cancelled") => void;
  appointmentCounts?: {
    all: number;
    today: number;
    upcoming: number;
    history: number;
    cancelled: number;
  };
}

export function AppointmentsSection({
  appointments,
  filter,
  onFilterChange,
  appointmentCounts = { all: 0, today: 0, upcoming: 0, history: 0, cancelled: 0 }
}: AppointmentsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filter and paginate appointments
  const { filteredAppointments, paginatedAppointments, totalPages, hasActiveFilters } = useMemo(() => {
    // Filter appointments
    const filtered = appointments.filter((appointment) => {
      const matchesSearch =
        searchQuery === "" ||
        appointment.patient.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        appointment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.service.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;
      const matchesService =
        serviceFilter === "all" || appointment.service.category === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });

    // Sort appointments
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case "patient":
          comparison = a.patient.name.localeCompare(b.patient.name);
          break;
        case "service":
          comparison = a.service.name.localeCompare(b.service.name);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return comparison;
    });

    // Paginate
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = sorted.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(sorted.length / pageSize);
    const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || serviceFilter !== "all";

    return {
      filteredAppointments: sorted,
      paginatedAppointments: paginated,
      totalPages,
      hasActiveFilters
    };
  }, [appointments, searchQuery, statusFilter, serviceFilter, sortBy, currentPage, pageSize]);

  // Get unique service categories for filter
  const serviceCategories = Array.from(
    new Set(appointments.map((apt) => apt.service.category))
  );

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };



  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setServiceFilter("all");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleRefresh = () => {
    // This would typically refetch data from the server
    // For now, we'll just reset the current time display
    window.location.reload();
  };

  return (
    <div className="space-y-6">

      {/* Filters */}
      <AppointmentsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        serviceFilter={serviceFilter}
        onServiceFilterChange={setServiceFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        serviceCategories={serviceCategories}
        onClearFilters={handleClearFilters}
        filteredCount={filteredAppointments.length}
        totalCount={appointments.length}
        activeFilter={filter}
        onFilterChange={onFilterChange}
        appointmentCounts={appointmentCounts}
      />

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <AppointmentsList
          appointments={paginatedAppointments}
          onAppointmentClick={handleAppointmentClick}
        />
      </div>

      {/* Pagination */}
      <AppointmentsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={appointments.length}
        filteredItems={filteredAppointments.length}
        hasActiveFilters={hasActiveFilters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}
