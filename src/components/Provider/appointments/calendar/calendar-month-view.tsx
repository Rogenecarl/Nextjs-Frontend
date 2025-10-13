"use client";

import { useState } from "react";
import type { CalendarEvent, Appointment } from "@/types/calendar";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AppointmentCard } from "./appointment-card";
import { DayAppointmentsDialog } from "./day-appointments-dialog";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  appointments?: Appointment[];
}

const eventColorClasses = {
  teal: "bg-teal-100 text-teal-700 border-teal-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  red: "bg-red-100 text-red-700 border-red-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
};

export function MonthView({
  currentDate,
  events,
  appointments = [],
}: MonthViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayDialogOpen, setDayDialogOpen] = useState(false);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(new Date(appointment.start_time), day)
    );
  };

  const handleShowMoreClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(day);
    setDayDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="px-4 py-3 text-sm font-medium text-gray-600 text-center bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const dayAppointments = getAppointmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          // Combine events and appointments for display
          const allItems = [
            ...dayEvents.map((event) => ({ type: "event", data: event })),
            ...dayAppointments.map((apt) => ({
              type: "appointment",
              data: apt,
            })),
          ];

          const visibleItems = allItems.slice(0, 3);
          const remainingCount = allItems.length - visibleItems.length;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[140px] border-r border-b border-gray-200 p-2 hover:bg-gray-50 transition-colors cursor-pointer",
                !isCurrentMonth && "bg-gray-50",
                isToday && "bg-blue-50 border-blue-200",
                index % 7 === 6 && "border-r-0"
              )}
            >
              <div
                className={cn(
                  "text-sm font-medium mb-2 flex items-center justify-between",
                  isCurrentMonth ? "text-gray-900" : "text-gray-400",
                  isToday && "text-blue-600"
                )}
              >
                <span>{format(day, "d")}</span>
                {dayAppointments.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {dayAppointments.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                {visibleItems.map((item, itemIndex) => {
                  if (item.type === "event") {
                    const event = item.data as CalendarEvent;
                    return (
                      <div
                        key={`event-${event.id}`}
                        className={cn(
                          "text-xs px-2 py-1 rounded border truncate",
                          eventColorClasses[
                            event.color as keyof typeof eventColorClasses
                          ]
                        )}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-[10px] opacity-80">
                          {event.time}
                        </div>
                      </div>
                    );
                  } else {
                    const appointment = item.data as Appointment;

                    return (
                      <AppointmentCard
                        key={`appointment-${appointment.id}`}
                        appointment={appointment}
                        variant="inline"
                      />
                    );
                  }
                })}
                {remainingCount > 0 && (
                  <div
                    onClick={(e) => handleShowMoreClick(day, e)}
                    className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    +{remainingCount} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Appointments Dialog */}
      {selectedDate && (
        <DayAppointmentsDialog
          date={selectedDate}
          appointments={getAppointmentsForDay(selectedDate)}
          events={getEventsForDay(selectedDate)}
          open={dayDialogOpen}
          onOpenChange={setDayDialogOpen}
        />
      )}
    </div>
  );
}
