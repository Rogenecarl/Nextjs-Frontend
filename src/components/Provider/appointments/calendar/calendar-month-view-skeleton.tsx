"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function CalendarMonthViewSkeleton() {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-4 py-3 text-sm font-medium text-gray-600 text-center bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid skeleton */}
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[140px] border-r border-b border-gray-200 p-2 last:border-r-0"
          >
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-6 w-full rounded" />
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}