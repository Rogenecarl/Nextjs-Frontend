import axiosInstance from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`;

// Types for the API responses
interface User {
  id: number;
  name: string;
  email: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Appointment {
  id: number;
  appointment_number: string;
  start_time: string;
  end_time: string;
  status: string;
  total_price: number;
  user: User;
  services: Service[];
  created_at: string;
}

interface AppointmentCounts {
  all: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface MonthlyStats {
  total_confirmed: number;
  month: string;
  start_date: string;
  end_date: string;
}

interface WeeklyStats {
  total_confirmed: number;
  week_range: string;
  start_date: string;
  end_date: string;
}

interface PopularService {
  service: string;
  bookings: number;
}

interface PopularServicesStats {
  services: PopularService[];
  period: string;
  period_label: string;
  start_date: string;
  end_date: string;
  total_completed_appointments: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
}

interface RecentActivityData {
  activities: RecentActivity[];
  count: number;
  period: string;
}

interface DashboardOverviewData {
  todays_appointments: {
    data: Appointment[];
    count: number;
  };
  pending_appointments: {
    data: Appointment[];
    count: number;
  };
  appointment_counts: AppointmentCounts;
  monthly_stats: MonthlyStats;
  weekly_stats: WeeklyStats;
  date: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Query Keys
const QUERY_KEYS = {
  DASHBOARD_OVERVIEW: ["provider", "dashboard", "overview"],
  TODAYS_APPOINTMENTS: ["provider", "dashboard", "todays-appointments"],
  PENDING_APPOINTMENTS: ["provider", "dashboard", "pending-appointments"],
  MONTHLY_STATS: ["provider", "dashboard", "monthly-stats"],
  WEEKLY_STATS: ["provider", "dashboard", "weekly-stats"],
  POPULAR_SERVICES_STATS: (period: string) => [
    "provider",
    "dashboard",
    "popular-services-stats",
    period,
  ],
  RECENT_ACTIVITY: (limit: number) => [
    "provider",
    "dashboard",
    "recent-activity",
    limit,
  ],
  CONFIRMED_APPOINTMENTS_RANGE: (startDate: string, endDate: string) => [
    "provider",
    "dashboard",
    "confirmed-appointments-range",
    startDate,
    endDate,
  ],
};

// API Functions
const fetchDashboardOverview = async (): Promise<DashboardOverviewData> => {
  const response = await axiosInstance.get<ApiResponse<DashboardOverviewData>>(
    `${API_URL}/provider/dashboard/overview`
  );

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || "Failed to fetch dashboard data");
};

const fetchTodaysAppointments = async () => {
  const response = await axiosInstance.get<
    ApiResponse<{
      appointments: Appointment[];
      count: number;
      date: string;
    }>
  >(`${API_URL}/provider/dashboard/todays-appointments`);

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(
    response.data.message || "Failed to fetch today's appointments"
  );
};

const fetchPendingAppointments = async () => {
  const response = await axiosInstance.get<
    ApiResponse<{
      appointments: Appointment[];
      count: number;
    }>
  >(`${API_URL}/provider/dashboard/pending-appointments`);

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(
    response.data.message || "Failed to fetch pending appointments"
  );
};

const fetchMonthlyStats = async (): Promise<MonthlyStats> => {
  const response = await axiosInstance.get<ApiResponse<MonthlyStats>>(
    `${API_URL}/provider/dashboard/monthly-stats`
  );

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || "Failed to fetch monthly stats");
};

const fetchWeeklyStats = async (): Promise<WeeklyStats> => {
  const response = await axiosInstance.get<ApiResponse<WeeklyStats>>(
    `${API_URL}/provider/dashboard/weekly-stats`
  );

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || "Failed to fetch weekly stats");
};

const fetchPopularServicesStats = async (
  period: string = "month"
): Promise<PopularServicesStats> => {
  const response = await axiosInstance.get<ApiResponse<PopularServicesStats>>(
    `${API_URL}/provider/dashboard/popular-services-stats`,
    {
      params: { period },
    }
  );

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(
    response.data.message || "Failed to fetch popular services stats"
  );
};

const fetchRecentActivity = async (
  limit: number = 10
): Promise<RecentActivityData> => {
  const response = await axiosInstance.get<ApiResponse<RecentActivityData>>(
    `${API_URL}/provider/dashboard/recent-activity`,
    {
      params: { limit },
    }
  );

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(
    response.data.message || "Failed to fetch recent activity"
  );
};

const fetchConfirmedAppointmentsForDateRange = async (
  startDate: string,
  endDate: string
) => {
  const response = await axiosInstance.get<
    ApiResponse<{
      appointments: Appointment[];
      count: number;
      start_date: string;
      end_date: string;
    }>
  >(`${API_URL}/provider/dashboard/confirmed-appointments-range`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(
    response.data.message || "Failed to fetch appointments for date range"
  );
};

// Main Dashboard Hook
export const useProviderDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_OVERVIEW,
    queryFn: fetchDashboardOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

// Individual Data Hooks
export const useTodaysAppointments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TODAYS_APPOINTMENTS,
    queryFn: fetchTodaysAppointments,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

export const usePendingAppointments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PENDING_APPOINTMENTS,
    queryFn: fetchPendingAppointments,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
};

export const useMonthlyStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MONTHLY_STATS,
    queryFn: fetchMonthlyStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useWeeklyStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.WEEKLY_STATS,
    queryFn: fetchWeeklyStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePopularServicesStats = (period: string = "month") => {
  return useQuery({
    queryKey: QUERY_KEYS.POPULAR_SERVICES_STATS(period),
    queryFn: () => fetchPopularServicesStats(period),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
};

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.RECENT_ACTIVITY(limit),
    queryFn: () => fetchRecentActivity(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });
};

export const useConfirmedAppointmentsForDateRange = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CONFIRMED_APPOINTMENTS_RANGE(startDate, endDate),
    queryFn: () => fetchConfirmedAppointmentsForDateRange(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Refresh Dashboard Hook
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Invalidate all dashboard queries
      await queryClient.invalidateQueries({
        queryKey: ["provider", "dashboard"],
      });
      return true;
    },
    onSuccess: () => {
      toast.success("Dashboard refreshed successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to refresh dashboard");
      console.error("Dashboard refresh error:", error);
    },
  });
};

// Export types
export type {
  Appointment,
  AppointmentCounts,
  MonthlyStats,
  WeeklyStats,
  DashboardOverviewData,
  PopularService,
  PopularServicesStats,
  RecentActivity,
  RecentActivityData,
  User,
  Service,
};
