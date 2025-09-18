import axiosInstance from "@/lib/axios"; // Use your configured instance

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/providers`;

// OLD function (keep it if you use it elsewhere)
export const getAllProviders = async () => {
    const response = await axiosInstance.get(API_URL);
    return response.data.providers;
};

// NEW function for filtering
interface ProviderFilters {
    category_id?: number | null;
    search_term?: string;
}

export const searchProviders = async (filters: ProviderFilters) => {
    // Clean up filters: remove null or empty values so they aren't in the URL
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );

    // Create a URL-safe query string from the filters object
    const params = new URLSearchParams(cleanFilters as Record<string, string>);

    // Call the search endpoint
    const response = await axiosInstance.get(`${API_URL}/search?${params.toString()}`);

    // The response from ProviderResource::collection is already wrapped in a "data" key
    return response.data.data;
};

// NEW function for getting suggestions
export const getSearchSuggestions = async (searchTerm: string) => {
    // If the search term is empty, don't make an API call
    if (!searchTerm.trim()) {
        return [];
    }

    const params = new URLSearchParams({ term: searchTerm });
    const response = await axiosInstance.get(`${API_URL}/suggestions?${params.toString()}`);
    return response.data; // The backend returns a simple array
};