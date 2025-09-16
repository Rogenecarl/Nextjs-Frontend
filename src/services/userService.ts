import axiosInstance from "@/lib/axios";

export const getAuthenticatedUser = async () => {
    try {
        // The token is added automatically by the axios interceptor
        const response = await axiosInstance.get('/user');
        // Your API resource likely wraps the data, so we return response.data.data
        return response.data.data;
    } catch (error) {
        console.error("Error fetching authenticated user:", error);
        throw error;
    }
};