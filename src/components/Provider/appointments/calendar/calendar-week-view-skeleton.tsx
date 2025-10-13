"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function CalendarWeekViewSkeleton() {
  const weekDays = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 bg-gray-50">
        <div className="border-r border-gray-200" />
        {weekDays.map((_, index) => (
          <div
            key={index}
            className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0"
          >
            <Skeleton className="h-3 w-8 mx-auto mb-1" />
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Time grid skeleton */}
      <div className="overflow-auto max-h-[calc(100vh-250px)]">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.slice(0, 12).map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="border-r border-b border-gray-200 px-2 py-4 bg-gray-50">
                <Skeleton className="h-3 w-8 ml-auto" />
              </div>

              {/* Day columns */}
              {weekDays.map((_, dayIndex) => (
                <div
                  key={`${hour}-${dayIndex}`}
                  className="border-r border-b border-gray-200 min-h-[60px] last:border-r-0 p-1"
                >
                  {Math.random() > 0.7 && (
                    <Skeleton className="h-12 w-full rounded" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}