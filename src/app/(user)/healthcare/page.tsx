"use client";

import UserLayout from "@/components/User/layout/user-layout";
import CategoryFilter from "@/components/User/category-filter";
import SearchFiltersCategory from "@/components/User/provider-search-filters";
import ProviderCard from "@/components/User/ProviderCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/categoryService";
import { useProviders } from "@/components/User/healthcare/hook/use-provider-search-hook";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryProps } from "@/types/types";
import { useParams } from "next/navigation";

export default function Healthcare() {

    const params = useParams();

    // 1. State management for all filters
    const [filters, setFilters] = useState({
        category_id: null as number | null, // Explicitly type for clarity
        search_term: '',
    });

    // 2. Fetch the list of categories (this is correct)
    const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    });

    // 3. Fetch providers based on the current `filters` state
    const {
        providers,
        isLoading: isProvidersLoading,
        isError,
        error
    } = useProviders(filters);

    // 4. Handler to update the category filter state
    const handleSelectCategory = (categoryId: number | null) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            // Toggle logic: if the same category is clicked, reset to null
            category_id: prevFilters.category_id === categoryId ? null : categoryId,
        }));
    };


    // Handler for the main search (triggered on Enter or when input is cleared)
    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({
            ...prev,
            search_term: searchTerm,
            // Only reset category if there's a new search term
            category_id: searchTerm ? null : prev.category_id,
        }));
    };
    // Correctly combine loading states
    const isLoading = isCategoriesLoading || isProvidersLoading;

    return (
        <UserLayout>
            <div className="relative container mx-auto px-6 py-8">
                <div className="mb-6 hidden text-center md:block">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Health Care Services in{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Digos City</span>
                    </h1>
                    <p className="font-medium text-gray-700">Find the best health care services in Digos City for your needs</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center mb-6">
                    {/* Map over the categories and pass down the necessary props */}
                    {isCategoriesLoading ? (
                        // Show skeletons while categories are loading
                        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-32 rounded-md" />)
                    ) : (
                        <>
                            {/* Render "All Categories" only after categories are loaded */}
                            <Button
                                onClick={() => handleSelectCategory(null)}
                                variant={filters.category_id === null ? "default" : "outline"}
                            >
                                All Categories
                            </Button>


                            {/* Render actual categories */}
                            {categories.map((category: CategoryProps) => (
                                <CategoryFilter
                                    key={category.id}
                                    category={category}
                                    onSelect={handleSelectCategory}
                                    isActive={filters.category_id === category.id}
                                />
                            ))}
                        </>
                    )}
                </div>

                <div className="mb-6">
                    <SearchFiltersCategory onSearch={handleSearch} />
                </div>

                {isProvidersLoading ? (
                    // Show a grid of skeletons while providers are loading
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => <ProviderCardSkeleton key={i} />)}
                    </div>
                ) : isError ? (
                    <div className="text-center text-red-500">
                        <p>Something went wrong while fetching providers.</p>
                        <p>{error?.message}</p>
                    </div>
                ) : providers.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <p>No providers found for the selected filter.</p>
                    </div>
                ) : (
                    // Display the providers once loaded
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {providers.map((provider) => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}

// A simple skeleton component for a better loading experience
const ProviderCardSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
        </div>
    </div>
);