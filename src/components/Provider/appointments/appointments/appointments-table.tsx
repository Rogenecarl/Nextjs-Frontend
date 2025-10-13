"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreHorizontal, Calendar } from "lucide-react";
import { AppointmentProps } from "@/types/types";
import { cn } from "@/lib/utils";
import {
  useConfirmAppointment,
  useCompleteAppointment,
  useCancelAppointment,
} from "./use-provider-appointment-hook";
import { toast } from "sonner";

interface AppointmentsTableProps {
  appointments: AppointmentProps[];
  onAppointmentClick?: (appointment: AppointmentProps) => void;
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  no_show: {
    label: "No Show",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

export function AppointmentsTable({
  appointments,
  onAppointmentClick,
}: AppointmentsTableProps) {
  const [sortBy, setSortBy] = useState<
    "date" | "patient" | "service" | "status"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(
    null
  );

  // Mutation hooks
  const confirmMutation = useConfirmAppointment();
  const completeMutation = useCompleteAppointment();
  const cancelMutation = useCancelAppointment();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Action handlers
  const handleConfirm = async (appointmentId: string) => {
    const loadingToast = toast.loading("Confirming appointment...");

    try {
      await confirmMutation.mutateAsync(appointmentId);
      toast.dismiss(loadingToast);
      toast.success("Appointment confirmed successfully");
      setShowConfirmDialog(null);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to confirm appointment");
    }
  };

  const handleComplete = async (appointmentId: string) => {
    const loadingToast = toast.loading("Marking appointment as complete...");

    try {
      await completeMutation.mutateAsync(appointmentId);
      toast.dismiss(loadingToast);
      toast.success("Appointment marked as complete");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to complete appointment");
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    const loadingToast = toast.loading("Cancelling appointment...");

    try {
      await cancelMutation.mutateAsync({
        appointmentId,
        reason: cancelReason,
      });
      toast.dismiss(loadingToast);
      toast.success("Appointment cancelled successfully");
      setShowCancelDialog(null);
      setCancelReason("");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to cancel appointment");
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        break;
      case "patient":
        comparison = a.user.name.localeCompare(b.user.name);
        break;
      case "service":
        const aServiceName = a.services[0]?.name || "";
        const bServiceName = b.services[0]?.name || "";
        comparison = aServiceName.localeCompare(bServiceName);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="text-gray-600 font-medium py-4">
                Name
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Date & Time
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Service
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Price
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50"
                onClick={() => onAppointmentClick?.(appointment)}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-blue-100">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
                        {getInitials(appointment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {appointment.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {appointment.formatted_date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.formatted_start_time} - {appointment.formatted_end_time}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {appointment.services.map((s) => s.name).join(", ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.services.length} service
                      {appointment.services.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      statusConfig[appointment.status].color
                    )}
                  >
                    {statusConfig[appointment.status].label}
                  </Badge>
                </TableCell>

                <TableCell className="py-4">
                  <div className="font-medium text-gray-900">
                    ${appointment.total_price}
                  </div>
                </TableCell>

                <TableCell
                  className="py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {appointment.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() =>
                              setShowConfirmDialog(appointment.id.toString())
                            }
                            disabled={confirmMutation.isPending}
                          >
                            {confirmMutation.isPending
                              ? "Confirming..."
                              : "Confirm Booking"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAppointmentClick?.(appointment)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              setShowCancelDialog(appointment.id.toString())
                            }
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </>
                      )}
                      {appointment.status === "confirmed" && (
                        <>
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() =>
                              handleComplete(appointment.id.toString())
                            }
                            disabled={completeMutation.isPending}
                          >
                            {completeMutation.isPending
                              ? "Completing..."
                              : "Mark as Complete"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAppointmentClick?.(appointment)}
                          >
                            View Details
                          </DropdownMenuItem>
                        </>
                      )}
                      {appointment.status !== "pending" &&
                        appointment.status !== "confirmed" && (
                          <DropdownMenuItem
                            onClick={() => onAppointmentClick?.(appointment)}
                          >
                            View Details
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="space-y-3 p-4">
          {sortedAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onAppointmentClick?.(appointment)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-blue-100">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                      {getInitials(appointment.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {appointment.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.user.email}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {appointment.status === "pending" && (
                      <>
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() =>
                            setShowConfirmDialog(appointment.id.toString())
                          }
                          disabled={confirmMutation.isPending}
                        >
                          {confirmMutation.isPending
                            ? "Confirming..."
                            : "Confirm Booking"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAppointmentClick?.(appointment)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            setShowCancelDialog(appointment.id.toString())
                          }
                        >
                          Cancel Booking
                        </DropdownMenuItem>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <>
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() =>
                            handleComplete(appointment.id.toString())
                          }
                          disabled={completeMutation.isPending}
                        >
                          {completeMutation.isPending
                            ? "Completing..."
                            : "Mark as Complete"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAppointmentClick?.(appointment)}
                        >
                          View Details
                        </DropdownMenuItem>
                      </>
                    )}
                    {appointment.status !== "pending" &&
                      appointment.status !== "confirmed" && (
                        <DropdownMenuItem
                          onClick={() => onAppointmentClick?.(appointment)}
                        >
                          View Details
                        </DropdownMenuItem>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Date & Time
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.formatted_date}
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.formatted_start_time} - {appointment.formatted_end_time}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Service
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.services.map((s) => s.name).join(", ")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.services.length} service
                    {appointment.services.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    statusConfig[appointment.status].color
                  )}
                >
                  {statusConfig[appointment.status].label}
                </Badge>

                <div className="font-medium text-gray-900">
                  ${appointment.total_price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-500 mb-4">
            There are no appointments matching your current filters.
          </p>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule New Appointment
          </Button>
        </div>
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={!!showConfirmDialog}
        onOpenChange={() => setShowConfirmDialog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">
            Are you sure you want to confirm this appointment? This action will
            notify the patient that their appointment has been confirmed.
          </p>
          <DialogFooter>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(null)}
                disabled={confirmMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleConfirm(showConfirmDialog!)}
                disabled={confirmMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {confirmMutation.isPending
                  ? "Confirming..."
                  : "Confirm Appointment"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={!!showCancelDialog}
        onOpenChange={() => {
          setShowCancelDialog(null);
          setCancelReason("");
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for cancelling this appointment:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
            />
          </div>
          <DialogFooter>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelDialog(null);
                  setCancelReason("");
                }}
                disabled={cancelMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCancel(showCancelDialog!)}
                disabled={cancelMutation.isPending || !cancelReason.trim()}
              >
                {cancelMutation.isPending
                  ? "Cancelling..."
                  : "Cancel Appointment"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
