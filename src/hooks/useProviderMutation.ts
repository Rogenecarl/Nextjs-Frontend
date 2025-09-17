import axiosInstance from "@/lib/axios";
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/providers`;

// Hook for creating provider profile with tanstack mutation
export const useCreateProviderProfile = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (providerData: FormData) => {
            const response = await axiosInstance.post(API_URL, providerData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            console.log('Provider profile created:', data);
            toast.success('Provider profile created successfully!');
            // You might want to clear the Zustand store here before navigating
            // useOnboardingCreateProviderProfileStore.getState().clear(); // Example
            router.push('/provider/dashboard');
        },

        onError: (error: any) => {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                // Safely get the first error message
                const firstErrorKey = Object.keys(validationErrors)[0];
                const firstErrorMessage = validationErrors[firstErrorKey][0];
                toast.error(firstErrorMessage || 'Please check your input.');
            } else {
                toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred.');
            }
        },
    });
};