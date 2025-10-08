import { useQuery } from "@tanstack/react-query";
import { getProviderAppointments } from "@/services/appointmentService";

// Define the shape of the filters state object
export interface AppointmentFilters {
  page?: number;
  per_page?: number;
  status?: "today" | "upcoming" | "history" | "cancelled" | "pending" | null;
  date?: string | null;
  search?: string;
}

export const useProviderAppointments = (filters: AppointmentFilters) => {
  return useQuery({
    // The queryKey includes the filters object.
    // This is the magic: any change to filters creates a new key and triggers a refetch.
    queryKey: ["providerAppointments", filters],
    queryFn: () => getProviderAppointments(filters),
    // placeholderData is great for pagination to prevent UI flickering
    placeholderData: (previousData) => previousData,
  });
};
