"use client";

import type { CalendarEvent, Appointment } from "@/types/calendar";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  appointments?: Appointment[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  no_show: "bg-gray-100 text-gray-800 border-gray-200",
};

const hours = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({
  currentDate,
  events,
  appointments = [],
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.date, day));
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) =>
      isSameDay(new Date(appointment.start_time), day)
    );
  };

  const getAppointmentForHour = (day: Date, hour: number) => {
    const dayAppointments = getAppointmentsForDay(day);
    return dayAppointments.find((apt) => {
      // Parse the formatted start time instead of the ISO string
      // Extract hour from formatted time like "1:30 PM"
      const timeMatch = apt.formatted_start_time.match(
        /(\d{1,2}):(\d{2})\s*(AM|PM)/i
      );
      if (!timeMatch) return false;

      let startHour = parseInt(timeMatch[1]);
      const period = timeMatch[3].toUpperCase();

      // Convert to 24-hour format
      if (period === "PM" && startHour !== 12) {
        startHour += 12;
      } else if (period === "AM" && startHour === 12) {
        startHour = 0;
      }

      return startHour === hour;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 bg-gray-50">
        <div className="border-r border-gray-200" />
        {weekDays.map((day) => {
          const dayAppointments = getAppointmentsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "px-4 py-3 text-center border-r border-gray-200 last:border-r-0",
                isToday && "bg-blue-50"
              )}
            >
              <div
                className={cn(
                  "text-xs font-medium uppercase",
                  isToday ? "text-blue-600" : "text-gray-600"
                )}
              >
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "text-sm font-semibold mt-1 flex items-center justify-center gap-2",
                  isToday ? "text-blue-900" : "text-gray-900"
                )}
              >
                <span>{format(day, "dd")}</span>
                {dayAppointments.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {dayAppointments.length}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-auto max-h-[calc(100vh-250px)]">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="border-r border-b border-gray-200 px-2 py-4 text-xs text-gray-500 text-right bg-gray-50">
                {format(new Date().setHours(hour, 0, 0, 0), "h a")}
              </div>

              {/* Day columns */}
              {weekDays.map((day) => {
                const appointment = getAppointmentForHour(day, hour);

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="border-r border-b border-gray-200 min-h-[60px] last:border-r-0 hover:bg-gray-50 transition-colors p-1 relative"
                  >
                    {appointment && (
                      <div
                        className={cn(
                          "absolute inset-1 rounded text-xs p-2 border",
                          statusColors[appointment.status]
                        )}
                      >
                        <div className="font-medium truncate">
                          {appointment.user.name}
                        </div>
                        <div className="text-[10px] opacity-80 truncate">
                          {appointment.services.map((s) => s.name).join(", ")}
                        </div>
                        <div className="text-[10px] opacity-80">
                          {appointment.formatted_start_time} -{" "}
                          {appointment.formatted_end_time}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
