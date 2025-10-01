import axiosInstance from "@/lib/axios"; // Use your configured instance

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/providers`;

// ========================================================================
// NEW function to fetch GeoJSON data for the map
// ========================================================================
/**
 * Fetches all verified provider locations as a GeoJSON FeatureCollection.
 * This is optimized for use with Mapbox GL JS.
 */
export const getProviderLocations = async () => {
  // This calls the GET /api/providers/locations endpoint you created
  const response = await axiosInstance.get(`${API_URL}/locations`);
  // The controller returns the GeoJSON object directly, so we just return response.data
  return response.data;
};
// ========================================================================

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
    Object.entries(filters).filter(([_, v]) => v != null && v !== "")
  );

  // Create a URL-safe query string from the filters object
  const params = new URLSearchParams(cleanFilters as Record<string, string>);

  // Call the search endpoint
  const response = await axiosInstance.get(
    `${API_URL}/search?${params.toString()}`
  );

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
  const response = await axiosInstance.get(
    `${API_URL}/suggestions?${params.toString()}`
  );
  return response.data; // The backend returns a simple array
};

// Get available slots for a provider within a date range (for calendar view)
export const getProviderAvailableSlotsRange = async (
  providerId: number,
  startDate: string,
  endDate: string
) => {
  const response = await axiosInstance.get(
    `${API_URL}/providers/${providerId}/available-slots-range?start_date=${startDate}&end_date=${endDate}`
  );
  return response.data;
};

// Get provider schedule information (operating hours and slot duration)
export const getProviderScheduleInfo = async (providerId: number) => {
  const response = await axiosInstance.get(
    `${API_URL}/providers/${providerId}/schedule-info`
  );
  return response.data;
};

// Create a new appointment
export const createAppointment = async (appointmentData: {
  provider_id: number;
  start_time: string;
  end_time: string;
  service_ids?: number[];
  notes?: string;
}) => {
  const response = await axiosInstance.post(
    `${API_URL}/appointments`,
    appointmentData
  );
  return response.data;
};

// Get user's appointments with optional filters
export const getUserAppointments = async (filters?: {
  status?: string;
  from_date?: string;
  to_date?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.from_date) params.append("from_date", filters.from_date);
  if (filters?.to_date) params.append("to_date", filters.to_date);

  const queryString = params.toString();
  const url = `${API_URL}/user/appointments${queryString ? `?${queryString}` : ""
    }`;

  const response = await axiosInstance.get(url);
  return response.data;
};

// Cancel an appointment
export const cancelAppointment = async (
  appointmentId: number,
  reason?: string
) => {
  const response = await axiosInstance.post(
    `${API_URL}/appointments/${appointmentId}/cancel`,
    {
      reason,
    }
  );
  return response.data;
};