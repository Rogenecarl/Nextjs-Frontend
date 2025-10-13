"use client";

import { useState } from "react";
import type { Appointment } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";

interface AppointmentCardProps {
  appointment: Appointment;
  variant?: "compact" | "detailed" | "inline";
  className?: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  no_show: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
  no_show: XCircle,
};

export function AppointmentCard({ 
  appointment, 
  variant = "compact", 
  className 
}: AppointmentCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const StatusIcon = statusIcons[appointment.status];

  const handleClick = () => {
    setDialogOpen(true);
  };

  if (variant === "compact") {
    // For week and month views - minimal space
    return (
      <>
        <div
          onClick={handleClick}
          className={cn(
            "text-xs p-2 border rounded cursor-pointer hover:opacity-80 transition-opacity",
            statusColors[appointment.status],
            className
          )}
        >
          <div className="font-medium truncate">
            {appointment.user.name}
          </div>
          <div className="text-[10px] opacity-80">
            {appointment.formatted_start_time} - {appointment.formatted_end_time}
          </div>
        </div>
        <AppointmentDetailsDialog
          appointment={appointment}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </>
    );
  }

  if (variant === "detailed") {
    // For day view main grid - more space available
    return (
      <>
        <div
          onClick={handleClick}
          className={cn(
            "rounded-lg border p-3 cursor-pointer hover:opacity-80 transition-opacity",
            statusColors[appointment.status],
            className
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="font-semibold">
                {appointment.user.name}
              </div>
              <StatusIcon className="h-4 w-4" />
              <span className="font-medium text-sm">
                {appointment.formatted_start_time} - {appointment.formatted_end_time}
              </span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {appointment.status}
            </Badge>
          </div>
        </div>
        <AppointmentDetailsDialog
          appointment={appointment}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </>
    );
  }

  if (variant === "inline") {
    // For month view - inline with icon
    return (
      <>
        <div
          onClick={handleClick}
          className={cn(
            "text-xs px-2 py-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity",
            statusColors[appointment.status],
            className
          )}
        >
          <div className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            <span className="font-medium truncate">
              {appointment.user.name}
            </span>
          </div>
          <div className="text-[10px] opacity-80">
            {appointment.formatted_start_time} - {appointment.formatted_end_time}
          </div>
        </div>
        <AppointmentDetailsDialog
          appointment={appointment}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </>
    );
  }

  return null;
}