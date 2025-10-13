"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Week headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="px-4 py-3 bg-gray-50">
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, index) => (
            <div
              key={index}
              className="min-h-[140px] border-r border-b border-gray-200 p-2 last:border-r-0"
            >
              <Skeleton className="h-4 w-6 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-6 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}