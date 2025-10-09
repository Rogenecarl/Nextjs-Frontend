import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProviderAppointments, 
  getProviderAppointmentCounts,
  confirmAppointment,
  completeAppointment,
  cancelAppointment
} from "@/services/appointmentService";

// Define the shape of the filters state object
export interface AppointmentFilters {
  page?: number;
  per_page?: number;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
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

export const useProviderAppointmentCounts = () => {
  return useQuery({
    queryKey: ["providerAppointmentCounts"],
    queryFn: () => getProviderAppointmentCounts(),
  });
};

// Mutation hook for confirming appointments
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointmentId: string) => confirmAppointment(appointmentId),
    onSuccess: () => {
      // Invalidate and refetch appointment data
      queryClient.invalidateQueries({ queryKey: ["providerAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["providerAppointmentCounts"] });
    },
  });
};

// Mutation hook for completing appointments
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointmentId: string) => completeAppointment(appointmentId),
    onSuccess: () => {
      // Invalidate and refetch appointment data
      queryClient.invalidateQueries({ queryKey: ["providerAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["providerAppointmentCounts"] });
    },
  });
};

// Mutation hook for canceling appointments
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason: string }) => 
      cancelAppointment(appointmentId, reason),
    onSuccess: () => {
      // Invalidate and refetch appointment data
      queryClient.invalidateQueries({ queryKey: ["providerAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["providerAppointmentCounts"] });
    },
  });
};
