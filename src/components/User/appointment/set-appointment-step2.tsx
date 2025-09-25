"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingDateTimeFormSchema, BookingDateTimeFormType } from "./shema";
import { ProviderProps } from "@/types/types";
import { useRouter } from "next/navigation";
import {
  useTimeSlotsData,
  useProviderScheduleInfo,
} from "./use-timeslots-data";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useBookingStore } from "@/store/create-booking-store";
import { useEffect } from "react";

interface DateTimeSelectionProps {
  provider: ProviderProps;
}

export default function DateTimeSelection({
  provider,
}: DateTimeSelectionProps) {
  const router = useRouter();
  
  // Use booking store
  const { 
    setData, 
    selectedServices, 
    selectedDate: storedDate, 
    selectedTime: storedTime,
    selectedSlot: storedSlot,
    providerId 
  } = useBookingStore();

  const form = useForm<BookingDateTimeFormType>({
    resolver: zodResolver(BookingDateTimeFormSchema),
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const selectedDate = watch("selectedDate");
  const selectedTime = watch("selectedTime");

  // Restore stored data on component mount
  useEffect(() => {
    if (storedDate) {
      setValue("selectedDate", storedDate);
    }
    if (storedTime) {
      setValue("selectedTime", storedTime);
    }
    if (storedSlot) {
      setValue("selectedSlot", storedSlot);
    }
  }, [storedDate, storedTime, storedSlot, setValue]);

  // Redirect if no services selected
  useEffect(() => {
    if (!selectedServices || selectedServices.length === 0) {
      router.push(`/appointment/service/${provider.id}`);
    }
  }, [selectedServices, provider.id, router]);

  // Format date for API call
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  // Fetch provider schedule info
  const {
    scheduleInfo,
    isLoading: scheduleLoading,
    isError: scheduleError,
  } = useProviderScheduleInfo(provider.id);

  // Fetch available time slots
  const { timeSlots, isLoading: timeSlotsLoading } = useTimeSlotsData(
    provider.id,
    dateString
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("selectedDate", date);
      setValue("selectedTime", ""); // Reset time when date changes
      setValue("selectedSlot", undefined); // Reset slot when date changes
    }
  };

  // Check if a date should be disabled based on schedule
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < new Date()) return true;

    // If schedule info is available, check if provider is open on this day
    if (scheduleInfo && scheduleInfo.operating_hours) {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const daySchedule = scheduleInfo.operating_hours.find(
        (hour) => hour.day_of_week === dayOfWeek
      );
      return daySchedule?.is_closed || false;
    }

    return false;
  };

  const selectTime = (slot: any) => {
    setValue("selectedTime", slot.formatted_time);
    setValue("selectedSlot", slot);
  };

  const getSelectedDateString = () => {
    if (!selectedDate) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return selectedDate.toLocaleDateString("en-US", options);
  };

  const onSubmit = (data: BookingDateTimeFormType) => {
    // Store date/time data in Zustand store
    setData({
      selectedDate: data.selectedDate,
      selectedTime: data.selectedTime,
      selectedSlot: data.selectedSlot,
    });

    console.log("Booking data:", {
      provider: provider.id,
      date: data.selectedDate,
      time: data.selectedTime,
      slot: data.selectedSlot,
    });

    // Navigate to summary page
    router.push(`/appointment/summary/${provider.id}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Select Date & Time
        </h3>
        <p className="text-muted-foreground">
          Choose your preferred appointment date and time
        </p>
      </div>

      {/* Error Messages */}
      {(errors.selectedDate || errors.selectedTime) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {errors.selectedDate && (
            <p className="text-red-600 text-sm">
              {errors.selectedDate.message}
            </p>
          )}
          {errors.selectedTime && (
            <p className="text-red-600 text-sm">
              {errors.selectedTime.message}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-foreground">
                Select Date
              </h4>
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                className="rounded-md border-0"
              />
            </div>

            {scheduleLoading && (
              <div className="text-center">
                <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
                <p className="text-xs text-muted-foreground mt-1">
                  Loading schedule...
                </p>
              </div>
            )}

            {scheduleError && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Schedule unavailable
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Time Slots */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-foreground">
                Available Times
              </h4>
            </div>

            {selectedDate ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {getSelectedDateString()}
                </div>

                {timeSlotsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading available times...
                    </span>
                  </div>
                ) : timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={`${slot.start_time}-${index}`}
                        type="button"
                        variant={
                          selectedTime === slot.formatted_time
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => selectTime(slot)}
                        className={cn(
                          "text-sm",
                          selectedTime === slot.formatted_time
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        )}
                      >
                        {slot.formatted_time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No available times for this date
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Please select a date first
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Selected Date & Time Summary */}
      {selectedDate && selectedTime && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">
                Appointment Scheduled
              </h4>
              <p className="text-sm text-muted-foreground">
                {getSelectedDateString()} at {selectedTime}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          type="submit"
          className="flex items-center gap-2"
          disabled={!selectedDate || !selectedTime}
        >
          Continue to Confirmation
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
