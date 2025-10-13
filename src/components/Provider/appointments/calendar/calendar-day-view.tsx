"use client";

import type { Appointment } from "@/types/calendar"; // Use your updated Appointment type from the API
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentCard } from "./appointment-card";

interface DayViewProps {
  currentDate: Date;
  appointments?: Appointment[];
  onDateChange?: (date: Date) => void;
  isLoading?: boolean;
}

// Define status configurations for styling
const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
  no_show: {
    label: "No Show",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: XCircle,
  },
};

// Generate an array of hours for the day grid
const hours = Array.from({ length: 24 }, (_, i) => i);

// Helper function to get initials from a name
const getInitials = (name: string = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function DayView({
  currentDate,
  appointments = [],
  onDateChange,
  isLoading = false,
}: DayViewProps) {
  // Filter appointments to get only those for the currently viewed date
  const dayAppointments = appointments.filter((appointment) =>
    isSameDay(new Date(appointment.start_time), currentDate)
  );

  // Find the first appointment that starts within a given hour
  const getAppointmentForHour = (hour: number) => {
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
    <div className="grid grid-cols-[1fr_320px] gap-4">
      {/* Main Day View Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <header className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm font-medium text-gray-600 uppercase">
            {format(currentDate, "EEEE")}
          </div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {format(currentDate, "dd")}
          </div>
        </header>

        <div className="overflow-auto max-h-[calc(100vh-250px)]">
          {hours.map((hour) => {
            const appointment = getAppointmentForHour(hour);

            return (
              <div key={hour} className="flex border-b border-gray-200">
                <div className="w-20 flex-shrink-0 border-r border-gray-200 px-3 py-4 text-xs text-gray-500 text-right bg-gray-50">
                  {format(new Date().setHours(hour), "h a")}
                </div>
                <div className="flex-1 min-h-[60px] hover:bg-gray-50 transition-colors p-2 relative">
                  {appointment && (
                    <AppointmentCard
                      appointment={appointment}
                      variant="detailed"
                      className="absolute inset-2"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => {
              if (date && onDateChange) {
                onDateChange(date);
              }
            }}
            className="rounded-md"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Today's Appointments
            </h3>
            <Badge variant="secondary">{dayAppointments.length}</Badge>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto">
            {dayAppointments.length > 0 ? (
              dayAppointments.map((appointment) => {
                const config =
                  statusConfig[appointment.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;

                return (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            {getInitials(appointment.user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {appointment.user?.name ?? "N/A"}
                          </div>
                          {/* Assuming age/gender are not in the API response, so commenting out */}
                          {/* <div className="text-xs text-gray-500">Age {appointment.patient.age} • {appointment.patient.gender}</div> */}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("gap-1 text-xs capitalize", config.color)}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {appointment.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="text-xs text-gray-500">
                        {appointment.formatted_start_time} -{" "}
                        {appointment.formatted_end_time}
                      </div>
                      {appointment.notes && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {appointment.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="text-sm font-bold text-gray-900">
                        ₱{parseFloat(appointment.total_price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No appointments today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
