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
  MoreHorizontal,
  Calendar,
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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="text-gray-600 font-medium py-4">
                Date & Time
              </TableHead>
              <TableHead className="text-gray-600 font-medium py-4">
                Name
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
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">
                      {format(new Date(appointment.start_time), "MMM dd, yyyy")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(appointment.start_time), "h:mm a")} - {format(new Date(appointment.end_time), "h:mm a")}
                    </div>
                  </div>
                </TableCell>

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
                      {appointment.services.map(s => s.name).join(', ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.services.length} service{appointment.services.length > 1 ? 's' : ''}
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

                <TableCell className="py-4" onClick={(e) => e.stopPropagation()}>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Cancel Appointment
                      </DropdownMenuItem>
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
    </div>
  );
}