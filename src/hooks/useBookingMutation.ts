import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`;

// Interface for booking data
interface BookingData {
  provider_id: number;
  services: Array<{
    service_id: number;
    price_at_booking: number;
  }>;
  start_time: string; // Full datetime string
  end_time: string; // Full datetime string
  notes?: string;
}

interface BookingResponse {
  appointment: {
    id: number;
    provider_id: number;
    user_id: number;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status: string;
    notes?: string;
    created_at: string;
    updated_at: string;
  };
  message: string;
}

// Hook for creating appointment booking with tanstack mutation
export const useCreateBooking = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<BookingResponse, Error, BookingData>({
        mutationFn: async (bookingData: BookingData) => {
            const response = await axiosInstance.post(`${API_URL}/appointments`, bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Appointment booked successfully:', data);
            toast.success('Appointment booked successfully!');
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ 
                queryKey: ['user-appointments'] 
            });
            queryClient.invalidateQueries({ 
                queryKey: ['provider-timeslots'] 
            });
            
            // Navigate to success page with appointment ID
            router.push(`/appointment/success/${data.appointment.id}`);
        },

        onError: (error: any) => {
            console.error('Booking error:', error);
            
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                // Safely get the first error message
                const firstErrorKey = Object.keys(validationErrors)[0];
                const firstErrorMessage = validationErrors[firstErrorKey][0];
                toast.error(firstErrorMessage || 'Please check your booking details.');
            } else if (error.response?.status === 409) {
                // Conflict - time slot might be already booked
                toast.error('This time slot is no longer available. Please select another time.');
            } else if (error.response?.status === 401) {
                toast.error('Please log in to book an appointment.');
                router.push('/login');
            } else {
                toast.error(error.response?.data?.message || error.message || 'Failed to book appointment. Please try again.');
            }
        },
    });
};

// Hook for canceling appointment
export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, number>({
        mutationFn: async (appointmentId: number) => {
            const response = await axiosInstance.post(`${API_URL}/appointments/${appointmentId}/canceluser`);
            return response.data;
        },
        onSuccess: (data, appointmentId) => {
            console.log('Appointment canceled successfully:', data);
            toast.success('Appointment canceled successfully!');
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ 
                queryKey: ['user-appointments'] 
            });
            queryClient.invalidateQueries({ 
                queryKey: ['provider-timeslots'] 
            });
        },

        onError: (error: any) => {
            console.error('Cancel booking error:', error);
            
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const firstErrorKey = Object.keys(validationErrors)[0];
                const firstErrorMessage = validationErrors[firstErrorKey][0];
                toast.error(firstErrorMessage || 'Unable to cancel appointment.');
            } else if (error.response?.status === 404) {
                toast.error('Appointment not found.');
            } else if (error.response?.status === 401) {
                toast.error('Please log in to cancel appointments.');
            } else {
                toast.error(error.response?.data?.message || error.message || 'Failed to cancel appointment. Please try again.');
            }
        },
    });
};

// Hook for fetching user appointments
export const useUserAppointments = () => {
    return useQuery({
        queryKey: ['user-appointments'],
        queryFn: async () => {
            const response = await axiosInstance.get(`${API_URL}/user/appointments`);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
};