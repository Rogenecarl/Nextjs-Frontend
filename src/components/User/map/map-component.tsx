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
import { MapPin, Navigation, Loader2 } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

// Add custom styles for markers
const markerStyles = `
  @keyframes markerPulse {
    0% {
      transform: rotate(-45deg) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: rotate(-45deg) scale(1.2);
      opacity: 0.3;
    }
    100% {
      transform: rotate(-45deg) scale(1);
      opacity: 0.6;
    }
  }
  
  .custom-marker .marker-body {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .custom-marker:hover .marker-body {
    transform: rotate(-45deg) scale(1.1) !important;
  }
  
  .custom-marker .marker-pulse {
    animation: markerPulse 2s infinite;
  }
  
  .mapboxgl-popup-content {
    border-radius: 12px !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    padding: 0 !important;
  }
  
  .mapboxgl-popup-tip {
    border-top-color: white !important;
  }
  
  .mapboxgl-popup-close-button {
    font-size: 18px !important;
    padding: 8px !important;
    color: #6b7280 !important;
  }
  
  .mapboxgl-popup-close-button:hover {
    background-color: #f3f4f6 !important;
    color: #374151 !important;
  }
`;

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

// Create custom marker element with category-specific styling
const createCustomMarker = (categoryId: number | undefined) => {
  const color = getCategoryColor(categoryId);
  const markerElement = document.createElement("div");
  markerElement.className = "custom-marker";
  
  // Create the marker with modern design
  markerElement.innerHTML = `
    <div class="marker-container" style="
      position: relative;
      width: 32px;
      height: 32px;
      cursor: pointer;
      transform: translate(-50%, -100%);
    ">
      <!-- Main marker body -->
      <div class="marker-body" style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
        position: relative;
        transition: all 0.2s ease;
      ">
        <!-- Inner dot -->
        <div class="marker-dot" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
      
      <!-- Pulse animation ring -->
      <div class="marker-pulse" style="
        position: absolute;
        top: -2px;
        left: -2px;
        width: 36px;
        height: 36px;
        border: 2px solid ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        opacity: 0.6;
        animation: markerPulse 2s infinite;
      "></div>
    </div>
  `;
  
  // Add hover effects
  const markerBody = markerElement.querySelector('.marker-body') as HTMLElement;
  if (markerBody) {
    markerElement.addEventListener('mouseenter', () => {
      markerBody.style.transform = 'rotate(-45deg) scale(1.1)';
      markerBody.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.15)';
    });
    
    markerElement.addEventListener('mouseleave', () => {
      markerBody.style.transform = 'rotate(-45deg) scale(1)';
      markerBody.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
    });
  }
  
  return markerElement;
};

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
      // Inject custom marker styles
      const styleElement = document.createElement('style');
      styleElement.textContent = markerStyles;
      document.head.appendChild(styleElement);
      
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/rogenecarl/cmcoe04d8008l01sq35v2hqdt",
        center: [125.365847, 6.74468],
        zoom: 13,
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
              if (!feature.properties?.point_count && feature.geometry.coordinates) {
                const coordinates = feature.geometry.coordinates as [number, number];
                const categoryId = feature.properties?.categoryId;
                
                // Create custom marker element
                const markerElement = createCustomMarker(categoryId);
                
                // Create marker with popup
                const marker = new mapboxgl.Marker({
                  element: markerElement,
                  anchor: 'bottom'
                })
                .setLngLat(coordinates)
                .addTo(map);
                
                // Add click handler for popup
                markerElement.addEventListener('click', () => {
                  const category = categories.find(
                    (c: CategoryProps) => c.id === categoryId
                  );
                  const markerColor = getCategoryColor(categoryId);
                  
                  const popupContent = `
                    <div class="p-4 min-w-[280px] max-w-[320px]">
                        <h3 class="font-semibold text-lg text-gray-900 mb-1">${feature.properties?.name || 'Healthcare Provider'}</h3>
                        <p class="text-sm text-gray-600 mb-2">${feature.properties?.address || 'Address not available'}</p>
                        ${category ? `<span class="inline-block px-2 py-1 text-xs font-medium rounded-full mb-3" style="background-color: ${markerColor}20; color: ${markerColor};">${category.name}</span>` : ''}
                        <button 
                            onclick="window.location.href='/providers/${feature.properties?.id}'" 
                            class="mt-4 w-full text-white text-sm py-2.5 px-4 rounded-lg font-medium transition-all duration-200 hover:opacity-90 hover:shadow-md"
                            style="background-color: ${markerColor};"
                        >
                            View Details & Book
                        </button>
                    </div>`;
                  
                  new mapboxgl.Popup({
                    offset: 25,
                    closeButton: true,
                    closeOnClick: true,
                    className: 'custom-popup'
                  })
                    .setLngLat(coordinates)
                    .setHTML(popupContent)
                    .addTo(map);
                });
                
                markers.push({ marker, feature });
              }
            });
          }
          
          // Store markers and features for filtering
          (map as any)._customMarkers = markers;

          // --- Cluster Interactivity ---

          map.on("click", "clusters", (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ["clusters"],
            });
            const clusterId = features[0].properties!.cluster_id;
            const source = map.getSource(
              "providers-source"
            ) as mapboxgl.GeoJSONSource;
            source.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              map.easeTo({
                center: (features[0].geometry as any).coordinates,
                zoom: zoom!,
              });
            });
          });


          map.on("mouseenter", "clusters", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "clusters", () => {
            map.getCanvas().style.cursor = "";
          });
        }
      });
    }

    return () => {
      // Clean up custom markers
      if (mapRef.current && (mapRef.current as any)._customMarkers) {
        const markersData = (mapRef.current as any)._customMarkers as { marker: Marker; feature: any }[];
        markersData.forEach(({ marker }) => marker.remove());
      }
      
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [providerLocations, categories]); // Rerun setup if provider locations data becomes available

  // Filter custom markers based on search and category filters
  useEffect(() => {
    if (!mapRef.current || !(mapRef.current as any)._customMarkers) return;

    const markersData = (mapRef.current as any)._customMarkers as { marker: Marker; feature: any }[];
    
    markersData.forEach(({ marker, feature }) => {
      const properties = feature.properties;
      
      let shouldShow = true;
      
      // Apply category filter
      if (filters.category_id && properties?.categoryId !== filters.category_id) {
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
        markerElement.style.display = shouldShow ? 'block' : 'none';
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
      
      if (filters.category_id && properties?.categoryId !== filters.category_id) {
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

  // Create user location marker
  const createUserLocationMarker = (lng: number, lat: number) => {
    // Remove existing user location marker
    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.remove();
    }

    // Create user location marker element (blue dot with white border like in image)
    const userMarkerElement = document.createElement("div");
    userMarkerElement.style.cssText = `
            width: 20px;
            height: 20px;
            background-color: #007AFF;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            position: relative;
            `;

    // Add pulsing animation
    const pulseElement = document.createElement("div");
    pulseElement.style.cssText = `
            width: 20px;
            height: 20px;
            background-color: rgba(0, 122, 255, 0.3);
            border-radius: 50%;
            position: absolute;
            top: -3px;
            left: -3px;
            animation: pulse 2s infinite;
            `;

    userMarkerElement.appendChild(pulseElement);

    // Create and add user location marker
    const userMarker = new mapboxgl.Marker({
      element: userMarkerElement,
      anchor: "center", // Keep center anchor for the circular user location marker
      draggable: false, // Prevent dragging
      rotationAlignment: "map", // Keep marker aligned with map
      pitchAlignment: "map", // Keep marker aligned with map pitch
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
            zoom: 15,
            duration: 2000,
            curve: 1.42,
            easing: (t: number) => t * (2 - t),
          });

          // Create user location marker
          createUserLocationMarker(longitude, latitude);
        }
        setIsGettingLocation(false);
      },
      () => {
        // Silently handle errors on initial load but still show loading state
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Get current location (for button click)
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
            zoom: 14,
            duration: 1500,
          });

          // Create or update user location marker
          createUserLocationMarker(longitude, latitude);
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
