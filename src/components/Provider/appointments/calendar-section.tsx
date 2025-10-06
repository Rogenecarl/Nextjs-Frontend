"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CalendarHeader } from "@/components/Provider/appointments/calendar/calendar-header"
import { MonthView } from "@/components/Provider/appointments/calendar/calendar-month-view"
import { WeekView } from "@/components/Provider/appointments/calendar/calendar-week-veiw"
import { DayView } from "@/components/Provider/appointments/calendar/calendar-day-view"
import type { CalendarEvent, Appointment } from "@/types/calendar"
import { Calendar, Grid3x3, List } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarSectionProps {
  events: CalendarEvent[]
  appointments: Appointment[]
}

export function CalendarSection({ events, appointments }: CalendarSectionProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 6))
  const [view, setView] = useState<"day" | "week" | "month">("month")

  const viewOptions = [
    { key: "day" as const, label: "Day", icon: List },
    { key: "week" as const, label: "Week", icon: Grid3x3 },
    { key: "month" as const, label: "Month", icon: Calendar }
  ]

  return (
    <div className="space-y-4">
      {/* Calendar Controls */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onDateChange={setCurrentDate}
          eventCount={events.length}
        />
      </div>

      {/* View Toggle - Mobile Friendly */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Calendar View</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {viewOptions.map((option) => {
            const Icon = option.icon
            return (
              <Button
                key={option.key}
                variant={view === option.key ? "default" : "outline"}
                size="sm"
                onClick={() => setView(option.key)}
                className={cn(
                  "gap-2 justify-center",
                  view === option.key && "bg-cyan-500 hover:bg-cyan-600"
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Calendar Views */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="min-h-[600px]">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              appointments={appointments}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              appointments={appointments}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              appointments={appointments}
            />
          )}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium text-gray-900 mb-3">Status Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-200 border border-yellow-300"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300"></div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-200 border border-green-300"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-200 border border-red-300"></div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  )
}