import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HealthcareContent from "./healthcare-content";

export default function Healthcare() {
  return (
    <Suspense fallback={<HealthcarePageSkeleton />}>
      <HealthcareContent />
    </Suspense>
  );
}

// Skeleton for the entire page while loading
const HealthcarePageSkeleton = () => (
  <div className="relative container mx-auto px-6 py-2">
    <div className="mb-6 hidden text-center md:block">
      <Skeleton className="h-8 w-96 mx-auto mb-2" />
      <Skeleton className="h-4 w-80 mx-auto" />
    </div>

    <div className="flex flex-wrap items-center gap-2 justify-center mb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-32 rounded-md" />
      ))}
    </div>

    <div className="mb-6">
      <Skeleton className="h-12 w-full rounded-md" />
    </div>

    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

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
