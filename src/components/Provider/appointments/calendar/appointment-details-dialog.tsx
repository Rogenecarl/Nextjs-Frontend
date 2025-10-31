"use client";

import type { Appointment } from "@/types/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  no_show: {
    label: "No Show",
    color: "bg-gray-50 text-gray-700 border-gray-200",
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

  const StatusIcon =
    statusConfig[appointment.status as keyof typeof statusConfig]?.icon ||
    Clock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Patient Information
              </h3>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {getInitials(appointment.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="font-medium text-gray-900">
                    {appointment.user.name}
                  </div>
                  {/* <div className="text-sm text-gray-500">
                    Patient ID: {appointment.user.id}
                  </div> */}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {appointment.user.email}
                  </div>
                  {appointment.user.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {appointment.user.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Date & Time
                </label>
                <div className="text-sm text-gray-900">
                  <div>{appointment.formatted_date}</div>
                  <div className="text-gray-600">
                    {appointment.formatted_start_time} -{" "}
                    {appointment.formatted_end_time}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1",
                    statusConfig[
                      appointment.status as keyof typeof statusConfig
                    ]?.color || "bg-gray-50 text-gray-700 border-gray-200"
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig[appointment.status as keyof typeof statusConfig]
                    ?.label || "Unknown"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Service
                </label>
                <div className="text-sm text-gray-900">
                  <div className="font-medium">
                    {appointment.services.map((s) => s.name).join(", ")}
                  </div>
                  <div className="text-gray-600">
                    {appointment.services.length} service
                    {appointment.services.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Price
                </label>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                  <DollarSign className="h-4 w-4" />₱
                  {Number.parseFloat(appointment.total_price).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Notes</label>
            </div>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[80px]">
              {appointment.notes || "No notes added"}
            </div>
          </div>

          {/* Cancellation Info */}
          {appointment.cancelled_at && appointment.cancellation_reason && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <label className="text-sm font-medium text-red-700">
                  Cancellation Details
                </label>
              </div>
              <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                <p className="mb-1">{appointment.cancellation_reason}</p>
                <p className="text-xs text-red-600">
                  Cancelled on{" "}
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
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            {appointment.status === "pending" && (
              <>
                <Button
                  size="default"
                  className="bg-green-600 hover:bg-green-700 font-medium flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="font-medium bg-transparent flex-1"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </>
            )}

            {appointment.status === "confirmed" && (
              <>
                <Button
                  size="default"
                  className="bg-blue-600 hover:bg-blue-700 font-medium flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="font-medium bg-transparent flex-1"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              </>
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

            {appointment.status === "no_show" && (
              <Button
                size="default"
                variant="outline"
                className="w-full font-medium bg-transparent"
              >
                Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
