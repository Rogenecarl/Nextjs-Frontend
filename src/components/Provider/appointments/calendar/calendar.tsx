"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useProviderCalendarAppointments } from "./use-provider-calendar-hook";

import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./calendar-month-view";
import { WeekView } from "./calendar-week-veiw";
import { DayView } from "./calendar-day-view";
import type { CalendarEvent } from "@/types/calendar";

// This component no longer needs to receive appointments as a prop.
// It will fetch its own data.
export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("month");

  // 1. Calculate the start and end dates based on the current view.
  // useMemo ensures this only recalculates when the view or date changes.
  const dateRange = useMemo(() => {
    let start, end;
    if (view === "month") {
      start = startOfWeek(startOfMonth(currentDate));
      end = endOfWeek(endOfMonth(currentDate));
    } else if (view === "week") {
      start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
      end = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      // day
      start = currentDate;
      end = currentDate;
    }
    return {
      start_date: format(start, "yyyy-MM-dd"),
      end_date: format(end, "yyyy-MM-dd"),
    };
  }, [currentDate, view]);

  // 2. Fetch the appointments using our new hook and the calculated date range.
  const { data: appointments = [], isLoading } =
    useProviderCalendarAppointments(dateRange);

  // TODO: Implement event fetching logic if needed. For now, it's an empty array.
  const events: CalendarEvent[] = [];

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={setCurrentDate}
        eventCount={events.length + appointments.length} // Show total count
      />

      {/* We can add a loading indicator here for better UX */}
      {isLoading && <div className="text-center p-8">Loading calendar...</div>}

      {/* Pass the fetched appointments down to the view components */}
      <div className="min-h-[600px]">
        {!isLoading && view === "month" && (
          <MonthView
            currentDate={currentDate}
            appointments={appointments}
            events={events}
          />
        )}
        {!isLoading && view === "week" && (
          <WeekView
            currentDate={currentDate}
            appointments={appointments}
            events={events}
          />
        )}
        {!isLoading && view === "day" && (
          <DayView
            currentDate={currentDate}
            appointments={appointments}
          />
        )}
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
  );
}
