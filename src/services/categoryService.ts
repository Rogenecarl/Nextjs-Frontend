import axiosInstance from "@/lib/axios";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories`;

// Fetch all categories
export const getAllCategories = async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data.categories;
};