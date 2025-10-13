"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useUserAppointments,
  useCancelBooking,
} from "@/hooks/useBookingMutation";


type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Appointment {
  id: number;
  appointment_number: string;
  start_time: string;
  end_time: string;
  formatted_start_time: string;
  formatted_end_time: string;
  formatted_date: string;
  status: BookingStatus;
  notes?: string;
  total_price: number;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  provider: {
    id: number;
    name: string;
    email: string;
    cover_photo?: string;
  };
  services: Array<{
    id: number;
    name: string;
    description: string;
    price_min: number;
    price_max: number;
  }>;
}

// Helper function to format appointment data for display
const formatAppointmentForDisplay = (appointment: Appointment) => {
  return {
    id: appointment.id.toString(),
    title: appointment.provider.name,
    appointmentNumber: appointment.appointment_number,
    date: appointment.formatted_date,
    time: `${appointment.formatted_start_time} - ${appointment.formatted_end_time}`,
    provider: appointment.provider.name,
    services: appointment.services,
    price: appointment.total_price,
    status: appointment.status,
    notes: appointment.notes,
    image: appointment.provider.cover_photo,
    description: appointment.services.map((s) => s.name).join(", "),
    cancelled_at: appointment.cancelled_at,
    cancellation_reason: appointment.cancellation_reason,
  };
};

// Dynamic tabs based on actual data
const getTabsWithCounts = (appointments: Appointment[]) =>
  [
    {
      id: "pending",
      label: "Pending",
      count: appointments.filter((a) => a.status === "pending").length,
    },
    {
      id: "confirmed",
      label: "Confirmed",
      count: appointments.filter((a) => a.status === "confirmed").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: appointments.filter((a) => a.status === "completed").length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: appointments.filter((a) => a.status === "cancelled").length,
    },
  ] as const;

const statusConfig = {
  pending: {
    color: "bg-warning text-warning-foreground",
    label: "Pending",
  },
  confirmed: {
    color: "bg-success text-success-foreground",
    label: "Confirmed",
  },
  completed: {
    color: "bg-muted text-muted-foreground",
    label: "Completed",
  },
  cancelled: {
    color: "bg-destructive text-destructive-foreground",
    label: "Cancelled",
  },
};

export function BookingList() {
  const [activeTab, setActiveTab] = useState<BookingStatus>("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user appointments
  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch,
  } = useUserAppointments();
  const cancelBookingMutation = useCancelBooking();

  const appointments: Appointment[] = appointmentsData?.data || [];
  const tabs = getTabsWithCounts(appointments);

  const filteredBookings = appointments
    .map(formatAppointmentForDisplay)
    .filter((booking) => {
      const matchesStatus = booking.status === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelBookingMutation.mutateAsync(Number(appointmentId));
      refetch(); // Refresh the appointments list
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Loading appointments...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <div className="text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            Failed to load appointments
          </h3>
          <p className="mb-4">There was an error loading your appointments.</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <span>{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No appointments found
            </h3>
            <p className="text-muted-foreground text-center max-w-sm text-sm">
              {activeTab === "pending" &&
                "You don't have any pending appointments."}
              {activeTab === "confirmed" &&
                "You don't have any confirmed appointments."}
              {activeTab === "completed" &&
                "You don't have any completed appointments."}
              {activeTab === "cancelled" &&
                "You don't have any cancelled appointments."}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="group overflow-hidden border-0 p-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white flex rounded-xl"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section - Compact */}
                  <div className="relative lg:w-64 h-48 lg:h-auto overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge
                        className={cn(
                          "font-medium shadow-sm border-0 text-xs px-2 py-1",
                          statusConfig[booking.status].color
                        )}
                      >
                        {statusConfig[booking.status].label}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white">
                        <p className="text-xs font-medium opacity-90">
                          Appointment #{booking.appointmentNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-4 lg:p-4">
                    {/* Header - Compact */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg lg:text-xl font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                          {booking.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-foreground mb-2">
                        Services Booked
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {booking.services.map((service) => (
                          <Badge
                            key={service.id}
                            variant="secondary"
                            className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0"
                          >
                            {service.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-md border-l-4 border-primary/30">
                        <h4 className="text-xs font-semibold text-foreground mb-1.5">
                          Notes
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {booking.notes}
                        </p>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {booking.cancelled_at && booking.cancellation_reason && (
                      <div className="mb-4 p-3 bg-destructive/5 border border-destructive/20 rounded-md">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-semibold text-destructive mb-1">
                              Appointment Cancelled
                            </h4>
                            <p className="text-xs text-destructive/80 line-clamp-2">
                              {booking.cancellation_reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAppointment(booking.id)}
                            disabled={cancelBookingMutation.isPending}
                            className="flex-1 sm:flex-none"
                          >
                            {cancelBookingMutation.isPending ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel"
                            )}
                          </Button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAppointment(booking.id)}
                            disabled={cancelBookingMutation.isPending}
                            className="flex-1 sm:flex-none"
                          >
                            {cancelBookingMutation.isPending ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel"
                            )}
                          </Button>
                        </>
                      )}
                      {booking.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          View Details
                        </Button>
                      )}
                      {booking.status === "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
