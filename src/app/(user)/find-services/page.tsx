"use client";

import UserLayout from "@/components/User/layout/user-layout";
import CategoryFilter from "@/components/User/category-filter";
import SearchFiltersCategory from "@/components/User/provider-search-filters";
import ProviderCard from "@/components/User/ProviderCard";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/categoryService";
import { useProviders } from "@/components/User/find-services/hook/use-provider-search-hook";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryProps } from "@/types/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Healthcare() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. State management for all filters - initialize from URL params
  const [filters, setFilters] = useState({
    category_id: null as number | null, // Explicitly type for clarity
    search_term: "",
  });

  // Initialize filters from URL params on component mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    setFilters({
      category_id: categoryParam ? parseInt(categoryParam) : null,
      search_term: searchParam || "",
    });
  }, [searchParams]);

  // 2. Fetch the list of categories (this is correct)
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // 3. Fetch providers based on the current `filters` state
  const {
    providers,
    isLoading: isProvidersLoading,
    isError,
    error,
  } = useProviders(filters);

  // Helper function to update URL params
  const updateUrlParams = (newFilters: {
    category_id: number | null;
    search_term: string;
  }) => {
    const params = new URLSearchParams();

    if (newFilters.category_id) {
      params.set("category", newFilters.category_id.toString());
    }

    if (newFilters.search_term) {
      params.set("search", newFilters.search_term);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "/find-services";

    router.push(newUrl, { scroll: false });
  };

  // 4. Handler to update the category filter state
  const handleSelectCategory = (categoryId: number | null) => {
    const newFilters = {
      ...filters,
      // Toggle logic: if the same category is clicked, reset to null
      category_id: filters.category_id === categoryId ? null : categoryId,
    };

    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  // Handler for the main search (triggered on Enter or when input is cleared)
  const handleSearch = (searchTerm: string) => {
    const newFilters = {
      ...filters,
      search_term: searchTerm,
      // Only reset category if there's a new search term
      category_id: searchTerm ? null : filters.category_id,
    };

    setFilters(newFilters);
    updateUrlParams(newFilters);
  };
  // Correctly combine loading states
  const isLoading = isCategoriesLoading || isProvidersLoading;

  return (
    <UserLayout>
      <div className="relative container mx-auto px-6 py-2">
        <div className="mb-6 hidden text-center md:block">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Health Care Services in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digos City
            </span>
          </h1>
          <p className="font-medium text-gray-700">
            Find the best health care services in Digos City for your needs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center mb-6">
          {/* Map over the categories and pass down the necessary props */}
          {isCategoriesLoading ? (
            // Show skeletons while categories are loading
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))
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
          <SearchFiltersCategory
            onSearch={handleSearch}
            initialSearchTerm={filters.search_term}
          />
        </div>

        {isProvidersLoading ? (
          // Show a grid of skeletons while providers are loading
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProviderCardSkeleton key={i} />
            ))}
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
