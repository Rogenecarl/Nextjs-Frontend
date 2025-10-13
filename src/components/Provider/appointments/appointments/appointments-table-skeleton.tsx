"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function AppointmentsTableSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Desktop Table Skeleton */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-gray-700 font-semibold py-4 px-6">Appointment #</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Name</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Date & Time</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Service</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Status</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Price</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index} className="border-b border-gray-100 last:border-0">
                <TableCell className="py-4 px-6">
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>

                <TableCell className="py-4">
                  <Skeleton className="h-4 w-16" />
                </TableCell>

                <TableCell className="py-4">
                  <Skeleton className="h-8 w-8 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View Skeleton */}
      <div className="lg:hidden">
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 bg-white"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>

              {/* Avatar and Name */}
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}