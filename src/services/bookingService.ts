import axiosInstance from "@/lib/axios";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`;

// Get available slots for a specific provider on a specific date
export const getProviderAvailableSlots = async (
  providerId: number,
  date: string
) => {
  const response = await axiosInstance.get(
    `${API_URL}/providers/${providerId}/available-slots?date=${date}`
  );
  return response.data;
};

// Get provider schedule information (operating hours and slot duration)
export const getProviderScheduleInfo = async (providerId: number) => {
  const response = await axiosInstance.get(
    `${API_URL}/providers/${providerId}/schedule-info`
  );
  return response.data;
};

// Create a new appointment booking
export const createAppointment = async (bookingData: {
  provider_id: number;
  service_ids: number[];
  appointment_date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}) => {
  const response = await axiosInstance.post(
    `${API_URL}/appointments`,
    bookingData
  );
  return response.data;
};

// Cancel an appointment
export const cancelAppointment = async (appointmentId: number) => {
  const response = await axiosInstance.post(
    `${API_URL}/appointments/${appointmentId}/cancel`
  );
  return response.data;
};

// Get user's appointments
export const getUserAppointments = async () => {
  const response = await axiosInstance.get(`${API_URL}/user/appointments`);
  return response.data;
};
