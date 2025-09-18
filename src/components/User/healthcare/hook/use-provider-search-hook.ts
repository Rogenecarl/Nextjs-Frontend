import { useQuery } from '@tanstack/react-query';
import { searchProviders } from '@/services/providerService'; // We'll create this next
import { ProviderProps } from '@/types/types';

// The filters object type
interface ProviderFilters {
    category_id?: number | null;
    search_term?: string;
    // ... add other filters like rating, distance here later
}

export function useProviders(filters: ProviderFilters) {
    const {
        data: providers = [],
        isLoading,
        isError,
        error
    } = useQuery<ProviderProps[]>({
        // The queryKey is crucial. It includes the filters object.
        // TanStack Query will automatically refetch when this key changes.
        queryKey: ['providers', filters],

        // The queryFn calls our new search service function
        queryFn: () => searchProviders(filters),
    });

    return { providers, isLoading, isError, error };
}