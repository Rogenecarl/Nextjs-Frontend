import axiosInstance from "@/lib/axios";
import { AppointmentFilters } from "@/components/Provider/appointments/appointments/use-provider-appointment-hook";

// New function to fetch the provider's appointments
export const getProviderAppointments = async (filters: AppointmentFilters) => {
  // Clean up filters to remove null/empty values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== "")
  );

  const params = new URLSearchParams(cleanFilters as Record<string, string>);

  const response = await axiosInstance.get(
    `/provider/appointments?${params.toString()}`
  );
  return response.data;
};

// Function to fetch appointment counts by status
export const getProviderAppointmentCounts = async () => {
  const response = await axiosInstance.get("/provider/appointments/counts");
  return response.data;
};

// Function to confirm an appointment
export const confirmAppointment = async (appointmentId: string) => {
  const response = await axiosInstance.post(
    `/appointments/${appointmentId}/confirm`
  );
  return response.data;
};

// Function to mark an appointment as complete
export const completeAppointment = async (appointmentId: string) => {
  const response = await axiosInstance.post(
    `/appointments/${appointmentId}/complete`
  );
  return response.data;
};

// Function to cancel an appointment (provider)
export const cancelAppointment = async (
  appointmentId: string,
  cancellationReason: string
) => {
  const response = await axiosInstance.post(
    `/appointments/${appointmentId}/cancel`,
    {
      cancellation_reason: cancellationReason,
    }
  );
  return response.data;
};

interface DateRange {
  start_date: string;
  end_date: string;
}

// New function to fetch appointments for the calendar view
export const getProviderCalendarAppointments = async ({
  start_date,
  end_date,
}: DateRange) => {
  const params = new URLSearchParams({ start_date, end_date });
  const response = await axiosInstance.get(
    `/provider/calendar-appointments?${params.toString()}`
  );
  // The resource collection is wrapped in a 'data' key
  return response.data.data;
};
