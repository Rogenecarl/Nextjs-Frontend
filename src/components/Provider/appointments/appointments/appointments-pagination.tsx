"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  filteredItems: number;
  hasActiveFilters: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function AppointmentsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  filteredItems,
  hasActiveFilters,
  onPageChange,
  onPageSizeChange,
}: AppointmentsPaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, filteredItems);

  return (
    <div className="flex items-center justify-between py-4">
      {/* Results Summary */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium text-gray-900">{startItem}</span> -{" "}
          <span className="font-medium text-gray-900">{endItem}</span> of{" "}
          <span className="font-medium text-gray-900">
            {filteredItems}
          </span>{" "}
          appointments
          {hasActiveFilters && (
            <span className="text-gray-500">
              {" "}
              (filtered from {totalItems} total)
            </span>
          )}
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-16 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* Previous Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 px-3 text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page Info */}
          <span className="text-sm text-gray-600 px-3">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 px-3 text-sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}