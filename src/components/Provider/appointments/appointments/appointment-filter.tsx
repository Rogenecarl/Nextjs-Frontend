"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  // Appointment filter props
  activeFilter?: "all" | "pending" | "confirmed" | "completed" | "cancelled" | null;
  onFilterChange?: (
    filter: "pending" | "confirmed" | "completed" | "cancelled" | null
  ) => void;
  appointmentCounts?: {
    all: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

export function AppointmentFilter({
  searchQuery,
  onSearchChange,
  onClearFilters,
  activeFilter = "all",
  onFilterChange,
  appointmentCounts = {
    all: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  },
}: AppointmentFilterProps) {

  const hasActiveFilters = searchQuery;

  const appointmentFilters = [
    {
      key: null,
      label: "All Appointments",
      count: appointmentCounts.all,
    },
    {
      key: "pending" as const,
      label: "Pending",
      count: appointmentCounts.pending,
      icon: Clock,
    },
    {
      key: "confirmed" as const,
      label: "Confirmed",
      count: appointmentCounts.confirmed,
      icon: CheckCircle,
    },
    {
      key: "completed" as const,
      label: "Completed",
      count: appointmentCounts.completed,
      icon: CheckCircle,
    },
    {
      key: "cancelled" as const,
      label: "Cancelled",
      count: appointmentCounts.cancelled,
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      {onFilterChange && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Filter Appointments
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Choose appointment type to view
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {appointmentFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = (activeFilter === "all" && filter.key === null) || activeFilter === filter.key;
              return (
                <button
                  key={filter.key || 'all'}
                  onClick={() => onFilterChange(filter.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{filter.label}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs ml-1",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {filter.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search patients, services, or appointment ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 border-gray-200 focus:border-gray-300 focus:ring-0"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">
            Active filters:
          </span>
          {searchQuery && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Search: "{searchQuery}"
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs h-6 px-2 text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}