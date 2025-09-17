import { Skeleton } from "@/components/ui/skeleton"
import UserLayout from "@/components/User/layout/user-layout"
import SearchFiltersCategory from "@/components/User/provider-search-filters"

export const HealthCareSkeleton = () => {

    return (
        <UserLayout>
            <div className="relative container mx-auto px-6">
                <div className="mb-6 hidden text-center md:block">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Health Care Services in{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Digos City</span>
                    </h1>
                    <p className="font-medium text-gray-700">Find the best health care services in Digos City for your needs</p>
                </div>
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

