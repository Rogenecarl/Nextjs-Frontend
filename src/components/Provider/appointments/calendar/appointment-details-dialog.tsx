"use client";

import type { Appointment } from "@/types/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

// Helper function to get initials from a name
const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null;

  const config = statusConfig[appointment.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[95vh] overflow-hidden p-0">
        <div className="relative bg-white p-6 border-b border-gray-100">
          <DialogHeader className="space-y-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Appointment Details
              </DialogTitle>
              <Badge
                variant="secondary"
                className={cn("gap-1.5 px-3 py-1.5 font-medium", config.color)}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              #{appointment.appointment_number}
            </p>
          </DialogHeader>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  Date & Time
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {appointment.formatted_date}
                </p>
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 pl-14">
              {appointment.formatted_start_time} -{" "}
              {appointment.formatted_end_time}
            </div>
          </div>

          <Separator className="my-5" />

          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border-2 border-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg">
                {getInitials(appointment.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg">
                {appointment.user.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">Patient</p>

              <div className="space-y-2">
                {appointment.user.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{appointment.user.email}</span>
                  </div>
                )}
                {appointment.user.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{appointment.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-base">
                Services
              </h3>
            </div>

            <div className="space-y-2.5 pl-1">
              {appointment.services.map((service, index) => (
                <div key={service.id} className="text-gray-900 font-medium">
                  {service.name}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          <div className="bg-green-50 border border-green-100 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-700" />
                </div>
                <span className="font-semibold text-gray-900 text-base">
                  Total Amount
                </span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                ₱{Number.parseFloat(appointment.total_price).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <>
              <Separator className="my-5" />
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-base">
                    Notes
                  </h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-1">
                  {appointment.notes}
                </p>
              </div>
            </>
          )}

          {/* Cancellation Info */}
          {appointment.cancelled_at && appointment.cancellation_reason && (
            <>
              <Separator className="my-5" />
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900 text-base">
                    Cancelled
                  </h4>
                </div>
                <div className="pl-1">
                  <p className="text-sm text-red-700 mb-1">
                    {appointment.cancellation_reason}
                  </p>
                  <p className="text-xs text-red-600">
                    {new Date(appointment.cancelled_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 bg-white p-5">
          {appointment.status === "pending" && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="default"
                className="bg-green-600 hover:bg-green-700 font-medium"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button
                size="default"
                variant="outline"
                className="font-medium bg-transparent"
              >
                <Clock className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </div>
          )}

          {appointment.status === "confirmed" && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="default"
                className="bg-blue-600 hover:bg-blue-700 font-medium"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button
                size="default"
                variant="outline"
                className="font-medium bg-transparent"
              >
                <Clock className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </div>
          )}

          {(appointment.status === "completed" ||
            appointment.status === "cancelled") && (
            <Button
              size="default"
              variant="outline"
              className="w-full font-medium bg-transparent"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Full Details
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
