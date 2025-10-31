import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/lib/axios";

const getAuthenticatedUser = async () => {
  try {
    // The token is added automatically by the axios interceptor
    const response = await axiosInstance.get("/user");
    // Your API resource likely wraps the data, so we return response.data.data
    return response.data.data;
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    throw error;
  }
};

export function useUser() {
    const { token } = useAuthStore();

    const {
        data: user,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['user'],
        queryFn: getAuthenticatedUser,
        enabled: !!token, // Only run the query if we have a token
    });

    return {
        user,
        isLoading,
        isError,
        error,
        isAuthenticated: !!user
    };
}