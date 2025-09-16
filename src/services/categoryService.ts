import axiosInstance from "@/lib/axios";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`;

// Fetch all categories
export const getAllCategories = async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data.categories;
};

// Fetch providers by category ID (for filtering)
export const getProviderByCategory = async (categoryId: number) => {
    const response = await axiosInstance.get(`${API_URL}?categoryId=${categoryId}`);
    return response.data.providers;
}