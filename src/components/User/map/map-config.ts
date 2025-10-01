// Map configuration constants
export const MAP_CONFIG = {
  // Default map center (Philippines - Butuan City)
  DEFAULT_CENTER: [125.365847, 6.74468] as [number, number],
  DEFAULT_ZOOM: 13,
  
  // User location settings
  USER_LOCATION_ZOOM: 15,
  LOCATION_FLY_DURATION: 2000,
  LOCATION_FLY_CURVE: 1.42,
  
  // Geolocation options
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 8000,
    maximumAge: 300000, // 5 minutes
  },
  
  // Popup configuration
  POPUP_CONFIG: {
    offset: 25,
    closeButton: true,
    closeOnClick: true,
    className: "custom-popup",
  },
} as const;

// Map style URL
export const MAP_STYLE = "mapbox://styles/rogenecarl/cmcoe04d8008l01sq35v2hqdt";