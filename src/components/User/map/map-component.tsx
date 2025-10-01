"use client";

import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import { getAllCategories } from "@/services/categoryService";
import { useProviderLocations } from "./use-provider-locatoin-hook";
import SearchFiltersCategory from "@/components/User/provider-search-filters";
import CategoryFilter from "@/components/User/category-filter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryProps } from "@/types/types";
import { Navigation, Loader2 } from "lucide-react";
import { createCustomMarker, getCategoryData, markerStyles } from "./marker";
import { createPopupContent, popupStyles } from "./popup-card";
import { createUserLocationMarker } from "./user-location-marker";
import { MAP_CONFIG, MAP_STYLE, GEOLOCATION_ERRORS } from "./map-config";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export default function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const userLocationMarkerRef = useRef<Marker | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // State management for filters (this remains the same)
  const [filters, setFilters] = useState({
    category_id: null as number | null,
    search_term: "",
  });

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
                const popup = new mapboxgl.Popup(MAP_CONFIG.POPUP_CONFIG)
                  .setHTML(createPopupContent(feature, categoryData));

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
      if (filters.search_term && properties?.name) {
        const searchTerm = filters.search_term.toLowerCase();
        const providerName = properties.name.toLowerCase();
        if (!providerName.includes(searchTerm)) {
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

  // Handler to update the category filter state
  const handleSelectCategory = (categoryId: number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category_id: prevFilters.category_id === categoryId ? null : categoryId,
    }));
  };

  // Handler for the main search
  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search_term: searchTerm,
      category_id: searchTerm ? null : prev.category_id,
    }));
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

      if (filters.search_term && properties?.name) {
        const searchTerm = filters.search_term.toLowerCase();
        const providerName = properties.name.toLowerCase();
        if (!providerName.includes(searchTerm)) {
          shouldShow = false;
        }
      }

      if (shouldShow) visibleCount++;
    });

    return visibleCount;
  };

  // Create and add user location marker
  const addUserLocationMarker = (lng: number, lat: number) => {
    // Remove existing user location marker
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.remove();
    }

    // Create user location marker element
    const userMarkerElement = createUserLocationMarker();

    // Create and add user location marker
    const userMarker = new mapboxgl.Marker({
      element: userMarkerElement,
      anchor: "center",
      draggable: false,
      rotationAlignment: "map",
      pitchAlignment: "map",
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current!);

    userLocationMarkerRef.current = userMarker;
    setUserLocation({ lat, lng });
  };

  // Get current location on initial load
  const getCurrentLocationOnLoad = () => {
    if (!navigator.geolocation) {
      return; // Silently fail on initial load
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          // Smoothly fly to user location with higher zoom
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: MAP_CONFIG.USER_LOCATION_ZOOM,
            duration: MAP_CONFIG.LOCATION_FLY_DURATION,
            curve: MAP_CONFIG.LOCATION_FLY_CURVE,
            easing: (t: number) => t * (2 - t),
          });

          // Create user location marker
          addUserLocationMarker(longitude, latitude);
        }
        setIsGettingLocation(false);
      },
      () => {
        // Silently handle errors on initial load but still show loading state
        setIsGettingLocation(false);
      },
      MAP_CONFIG.GEOLOCATION_OPTIONS
    );
  };

  // Get current location (for button click)
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(GEOLOCATION_ERRORS.NOT_SUPPORTED);
      return;
    }

    setIsGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: MAP_CONFIG.USER_LOCATION_ZOOM - 1,
            duration: 1500,
          });

          // Create or update user location marker
          addUserLocationMarker(longitude, latitude);
        }
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(GEOLOCATION_ERRORS.PERMISSION_DENIED);
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(GEOLOCATION_ERRORS.POSITION_UNAVAILABLE);
            break;
          case error.TIMEOUT:
            setLocationError(GEOLOCATION_ERRORS.TIMEOUT);
            break;
          default:
            setLocationError(GEOLOCATION_ERRORS.UNKNOWN);
            break;
        }
      },
      {
        ...MAP_CONFIG.GEOLOCATION_OPTIONS,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Search Bar and Category Filters - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex flex-row gap-3 items-center flex-wrap">
          <div className="w-64">
            {/* This component correctly calls handleSearch */}
            <SearchFiltersCategory onSearch={handleSearch} />
          </div>
          <div className="flex flex-row gap-2 items-center flex-wrap">
            {isCategoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-md" />
              ))
            ) : (
              <>
                <Button
                  onClick={() => handleSelectCategory(null)}
                  variant={filters.category_id === null ? "default" : "outline"}
                  size="sm"
                >
                  All Categories
                </Button>
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
      {/* Current Location Button - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10">
        <Button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 text-gray-700 hover:bg-white hover:text-gray-900"
          size="sm"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Status Indicator - Bottom Center */}
      {(isProvidersLoading ||
        isError ||
        (!isProvidersLoading && providerLocations?.features?.length === 0) ||
        locationError) && (
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
            {locationError && (
              <div className="text-sm text-red-600">{locationError}</div>
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
