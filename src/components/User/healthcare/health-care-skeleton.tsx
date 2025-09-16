import { Skeleton } from "@/components/ui/skeleton"
import UserLayout from "@/components/User/layout/user-layout"
import SearchFiltersCategory from "@/components/User/provider-search-filters"

export const HealthCareSkeleton = () => {

    return (
        <UserLayout>
            <div className="relative container mx-auto px-6">
                {/* Header Section - hidden on mobile */}
                <div className="mb-6 hidden text-center md:block">
                    <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-6 w-2/4 mx-auto" />
                </div>
                <div className="mb-6">
                    <SearchFiltersCategory />
                </div>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="rounded-lg border bg-card">
                            <Skeleton className="h-48 rounded-t-lg" /> {/* Image */}
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-6 w-3/4" /> {/* Title */}
                                <Skeleton className="h-4 w-full" /> {/* Description */}
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" /> {/* Rating */}
                                    <Skeleton className="h-8 w-24" /> {/* Button */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </UserLayout>
    );

}