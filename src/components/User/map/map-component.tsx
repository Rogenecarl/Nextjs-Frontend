"use client";

import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import { getAllCategories } from "@/services/categoryService";
import { useProviderLocations } from "./use-provider-locatoin-hook";
import SearchFiltersCategory from "@/components/User/provider-search-filters";
import CategoryFilter from "@/components/User/category-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryProps } from "@/types/types";
import { Loader2 } from "lucide-react";
import { createCustomMarker, getCategoryData, markerStyles } from "./marker";
import { createPopupContent, popupStyles } from "./popup-card";

import { MAP_CONFIG, MAP_STYLE } from "./map-config";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // State management for filters - initialize from URL params
  const [filters, setFilters] = useState({
    category_id: null as number | null,
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

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // NEW: Fetch provider locations using our new hook
  const {
    data: providerLocations, // This is our GeoJSON data
    isLoading: isProvidersLoading,
    isError,
  } = useProviderLocations();

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Inject custom marker and popup styles
      const styleElement = document.createElement("style");
      styleElement.textContent = markerStyles + popupStyles;
      document.head.appendChild(styleElement);

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
        center: MAP_CONFIG.DEFAULT_CENTER,
        zoom: MAP_CONFIG.DEFAULT_ZOOM,
      });

      mapRef.current = map;

      // Add geolocate control to the map get users current location
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true,
        })
      );

      map.on("load", () => {
        // This is where we load the GeoJSON data
        if (providerLocations) {
          // Create custom markers for each provider
          const markers: { marker: Marker; feature: any }[] = [];

          if (providerLocations.features) {
            providerLocations.features.forEach((feature: any) => {
              // Only create markers for individual points, not clusters
              if (
                !feature.properties?.point_count &&
                feature.geometry.coordinates
              ) {
                const coordinates = feature.geometry.coordinates as [
                  number,
                  number
                ];
                const categoryId = feature.properties?.categoryId;

                // Get category data for this provider
                const categoryData = getCategoryData(categoryId, categories);

                // Create custom marker element
                const markerElement = createCustomMarker(
                  categoryId,
                  categories
                );

                // Create popup with provider details
                const popup = new mapboxgl.Popup(
                  MAP_CONFIG.POPUP_CONFIG
                ).setHTML(createPopupContent(feature, categoryData));

                // Create marker with popup attached
                const marker = new mapboxgl.Marker({
                  element: markerElement,
                  anchor: "bottom",
                })
                  .setLngLat(coordinates)
                  .setPopup(popup) // Attach popup to marker
                  .addTo(map);

                markers.push({ marker, feature });
              }
            });
          }

          // Store markers and features for filtering
          (map as any)._customMarkers = markers;
        }
      });
    }

    return () => {
      // Clean up custom markers
      if (mapRef.current && (mapRef.current as any)._customMarkers) {
        const markersData = (mapRef.current as any)._customMarkers as {
          marker: Marker;
          feature: any;
        }[];
        markersData.forEach(({ marker }) => marker.remove());
      }

      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [providerLocations, categories]); // Rerun setup if provider locations data becomes available

  // Filter custom markers based on search and category filters
  useEffect(() => {
    if (!mapRef.current || !(mapRef.current as any)._customMarkers) return;

    const markersData = (mapRef.current as any)._customMarkers as {
      marker: Marker;
      feature: any;
    }[];

    markersData.forEach(({ marker, feature }) => {
      const properties = feature.properties;

      let shouldShow = true;

      // Apply category filter
      if (
        filters.category_id &&
        properties?.categoryId !== filters.category_id
      ) {
        shouldShow = false;
      }

      // Apply search term filter
      if (filters.search_term) {
        const searchTerm = filters.search_term.toLowerCase();
        let matchesSearch = false;

        // Check provider name
        if (
          properties?.name &&
          properties.name.toLowerCase().includes(searchTerm)
        ) {
          matchesSearch = true;
        }

        // Check provider address
        if (
          properties?.address &&
          properties.address.toLowerCase().includes(searchTerm)
        ) {
          matchesSearch = true;
        }

        // Check services
        if (properties?.services && Array.isArray(properties.services)) {
          const serviceMatch = properties.services.some(
            (service: any) =>
              service.name && service.name.toLowerCase().includes(searchTerm)
          );
          if (serviceMatch) {
            matchesSearch = true;
          }
        }

        if (!matchesSearch) {
          shouldShow = false;
        }
      }

      // Show/hide marker
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.style.display = shouldShow ? "block" : "none";
      }
    });
  }, [filters, providerLocations]); // This effect runs every time the filters state changes

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
    const newUrl = queryString ? `?${queryString}` : "/map";

    router.push(newUrl, { scroll: false });
  };

  // Handler to update the category filter state
  const handleSelectCategory = (categoryId: number | null) => {
    const newFilters = {
      ...filters,
      category_id: filters.category_id === categoryId ? null : categoryId,
    };

    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  // Handler for the main search
  const handleSearch = (searchTerm: string) => {
    const newFilters = {
      ...filters,
      search_term: searchTerm,
      category_id: searchTerm ? null : filters.category_id,
    };

    setFilters(newFilters);
    updateUrlParams(newFilters);
  };

  // Calculate visible provider count based on current filters
  const getVisibleProviderCount = () => {
    if (!providerLocations?.features) return 0;

    let visibleCount = 0;
    providerLocations.features.forEach((feature: any) => {
      const properties = feature.properties;
      let shouldShow = true;

      if (
        filters.category_id &&
        properties?.categoryId !== filters.category_id
      ) {
        shouldShow = false;
      }

      if (filters.search_term) {
        const searchTerm = filters.search_term.toLowerCase();
        let matchesSearch = false;

        // Check provider name
        if (
          properties?.name &&
          properties.name.toLowerCase().includes(searchTerm)
        ) {
          matchesSearch = true;
        }

        // Check provider address
        if (
          properties?.address &&
          properties.address.toLowerCase().includes(searchTerm)
        ) {
          matchesSearch = true;
        }

        // Check services
        if (properties?.services && Array.isArray(properties.services)) {
          const serviceMatch = properties.services.some(
            (service: any) =>
              service.name && service.name.toLowerCase().includes(searchTerm)
          );
          if (serviceMatch) {
            matchesSearch = true;
          }
        }

        if (!matchesSearch) {
          shouldShow = false;
        }
      }

      if (shouldShow) visibleCount++;
    });

    return visibleCount;
  };

  // Show skeleton when providers are loading
  if (isProvidersLoading) {
    return (
      <div className="h-full flex flex-col relative bg-gray-50">
        {/* Search Bar and Category Filters Skeleton - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <div className="flex flex-row gap-3 items-center flex-wrap">
            <div className="w-64">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="flex flex-row gap-2 items-center flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        {/* Map Skeleton */}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-gray-100 relative overflow-hidden">
            {/* Map grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300" />
                ))}
              </div>
            </div>

            {/* Skeleton markers scattered across the map */}
            <div className="absolute top-1/4 left-1/3">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="absolute top-1/2 left-1/4">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="absolute top-1/3 right-1/3">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="absolute bottom-1/3 left-1/2">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="absolute top-2/3 right-1/4">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="absolute bottom-1/4 right-1/2">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            {/* Loading indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Loading map and providers...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls skeleton - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Search Bar and Category Filters - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex flex-row gap-3 items-center flex-wrap">
          <div className="w-64">
            {/* This component correctly calls handleSearch */}
            <SearchFiltersCategory
              onSearch={handleSearch}
              initialSearchTerm={filters.search_term}
            />
          </div>
          <div className="flex flex-row gap-2 items-center flex-wrap">
            {isCategoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-md" />
              ))
            ) : (
              <>
                {/* <Button
                  onClick={() => handleSelectCategory(null)}
                  variant={filters.category_id === null ? "default" : "outline"}
                  size="sm"
                >
                  All Categories
                </Button> */}
                {categories.slice(0, 5).map((category: CategoryProps) => (
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
        </div>
      </div>

      {/* Status Indicator - Bottom Center */}
      {(isProvidersLoading ||
        isError ||
        (!isProvidersLoading && providerLocations?.features?.length === 0)) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-2">
            {isProvidersLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading providers...
              </div>
            )}
            {isError && (
              <div className="text-sm text-red-600">
                Error loading providers
              </div>
            )}
            {!isProvidersLoading &&
              providerLocations?.features?.length === 0 && (
                <div className="text-sm text-gray-600">No providers found</div>
              )}
          </div>
        </div>
      )}

      {/* Provider Count - Top Right */}
      {!isProvidersLoading &&
        providerLocations?.features &&
        providerLocations.features.length > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-3 py-2">
              <div className="text-sm font-medium text-gray-900">
                {(() => {
                  const count = getVisibleProviderCount();
                  return `${count} provider${count !== 1 ? "s" : ""} found`;
                })()}
              </div>
            </div>
          </div>
        )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
