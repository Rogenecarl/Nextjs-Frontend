"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingServiceFormSchema, BookingServiceFormType } from "./shema";
import { ProviderProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/create-booking-store";
import { useEffect } from "react";

interface ProviderDetailsContentProps {
  provider: ProviderProps;
}

export default function SetAppointmentServiceForm({
  provider,
}: ProviderDetailsContentProps) {
  const router = useRouter();

  const { setData, selectedServices: storedServices, providerId } = useBookingStore();

  const form = useForm<BookingServiceFormType>({
    resolver: zodResolver(BookingServiceFormSchema),
    defaultValues: {
      selectedServices: [],
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const selectedServices = watch("selectedServices");

  // Restore stored data on component mount
  useEffect(() => {
    if (storedServices && storedServices.length > 0) {
      setValue("selectedServices", storedServices);
    }
    // Set provider ID in store
    if (provider.id !== providerId) {
      setData({ providerId: provider.id });
    }
  }, [storedServices, provider.id, providerId, setValue, setData]);

  const toggleService = (serviceId: number) => {
    const currentServices = selectedServices || [];
    const isSelected = currentServices.includes(serviceId);

    if (isSelected) {
      setValue(
        "selectedServices",
        currentServices.filter((id) => id !== serviceId)
      );
    } else {
      setValue("selectedServices", [...currentServices, serviceId]);
    }
  };

  const getSelectedServicesDetails = () => {
    return provider.services.filter((service) =>
      selectedServices?.includes(service.id)
    );
  };

  const onSubmit = (data: BookingServiceFormType) => {
    // Store selected services in Zustand store
    setData({ 
      selectedServices: data.selectedServices,
      providerId: provider.id 
    });
    console.log("Selected services:", data);
    // Navigate to next step (date selection)
    router.push(`/appointment/date/${provider.id}`);
  };

  const selectedServicesDetails = getSelectedServicesDetails();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Choose Your Services
        </h3>
        <p className="text-muted-foreground">
          Select one or more services for your appointment
        </p>
      </div>

      {errors.selectedServices && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">
            {errors.selectedServices.message}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {provider.services.map((service) => {
          const isSelected = selectedServices?.includes(service.id);

          return (
            <Card
              key={service.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => toggleService(service.id)}
            >
              <div
                className={cn(
                  "absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                  isSelected ? "bg-primary" : "bg-gray-200"
                )}
              >
                <Check
                  className={cn(
                    "w-4 h-4 transition-all",
                    isSelected
                      ? "text-primary-foreground opacity-100"
                      : "text-gray-400 opacity-0"
                  )}
                />
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground text-lg">
                    {service.name}
                  </h4>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {service.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedServicesDetails.length > 0 && (
        <div className="bg-accent/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">
                Selected Services ({selectedServicesDetails.length})
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedServicesDetails.map((s) => s.name).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

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
          disabled={!selectedServices?.length}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
