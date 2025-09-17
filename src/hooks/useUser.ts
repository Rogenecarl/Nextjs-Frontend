import { useQuery } from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

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