"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function CalendarDayViewSkeleton() {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4">
      {/* Main Day View Grid Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <header className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-6 w-8" />
        </header>

        <div className="overflow-auto max-h-[calc(100vh-250px)]">
          {hours.slice(0, 12).map((hour) => (
            <div key={hour} className="flex border-b border-gray-200">
              <div className="w-20 flex-shrink-0 border-r border-gray-200 px-3 py-4 bg-gray-50">
                <Skeleton className="h-3 w-8 ml-auto" />
              </div>
              <div className="flex-1 min-h-[60px] p-2">
                {Math.random() > 0.8 && (
                  <Skeleton className="h-12 w-full rounded" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="space-y-4">
        {/* Calendar Widget Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-6 mx-auto" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-6" />
            ))}
          </div>
        </div>

        {/* Appointments List Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="space-y-1 mb-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}