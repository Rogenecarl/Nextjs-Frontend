import MapComponent from "@/components/User/map/map-component";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <Suspense fallback={<MapPageSkeleton />}>
          <MapComponent />
        </Suspense>
      </div>
    </div>
  );
}

// Skeleton for the map page while loading
const MapPageSkeleton = () => (
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

        {/* Loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Loading map...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
