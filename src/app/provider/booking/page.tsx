"use client";

import { useState } from "react";
import { useGetProviderAppointments } from "@/hooks/use-provider-appointment";
import { useDebounce } from "@/hooks/use-debounce-hook";
import { AppointmentTableSkeleton } from "@/components/Provider/appointments/appointments/appointment-skeleton";

// Define status tabs for filtering. 'as const' provides stricter typing.
const AppointmentStatusTabs = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No Show", value: "no_show" },
] as const;

type AppointmentStatus = (typeof AppointmentStatusTabs)[number]['value'];

export default function AppointmentsPage() {
  // State management for filters
  const [activeStatus, setActiveStatus] = useState<AppointmentStatus>("cancelled");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(25);

  // Debounce search term to prevent API calls on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch data using our custom TanStack Query hook
  const {
    data: paginatedResponse,
    isLoading, // True on initial load for a query key
    isError,   // True if the API call fails
    isFetching,// True anytime a request is in-flight (including background refetches)
  } = useGetProviderAppointments({
    status: activeStatus,
    search: debouncedSearchTerm,
    page: page,
    per_page: perPage,
  });

  // Safely access the data and metadata
  const appointments = paginatedResponse?.data ?? [];
  const meta = paginatedResponse?.meta;

  return (
    <div className="p-8">
      {/* --- Page Header and Controls (Always visible) --- */}
      <h1 className="text-2xl font-bold mb-4">Filter Appointments</h1>
      <p className="mb-6 text-gray-600">Choose appointment type to view</p>

      <div className="flex space-x-2 mb-4">
        {AppointmentStatusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveStatus(tab.value);
              setPage(1); // Reset to first page on filter change
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeStatus === tab.value
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search patients, services, or appointment ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-lg mb-6"
      />

      {/* --- Table Section --- */}
      <div className="bg-white rounded-lg shadow-sm border relative">
        {/* Optional: Subtle overlay for background refetches (e.g., pagination) */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 z-10 transition-opacity" />
        )}
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 bg-gray-50">
            <tr>
              <th className="p-4 font-medium">Appointment #</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Date & Time</th>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Price</th>
            </tr>
          </thead>

          {/* --- CONDITIONAL TABLE BODY --- */}
          {isLoading ? (
            <AppointmentTableSkeleton rows={5} />
          ) : isError ? (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center p-8 text-red-600">
                  An error occurred while fetching appointments.
                </td>
              </tr>
            </tbody>
          ) : appointments.length > 0 ? (
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-t">
                  <td className="p-4 font-medium text-gray-900">{apt.appointment_number}</td>
                  <td className="p-4 text-gray-700">{apt.user.name}</td>
                  <td className="p-4 text-gray-700">
                    {apt.formatted_date}
                    <div className="text-xs text-gray-500">
                      {apt.formatted_start_time} - {apt.formatted_end_time}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{apt.services.map((s) => s.name).join(", ")}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full capitalize bg-gray-100 text-gray-800">
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(apt.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  No appointments found for this filter.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* --- Pagination Controls --- */}
      {meta && meta.total > 0 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-700">
            Showing <strong>{meta.from}</strong> to <strong>{meta.to}</strong> of <strong>{meta.total}</strong> appointments
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={meta.current_page === 1}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={meta.current_page === meta.last_page}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// You would need a debouncing hook like this one, placed in a separate file.
// Example: src/hooks/useDebounce.ts
// import { useState, useEffect } from 'react';
// export function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);
//   useEffect(() => {
//     const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
//     return () => { clearTimeout(handler); };
//   }, [value, delay]);
//   return debouncedValue;
// }