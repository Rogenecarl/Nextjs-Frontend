"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  ChevronLeft,
  CheckCircle,
  Building2,
  DollarSign,
  Loader2,
} from "lucide-react";
import { ProviderProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCreateBooking } from "@/hooks/useBookingMutation";
import { format } from "date-fns";
import { useBookingStore } from "@/store/create-booking-store";

interface BookingSummaryProps {
  provider: ProviderProps;
}

export default function BookingSummary({
  provider,
}: BookingSummaryProps) {
  const router = useRouter();
  const [bookingComplete, setBookingComplete] = useState(false);
  
  // Use booking store
  const { 
    selectedServices: selectedServiceIds, 
    selectedDate, 
    selectedTime, 
    selectedSlot,
    clearBooking 
  } = useBookingStore();
  
  // Use the booking mutation hook
  const createBookingMutation = useCreateBooking();

  // Get selected services details from provider
  const selectedServices = provider.services.filter(service => 
    selectedServiceIds?.includes(service.id)
  );

  // Redirect if missing required data
  useEffect(() => {
    if (!selectedServiceIds || !selectedDate || !selectedTime || !selectedSlot) {
      router.push(`/appointment/service/${provider.id}`);
    }
  }, [selectedServiceIds, selectedDate, selectedTime, selectedSlot, provider.id, router]);

  const getFormattedDate = () => {
    if (!selectedDate) return "";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return selectedDate.toLocaleDateString("en-US", options);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot || !selectedServiceIds) {
      console.error('Missing required booking data');
      return;
    }

    try {
      // Format the date as YYYY-MM-DD
      const appointmentDate = format(selectedDate, "yyyy-MM-dd");
      
      // Create full datetime strings by combining date with time
      const startDateTime = `${appointmentDate} ${selectedSlot.start_time}`;
      const endDateTime = `${appointmentDate} ${selectedSlot.end_time}`;
      
      // Prepare services array with service_id and price_at_booking
      const servicesData = selectedServices.map(service => ({
        service_id: service.id,
        price_at_booking: service.price_min || 0 // Using price_min as the booking price
      }));

      // Prepare booking data according to backend validation rules
      const bookingData = {
        provider_id: provider.id,
        services: servicesData,
        start_time: startDateTime,
        end_time: endDateTime,
        notes: "", // Could add notes field to the form if needed
      };

      console.log('Sending booking data:', bookingData);

      // Use the mutation to create the booking
      await createBookingMutation.mutateAsync(bookingData);
      
      // Clear booking data from store after successful booking
      clearBooking();
      
      // Set booking complete for UI feedback
      setBookingComplete(true);
      
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error('Booking failed:', error);
    }
  };

  if (bookingComplete) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Booking Summary
        </h3>
        <p className="text-muted-foreground">
          Please review your appointment details before confirming
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-foreground">
                Provider Details
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-foreground">
                  {provider.healthcare_name}
                </h5>
                <p className="text-sm text-muted-foreground">
                  {provider.description}
                </p>
              </div>

              <div className="border-t border-border my-3"></div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {provider.address || "Address not provided"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {provider.phone_number}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {provider.email}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-foreground">
                Appointment Details
              </h4>
            </div>

            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Date</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getFormattedDate()}
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Time</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTime} {selectedSlot && `(${selectedSlot.start_time.slice(0, 5)} - ${selectedSlot.end_time.slice(0, 5)})`}
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Services & Pricing */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-foreground">
                Services & Pricing
              </h4>
            </div>

            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div className="flex-1">
                    <h6 className="font-medium text-foreground text-sm">
                      {service.name}
                    </h6>
                    <p className="text-xs text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-border my-3"></div>

              <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    Total Amount
                  </span>
                </div>
                {/* <span className="text-xl font-bold text-primary">
                  ₱{getTotalPrice().toLocaleString()}
                </span> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Actions */}
      <div className="bg-accent/50 rounded-lg p-6">
        <div className="text-center mb-4">
          <h4 className="font-semibold text-foreground mb-2">
            Ready to Confirm?
          </h4>
          <p className="text-sm text-muted-foreground">
            By confirming this booking, you agree to the provider's terms and
            conditions
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={() => router.back()}
            disabled={createBookingMutation.isPending}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Date & Time
          </Button>

          <Button
            onClick={handleConfirmBooking}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming Booking...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Booking
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
