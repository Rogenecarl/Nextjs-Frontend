import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/providers`;

// Fetch all providers
export const getAllProviders = async () => {
    const response = await axios.get(API_URL);
    return response.data.providers;
};