import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`;

// Interface for service data
interface ServiceData {
  name: string;
  description?: string;
  price_min: number;
  price_max: number;
  is_active?: boolean;
  sort_order?: number;
}

interface Service {
  id: number;
  provider_id: number;
  name: string;
  description?: string;
  price_min: number;
  price_max: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ServiceResponse {
  service: Service;
  message: string;
}

interface ServicesListResponse {
  services: {
    data: Service[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

// Hook for creating a new service
export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation<ServiceResponse, Error, ServiceData>({
        mutationFn: async (serviceData: ServiceData) => {
            const response = await axiosInstance.post(`${API_URL}/services`, serviceData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Service created successfully:', data);
            toast.success('Service created successfully!');
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ 
                queryKey: ['provider-services'] 
            });
        },

        onError: (error: any) => {
            console.error('Create service error:', error);
            
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const firstErrorKey = Object.keys(validationErrors)[0];
                const firstErrorMessage = validationErrors[firstErrorKey][0];
                toast.error(firstErrorMessage || 'Please check your service details.');
            } else if (error.response?.status === 403) {
                toast.error('You are not authorized to create services.');
            } else if (error.response?.status === 401) {
                toast.error('Please log in to create services.');
            } else {
                toast.error(error.response?.data?.message || error.message || 'Failed to create service. Please try again.');
            }
        },
    });
};

// Hook for updating a service
export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation<ServiceResponse, Error, { id: number; data: Partial<ServiceData> }>({
        mutationFn: async ({ id, data }) => {
            const response = await axiosInstance.put(`${API_URL}/services/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Service updated successfully:', data);
            toast.success('Service updated successfully!');
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ 
                queryKey: ['provider-services'] 
            });
        },

        onError: (error: any) => {
            console.error('Update service error:', error);
            
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const firstErrorKey = Object.keys(validationErrors)[0];
                const firstErrorMessage = validationErrors[firstErrorKey][0];
                toast.error(firstErrorMessage || 'Please check your service details.');
            } else if (error.response?.status === 403) {
                toast.error('You are not authorized to update this service.');
            } else if (error.response?.status === 404) {
                toast.error('Service not found.');
            } else if (error.response?.status === 401) {
                toast.error('Please log in to update services.');
            } else {
                toast.error(error.response?.data?.message || error.message || 'Failed to update service. Please try again.');
            }
        },
    });
};

// Hook for deleting a service
export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation<{ message: string }, Error, number>({
        mutationFn: async (serviceId: number) => {
            const response = await axiosInstance.delete(`${API_URL}/services/${serviceId}`);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Service deleted successfully:', data);
            toast.success('Service deleted successfully!');
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({ 
                queryKey: ['provider-services'] 
            });
        },

        onError: (error: any) => {
            console.error('Delete service error:', error);
            
            if (error.response?.status === 403) {
                toast.error('You are not authorized to delete this service.');
            } else if (error.response?.status === 404) {
                toast.error('Service not found.');
            } else if (error.response?.status === 401) {
                toast.error('Please log in to delete services.');
            } else {
                toast.error(error.response?.data?.message || error.message || 'Failed to delete service. Please try again.');
            }
        },
    });
};

// Hook for fetching provider's services
export const useProviderServices = (page: number = 1) => {
    return useQuery({
        queryKey: ['provider-services', page],
        queryFn: async () => {
            const response = await axiosInstance.get(`${API_URL}/provider/services?page=${page}`);
            return response.data as ServicesListResponse;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
};

// Hook for fetching a single service
export const useService = (serviceId: number) => {
    return useQuery({
        queryKey: ['service', serviceId],
        queryFn: async () => {
            const response = await axiosInstance.get(`${API_URL}/services/${serviceId}`);
            return response.data as ServiceResponse;
        },
        enabled: !!serviceId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
};

// Export types for use in components
export type { Service, ServiceData, ServiceResponse, ServicesListResponse };