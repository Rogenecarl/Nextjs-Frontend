import { useQuery } from "@tanstack/react-query";
import { getProviderCalendarAppointments } from "@/services/appointmentService";
import { Appointment } from "@/types/calendar"; // Assuming your Appointment type is here

interface DateRange {
  start_date: string;
  end_date: string;
}

export const useProviderCalendarAppointments = ({
  start_date,
  end_date,
}: DateRange) => {
  return useQuery<Appointment[]>({
    // The query key includes the date range.
    // When the range changes, TanStack Query automatically refetches.
    queryKey: ["providerCalendarAppointments", { start_date, end_date }],

    queryFn: () => getProviderCalendarAppointments({ start_date, end_date }),

    // This is important: only run the query if we have a valid date range.
    enabled: !!start_date && !!end_date,
  });
};
