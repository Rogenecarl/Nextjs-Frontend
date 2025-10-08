"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Clock,
  List,
  CheckCircle,
  Archive,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  // Appointment filter props
  activeFilter?: "all" | "today" | "upcoming" | "history" | "cancelled" | null;
  onFilterChange?: (
    filter: "today" | "upcoming" | "history" | "cancelled" | "pending" | null
  ) => void;
  appointmentCounts?: {
    all: number;
    today: number;
    upcoming: number;
    history: number;
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
    today: 0,
    upcoming: 0,
    history: 0,
    cancelled: 0,
  },
}: AppointmentFilterProps) {

  const hasActiveFilters = searchQuery;

  const appointmentFilters = [
    {
      key: null,
      label: "All Appointments",
      icon: List,
      count: appointmentCounts.all,
      color: "bg-gray-100 text-gray-800",
    },
    {
      key: "today" as const,
      label: "Today",
      icon: Clock,
      count: appointmentCounts.today,
      color: "bg-blue-100 text-blue-800",
    },
    {
      key: "upcoming" as const,
      label: "Upcoming",
      icon: CheckCircle,
      count: appointmentCounts.upcoming,
      color: "bg-green-100 text-green-800",
    },
    {
      key: "history" as const,
      label: "History",
      icon: Archive,
      count: appointmentCounts.history,
      color: "bg-purple-100 text-purple-800",
    },
    {
      key: "cancelled" as const,
      label: "Cancelled",
      icon: XCircle,
      count: appointmentCounts.cancelled,
      color: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Appointment Type Filters */}
      {onFilterChange && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Appointments
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Choose appointment type to view
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {appointmentFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = (activeFilter === "all" && filter.key === null) || activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => onFilterChange(filter.key)}
                  className={cn(
                    "flex items-center gap-3 px-4 h-11 rounded-lg border transition-all duration-200 text-sm font-medium min-w-[140px]",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-md hover:shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{filter.label}</div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs px-2 py-1 font-semibold",
                      isActive
                        ? "bg-white/20 text-white border-white/20"
                        : "bg-gray-100 text-gray-700 border-gray-200"
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

      {/* Search and Advanced Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Main Filters Bar */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search - Stretched */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search patients, services, or appointment ID..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 w-full"
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
            </div>


          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
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
                  className="text-xs h-7 px-3 text-gray-600 hover:text-gray-900"
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}