"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, List, Calendar, Grid3x3 } from "lucide-react"
import { format } from "date-fns"

interface CalendarHeaderProps {
  currentDate: Date
  view: "day" | "week" | "month"
  onViewChange: (view: "day" | "week" | "month") => void
  onDateChange: (date: Date) => void
  eventCount: number
}

export function CalendarHeader({ currentDate, view, onViewChange, onDateChange, eventCount }: CalendarHeaderProps) {
  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onDateChange(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    onDateChange(newDate)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Date Badge */}
          <div className="flex flex-col items-center justify-center bg-cyan-500 text-white rounded-lg w-14 h-14 font-semibold">
            <div className="text-xs uppercase">{format(currentDate, "MMM")}</div>
            <div className="text-2xl leading-none">{format(currentDate, "dd")}</div>
          </div>

          {/* Month/Year and Navigation */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">{format(currentDate, "MMMM yyyy")}</h1>
            <span className="text-sm text-gray-500">{eventCount} events</span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handlePrevious} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
              {format(currentDate, "MMMM d, yyyy")}
            </div>
            <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("day")}
              className="rounded-none border-r border-gray-200 h-9"
            >
              <List className="h-4 w-4 mr-2" />
              Day
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("week")}
              className="rounded-none border-r border-gray-200 h-9"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Week
            </Button>
            <Button
              variant={view === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange("month")}
              className="rounded-none h-9"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Month
            </Button>
          </div>

          {/* <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button> */}
        </div>
      </div>
    </header>
  )
}
