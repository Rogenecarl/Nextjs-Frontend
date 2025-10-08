import axiosInstance from "@/lib/axios";
import { AppointmentFilters } from "@/components/Provider/appointments/appointments/use-provider-appointment-hook";

// New function to fetch the provider's appointments
export const getProviderAppointments = async (filters: AppointmentFilters) => {
    // Clean up filters to remove null/empty values
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );

    const params = new URLSearchParams(cleanFilters as Record<string, string>);

    const response = await axiosInstance.get(`/provider/appointments?${params.toString()}`);
    return response.data;
};