import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { LoginFormType, RegisterFormType } from '@/schemas/auth-schema';
import axiosInstance from '@/lib/axiosConfig';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const useLogin = () => {
    const router = useRouter();
    const { setToken } = useAuthStore.getState(); // Use getState for non-reactive updates in callbacks

    return useMutation({
        mutationFn: async (credentials: LoginFormType) => {
            try {
                const res = await axiosInstance.post(`${API_URL}/login`, credentials);
                if (!res.data.success) {
                    throw new Error(res.data.message || 'Invalid credentials');
                }
                return res.data;
            } catch (error: any) {
                // Handle axios error responses
                if (error.response) {
                    throw new Error(error.response.data.message || 'Login failed');
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            setToken(data.access_token);
            toast.success('Login successful');
            router.push('/dashboard');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

export const useRegister = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (userData: RegisterFormType) => {
            const res = await axiosInstance.post(`${API_URL}/register`, userData);
            if (!res.data.status) {
                throw new Error(res.data.message || 'Registration failed');
            }
            return res.data;
        },
        onSuccess: () => {
            toast.success('Registration successful. Please login.');
            router.push('/login');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};

