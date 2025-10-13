"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ProviderServicesTablePaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ProviderServicesTablePagination({
  pagination,
  currentPage,
  onPageChange,
}: ProviderServicesTablePaginationProps) {
  const { current_page, last_page, per_page, total } = pagination;

  // Calculate the range of items being shown
  const startItem = (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (last_page <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current_page > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, current_page - 1);
      const end = Math.min(last_page - 1, current_page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current_page < last_page - 2) {
        pages.push("...");
      }

      // Always show last page
      if (last_page > 1) {
        pages.push(last_page);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Debug: Log pagination data
  console.log("Pagination data:", pagination);

  // Don't render if there's only one page
  if (last_page <= 1) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 border-t border-gray-100 pt-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{startItem}</span> to{" "}
          <span className="font-medium">{endItem}</span> of{" "}
          <span className="font-medium">{total}</span> services
        </div>
        <div className="text-sm text-gray-400">
          Page {current_page} of {last_page}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 border-t border-gray-100 pt-4">
      {/* Items count */}
      <div className="text-sm text-gray-500 order-2 sm:order-1">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{total}</span> services
      </div>

      {/* Pagination controls */}
      <div className="order-1 sm:order-2">
        <Pagination>
          <PaginationContent>
            {/* Previous button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (current_page > 1) {
                    onPageChange(current_page - 1);
                  }
                }}
                className={
                  current_page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-gray-50"
                }
              />
            </PaginationItem>

            {/* Page numbers */}
            <div className="hidden sm:contents">
              {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page as number);
                      }}
                      isActive={current_page === page}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-50 rounded border">
              {current_page} of {last_page}
            </div>

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (current_page < last_page) {
                    onPageChange(current_page + 1);
                  }
                }}
                className={
                  current_page === last_page
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer hover:bg-gray-50"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

// Export the interface for reuse
export type { PaginationData };
