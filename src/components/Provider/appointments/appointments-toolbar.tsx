"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  List,
  Grid3x3,
  Clock,
  CheckCircle,
  XCircle,
  Archive
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppointmentsToolbarProps {
  view: "day" | "week" | "month" | "list"
  onViewChange: (view: "day" | "week" | "month" | "list") => void
  selectedFilter: "all" | "today" | "upcoming" | "history" | "cancelled"
  onFilterChange: (filter: "all" | "today" | "upcoming" | "history" | "cancelled") => void
  appointmentCount: number
}

export function AppointmentsToolbar({
  view,
  onViewChange,
  selectedFilter,
  onFilterChange,
  appointmentCount
}: AppointmentsToolbarProps) {
  const filterOptions = [
    { key: "all", label: "All Appointments", icon: Calendar, count: appointmentCount },
    { key: "today", label: "Today", icon: Clock, count: 3 },
    { key: "upcoming", label: "Upcoming", icon: CheckCircle, count: 8 },
    { key: "history", label: "History", icon: Archive, count: 24 },
    { key: "cancelled", label: "Cancelled", icon: XCircle, count: 2 }
  ] as const

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Filters and Search */}
        <div className="flex items-center gap-4">
          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.key}
                  variant={selectedFilter === option.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onFilterChange(option.key)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                  <Badge variant="secondary" className="ml-1">
                    {option.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Right side - Search, View Toggle, Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients or appointments..."
              className="pl-10 w-80"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("list")}
              className="rounded-none border-r border-gray-200 h-9"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("day")}
              className="rounded-none border-r border-gray-200 h-9"
            >
              <Calendar className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("week")}
              className="rounded-none border-r border-gray-200 h-9"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("month")}
              className="rounded-none h-9"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>By Status</DropdownMenuItem>
              <DropdownMenuItem>By Service Type</DropdownMenuItem>
              <DropdownMenuItem>By Date Range</DropdownMenuItem>
              <DropdownMenuItem>By Patient</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}