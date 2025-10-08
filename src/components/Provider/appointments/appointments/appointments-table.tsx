"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { AppointmentProps } from "@/types/types";
import { cn } from "@/lib/utils";

interface AppointmentsTableProps {
  appointments: AppointmentProps[];
  onAppointmentClick?: (appointment: AppointmentProps) => void;
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

export function AppointmentsTable({
  appointments,
  onAppointmentClick,
}: AppointmentsTableProps) {
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>(
    []
  );
  const [sortBy, setSortBy] = useState<
    "date" | "patient" | "service" | "status"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointments((prev) => [...prev, appointmentId]);
    } else {
      setSelectedAppointments((prev) =>
        prev.filter((id) => id !== appointmentId)
      );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        break;
      case "patient":
        comparison = a.user.name.localeCompare(b.user.name);
        break;
      case "service":
        const aServiceName = a.services[0]?.name || '';
        const bServiceName = b.services[0]?.name || '';
        comparison = aServiceName.localeCompare(bServiceName);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedAppointments.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedAppointments.length} appointment
              {selectedAppointments.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
              <Button size="sm" variant="outline">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (sortBy === "date") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("date");
                    setSortOrder("asc");
                  }
                }}
              >
                Date & Time
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (sortBy === "patient") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("patient");
                    setSortOrder("asc");
                  }
                }}
              >
                Name
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (sortBy === "service") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("service");
                    setSortOrder("asc");
                  }
                }}
              >
                Service
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (sortBy === "status") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("status");
                    setSortOrder("asc");
                  }
                }}
              >
                Status
              </TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.map((appointment) => {
              const StatusIcon = statusConfig[appointment.status].icon;
              const isSelected = selectedAppointments.includes(appointment.id.toString());

              return (
                <TableRow
                  key={appointment.id}
                  className={cn(
                    "hover:bg-gray-50 transition-colors cursor-pointer",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => onAppointmentClick?.(appointment)}
                >

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {format(new Date(appointment.start_time), "MMM dd, yyyy")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(appointment.start_time), "h:mm a")} - {format(new Date(appointment.end_time), "h:mm a")}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
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

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {appointment.services.map(s => s.name).join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.services.length} service{appointment.services.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1",
                        statusConfig[appointment.status].color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[appointment.status].label}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <DollarSign className="h-4 w-4" />
                      {appointment.total_price}
                    </div>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Cancel Appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="space-y-3 p-4">
          {sortedAppointments.map((appointment) => {
            const StatusIcon = statusConfig[appointment.status].icon;
            const isSelected = selectedAppointments.includes(appointment.id.toString());

            return (
              <div
                key={appointment.id}
                className={cn(
                  "border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                  isSelected && "bg-blue-50 border-blue-200"
                )}
                onClick={() => onAppointmentClick?.(appointment)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectAppointment(
                          appointment.id.toString(),
                          checked as boolean
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Appointment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Date & Time
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(appointment.start_time), "MMM dd, yyyy")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(appointment.start_time), "h:mm a")} - {format(new Date(appointment.end_time), "h:mm a")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Service
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.services.map(s => s.name).join(', ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {appointment.services.length} service{appointment.services.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1",
                      statusConfig[appointment.status].color
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[appointment.status].label}
                  </Badge>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <DollarSign className="h-4 w-4" />
                      {appointment.total_price}
                    </div>
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
    </div>
  );
}