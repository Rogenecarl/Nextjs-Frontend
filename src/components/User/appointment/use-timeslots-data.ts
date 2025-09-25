import { useQuery } from "@tanstack/react-query";
import { getProviderAvailableSlots, getProviderScheduleInfo } from "@/services/bookingService";

interface TimeSlot {
  start_time: string;
  end_time: string;
  formatted_time: string;
  datetime: string;
}

interface TimeSlotsResponse {
  provider_id: number;
  date: string;
  available_slots: TimeSlot[];
  total_slots: number;
}

interface OperatingHour {
  day_of_week: number;
  day_name: string;
  start_time: string | null;
  end_time: string | null;
  is_closed: boolean;
}

interface ScheduleInfo {
  operating_hours: OperatingHour[];
}

export function useTimeSlotsData(providerId: number, date: string) {
  const {
    data: timeSlotsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<TimeSlotsResponse>({
    queryKey: ["provider-timeslots", providerId, date],
    queryFn: () => getProviderAvailableSlots(providerId, date),
    enabled: !!providerId && !!date, // Only run query when both params are available
  });

  return {
    timeSlots: timeSlotsResponse?.available_slots || [],
    totalSlots: timeSlotsResponse?.total_slots || 0,
    isLoading,
    isError,
    error,
  };
}

export function useProviderScheduleInfo(providerId: number) {
  const {
    data: scheduleInfo,
    isLoading,
    isError,
    error,
  } = useQuery<ScheduleInfo>({
    queryKey: ["provider-schedule", providerId],
    queryFn: () => getProviderScheduleInfo(providerId),
    enabled: !!providerId,
    retry: 1, // Only retry once on failure
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return {
    scheduleInfo,
    isLoading,
    isError,
    error,
  };
}
