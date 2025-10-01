import { useQuery } from "@tanstack/react-query";
import { getProviderLocations } from "@/services/providerService";

export const useProviderLocations = () => {
    return useQuery({
        queryKey: ['providerLocations'], // A unique key for this query
        queryFn: getProviderLocations,
        staleTime: 1000 * 60 * 5, // Optional: Cache data for 5 minutes
    });
};
