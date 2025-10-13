"use client";

import { useState } from "react";
import type { Appointment, CalendarEvent } from "@/types/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AppointmentCard } from "./appointment-card";

interface DayAppointmentsDialogProps {
  date: Date;
  appointments: Appointment[];
  events: CalendarEvent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventColorClasses = {
  teal: "bg-teal-100 text-teal-700 border-teal-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  red: "bg-red-100 text-red-800 border-red-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
};

export function DayAppointmentsDialog({
  date,
  appointments,
  events,
  open,
  onOpenChange,
}: DayAppointmentsDialogProps) {
  const totalItems = appointments.length + events.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
          <DialogHeader className="space-y-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {format(date, "MMMM d, yyyy")}
              </DialogTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {format(date, "EEEE")}
            </p>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4">
          {totalItems === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appointments or events for this day</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Events */}
              {events.map((event) => (
                <div
                  key={`event-${event.id}`}
                  className={cn(
                    "p-3 rounded-lg border",
                    eventColorClasses[event.color as keyof typeof eventColorClasses]
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <p className="text-sm opacity-80">{event.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      Event
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Appointments */}
              {appointments.map((appointment) => (
                <div key={`appointment-${appointment.id}`} className="relative">
                  <AppointmentCard
                    appointment={appointment}
                    variant="compact"
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}