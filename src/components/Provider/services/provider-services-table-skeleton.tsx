"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ProviderServicesTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="text-gray-700 font-semibold py-4 px-6">
                  Service Name
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-4">
                  Description
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-4">
                  Price Range
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-4">
                  Status
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-4">
                  Sort Order
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-b border-gray-100">
                  <TableCell className="py-4 px-6">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="space-y-3 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}