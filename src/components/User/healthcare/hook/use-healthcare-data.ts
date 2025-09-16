import { useQuery } from "@tanstack/react-query";
import { getAllProviders } from "@/services/providerService";
import { getAllCategories, getProviderByCategory } from "@/services/categoryService";
import { ProviderProps, CategoryProps } from "@/types/types";
export function useHealthcareData() {
    const {
        data: categories = [],
        isLoading: categoriesLoading,
        isError: categoriesIsError,
        error: categoriesError,
    } = useQuery<CategoryProps[]>({
        queryKey: ['categories'],
        queryFn: getAllCategories, // No need for a separate async function here
    });

    const {
        data: providers = [],
        isLoading: providersLoading,
        isError: providersIsError,
        error: providersError,
    } = useQuery<ProviderProps[]>({
        queryKey: ["providers"],
        queryFn: getAllProviders, // Simpler
    });

    // Consolidate the loading and error states
    const isLoading = providersLoading || categoriesLoading;
    const isError = providersIsError || categoriesIsError;
    const error = providersError || categoriesError;

    return {
        isLoading,
        isError,
        error,
        data: {
            providers,
            categories,
        },
    };
}