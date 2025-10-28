"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Star,
  Users,
  Settings,
  Activity,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { CartesianGrid, XAxis, Bar, BarChart, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  useProviderDashboard,
  useRefreshDashboard,
  usePopularServicesStats,
  useRecentActivity,
} from "@/hooks/use-provider-frontend-dashboard";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data for charts that don't have API endpoints yet
const mockChartData = {
  bookingTrendsData: [
    { day: "Mon", bookings: 12 },
    { day: "Tue", bookings: 15 },
    { day: "Wed", bookings: 8 },
    { day: "Thu", bookings: 18 },
    { day: "Fri", bookings: 22 },
    { day: "Sat", bookings: 25 },
    { day: "Sun", bookings: 10 },
  ],
};

// Chart configurations
const appointmentStatusConfig = {
  count: {
    label: "Appointments",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--chart-3)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-4)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const servicesConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const bookingTrendsConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function DashboardOverview() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useProviderDashboard();
  const {
    data: popularServicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = usePopularServicesStats("month");
  const {
    data: recentActivityData,
    isLoading: activityLoading,
    error: activityError,
  } = useRecentActivity(10);
  const refreshMutation = useRefreshDashboard();

  // Transform appointment counts data for pie chart
  const appointmentStatusData = dashboardData
    ? [
        {
          status: "Confirmed",
          count: dashboardData.appointment_counts.confirmed,
          fill: "var(--color-confirmed)",
        },
        {
          status: "Pending",
          count: dashboardData.appointment_counts.pending,
          fill: "var(--color-pending)",
        },
        {
          status: "Completed",
          count: dashboardData.appointment_counts.completed,
          fill: "var(--color-completed)",
        },
        {
          status: "Cancelled",
          count: dashboardData.appointment_counts.cancelled,
          fill: "var(--color-cancelled)",
        },
      ]
    : [];

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  if (isLoading || servicesLoading || activityLoading) {
    return <DashboardSkeleton />;
  }

  if (error || servicesError || activityError) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data.{" "}
            {error?.message || servicesError?.message || activityError?.message}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Use real data for popular services and recent activity, mock data for booking trends
  const { bookingTrendsData } = mockChartData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your practice today.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {format(new Date(), "MMM dd, yyyy - h:mm a")}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={refreshMutation.isPending}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshMutation.isPending ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData.todays_appointments.count}
            </div>
            <p className="mt-1 text-xs text-gray-600">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Appointments
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData.pending_appointments.count}
            </div>
            <p className="mt-1 text-xs text-gray-600">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed This Week
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData.weekly_stats.total_confirmed}
            </div>
            <p className="mt-1 text-xs text-gray-600">Successfully completed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Monthly Total
            </CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardData.monthly_stats.total_confirmed}
            </div>
            <p className="mt-1 text-xs text-gray-600">
              {dashboardData.monthly_stats.month}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>
              {popularServicesData?.period_label ||
                "Most booked services this month"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {popularServicesData?.services &&
            popularServicesData.services.length > 0 ? (
              <ChartContainer config={servicesConfig}>
                <BarChart
                  accessibilityLayer
                  data={popularServicesData.services}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="service"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.split(" ")[0]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="bookings" fill="#60a5fa" radius={8} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">
                    No service data available
                  </p>
                  <p className="text-sm">
                    Complete some appointments to see popular services
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            {popularServicesData?.services &&
            popularServicesData.services.length > 0 ? (
              <>
                <div className="flex gap-2 leading-none font-medium">
                  {popularServicesData.services[0]?.service} leads with{" "}
                  {popularServicesData.services[0]?.bookings} bookings
                </div>
                <div className="text-muted-foreground leading-none">
                  Total completed appointments:{" "}
                  {popularServicesData.total_completed_appointments}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground leading-none">
                No completed appointments found for this period
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              {recentActivityData?.period || "Recent appointment activities"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivityData?.activities &&
            recentActivityData.activities.length > 0 ? (
              <div className="space-y-4">
                {recentActivityData.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium">No recent activity</p>
                  <p className="text-sm">
                    Activity will appear here as appointments are created
                  </p>
                </div>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Booking Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Booking Trends</CardTitle>
            <CardDescription>
              Daily booking patterns for this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={bookingTrendsConfig}>
              <BarChart accessibilityLayer data={bookingTrendsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="bookings" fill="#60a5fa" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Peak day: Saturday with{" "}
              {Math.max(...bookingTrendsData.map((d) => d.bookings))} bookings
            </div>
            <div className="text-muted-foreground leading-none">
              Weekend shows higher booking activity
            </div>
          </CardFooter>
        </Card>

        {/* Appointment Status Distribution - Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Appointment Status Distribution</CardTitle>
            <CardDescription>Current appointment breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={appointmentStatusConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={appointmentStatusData}
                  dataKey="count"
                  nameKey="status"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Total appointments:{" "}
              {appointmentStatusData.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-muted-foreground leading-none">
              Most appointments are completed successfully
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96 mb-1" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-l-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
