import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { AppointmentProps, PaginatedResponse } from "@/types/types";

export interface AppointmentFilters {
  status?: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  search?: string;
  page?: number;
  per_page?: number;
}

const getProviderAppointments = async (
  filters: AppointmentFilters
): Promise<PaginatedResponse<AppointmentProps>> => {
  const response = await axiosInstance.get("/provider/appointments", {
    params: filters,
  });
  return response.data;
};

// The custom hook that uses TanStack Query
export const useGetProviderAppointments = (filters: AppointmentFilters) => {
  return useQuery({
    queryKey: ["providerAppointments", filters],

    // The function that will be called to fetch the data
    queryFn: () => getProviderAppointments(filters),
    placeholderData: keepPreviousData,
  });
};
