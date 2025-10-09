"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  DollarSign,
  User,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { AppointmentProps } from "@/types/types";
import { cn } from "@/lib/utils";

interface AppointmentDetailsModalProps {
  appointment: AppointmentProps | null;
  isOpen: boolean;
  onClose: () => void;
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

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const StatusIcon = statusConfig[appointment.status]?.icon || Clock;
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  <div className="text-sm text-gray-500">
                    Patient ID: {appointment.user.id}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {appointment.user.email}
                  </div>
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
                  <div>
                    {format(
                      new Date(appointment.start_time),
                      "EEEE, MMMM dd, yyyy"
                    )}
                  </div>
                  <div className="text-gray-600">
                    {format(new Date(appointment.start_time), "h:mm a")} -{" "}
                    {format(new Date(appointment.end_time), "h:mm a")}
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
                    statusConfig[appointment.status]?.color ||
                      "bg-gray-50 text-gray-700 border-gray-200"
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig[appointment.status]?.label || "Unknown"}
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
                  <DollarSign className="h-4 w-4" />${appointment.total_price}
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
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
