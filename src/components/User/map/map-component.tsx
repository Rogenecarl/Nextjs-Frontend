"use client";

import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import { getAllCategories } from "@/services/categoryService";
import { useProviders } from "@/components/User/healthcare/hook/use-provider-search-hook";
import SearchFiltersCategory from "@/components/User/provider-search-filters";
import CategoryFilter from "@/components/User/category-filter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryProps, ProviderProps } from "@/types/types";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

// Category color mapping for different marker colors
const getCategoryColor = (categoryId: number | undefined) => {
  const colors = {
    1: "#3B82F6", // Blue - Hospitals
    2: "#10B981", // Green - Health Centers
    3: "#F59E0B", // Yellow - Dental Clinics
    4: "#EF4444", // Red - Veterinary
    5: "#8B5CF6", // Purple - Dermatology
    default: "#6B7280", // Gray - Default
  };
  return colors[categoryId as keyof typeof colors] || colors.default;
};

export default function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  // State management for filters
  const [filters, setFilters] = useState({
    category_id: null as number | null,
    search_term: "",
  });

  // Fetch categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Fetch providers based on filters
  const {
    providers,
    isLoading: isProvidersLoading,
    isError,
    error,
  } = useProviders(filters);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/rogenecarl/cmcoe04d8008l01sq35v2hqdt",
      center: [125.365847, 6.74468], // Default to Philippines center
      zoom: 12,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add center map button
    const centerButton = document.createElement("button");
    centerButton.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    centerButton.innerHTML = `
      <button class="mapboxgl-ctrl-icon" type="button" title="Center Map" style="background-image: none; display: flex; align-items: center; justify-content: center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
        </svg>
      </button>
    `;

    centerButton.addEventListener("click", () => {
      if (mapRef.current && markersRef.current.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        markersRef.current.forEach((marker) => {
          bounds.extend(marker.getLngLat());
        });
        mapRef.current!.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }
    });

    mapRef.current.addControl(
      {
        onAdd: () => centerButton,
        onRemove: () => centerButton.remove(),
      } as mapboxgl.IControl,
      "bottom-right"
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when providers change
  useEffect(() => {
    if (!mapRef.current || !providers) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers for each provider
    providers.forEach((provider: ProviderProps) => {
      if (provider.longitude && provider.latitude) {
        // Find the category for this provider to get the icon and color
        const providerCategory = categories.find(
          (cat: CategoryProps) => cat.id === provider.category_id
        );

        const categoryId = providerCategory?.id;
        const markerColor = getCategoryColor(categoryId);

        // Create marker element with category icon
        const markerElement = document.createElement("div");
        markerElement.className = "custom-marker";
        markerElement.style.cssText = `
          width: 36px;
          height: 36px;
          background-color: ${markerColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        `;

        // Add category icon or default icon
        markerElement.innerHTML = providerCategory?.icon || "🏥";

        // Add hover effect
        markerElement.addEventListener("mouseenter", () => {
          markerElement.style.transform = "scale(1.15)";
          markerElement.style.zIndex = "1000";
        });
        markerElement.addEventListener("mouseleave", () => {
          markerElement.style.transform = "scale(1)";
          markerElement.style.zIndex = "auto";
        });

        // Create popup content
        const popupContent = `
          <div class="p-4 min-w-[280px] max-w-[320px]">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg" style="background-color: ${markerColor}20; color: ${markerColor};">
                ${providerCategory?.icon || "🏥"}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-lg text-gray-900 mb-1 leading-tight">${
                  provider.healthcare_name
                }</h3>
                <p class="text-sm text-gray-600 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  ${provider.address}
                </p>
              </div>
            </div>
            ${
              provider.services && provider.services.length > 0
                ? `
              <div class="mb-4">
                <p class="text-xs font-medium text-gray-700 mb-2">Available Services:</p>
                <div class="flex flex-wrap gap-1">
                  ${provider.services
                    .slice(0, 3)
                    .map(
                      (service) =>
                        `<span class="text-xs px-2 py-1 rounded-full" style="background-color: ${markerColor}15; color: ${markerColor};">${service.name}</span>`
                    )
                    .join("")}
                  ${
                    provider.services.length > 3
                      ? `<span class="text-xs text-gray-500 px-2 py-1">+${
                          provider.services.length - 3
                        } more</span>`
                      : ""
                  }
                </div>
              </div>
            `
                : ""
            }
            <button 
              onclick="window.location.href='/providers/${provider.id}'" 
              class="w-full text-white text-sm py-2.5 px-4 rounded-lg font-medium transition-colors"
              style="background-color: ${markerColor};"
              onmouseover="this.style.opacity='0.9'"
              onmouseout="this.style.opacity='1'"
            >
              View Details & Book
            </button>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          className: "custom-popup",
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([
            parseFloat(provider.longitude),
            parseFloat(provider.latitude),
          ])
          .setPopup(popup)
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      markersRef.current.forEach((marker) => {
        bounds.extend(marker.getLngLat());
      });

      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  }, [providers, categories]);

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

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
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
            zoom: 15,
            duration: 1500,
          });
        }
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied by user");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An unknown error occurred");
            break;
        }
      },
      {
        enableHighAccuracy: true,
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
          {/* Search Bar */}
          <div className="w-64">
            <SearchFiltersCategory onSearch={handleSearch} />
          </div>

          {/* Category Filter Pills */}
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
                  className="text-xs"
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
        (!isProvidersLoading && providers.length === 0) ||
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
            {!isProvidersLoading && providers.length === 0 && (
              <div className="text-sm text-gray-600">No providers found</div>
            )}
            {locationError && (
              <div className="text-sm text-red-600">{locationError}</div>
            )}
          </div>
        </div>
      )}

      {/* Provider Count - Top Left */}
      {!isProvidersLoading && providers.length > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-3 py-2">
            <div className="text-sm font-medium text-gray-900">
              {providers.length} provider{providers.length !== 1 ? "s" : ""}{" "}
              found
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Custom CSS for popup styling */}
      <style jsx global>{`
        .custom-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white;
        }
        .custom-popup .mapboxgl-popup-close-button {
          font-size: 18px;
          padding: 8px;
          color: #6b7280;
        }
        .custom-popup .mapboxgl-popup-close-button:hover {
          background-color: #f3f4f6;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
