"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Plus,
  Eye,
  Settings,
  Activity,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for static implementation
const mockData = {
  todayStats: {
    totalAppointments: 8,
    pendingAppointments: 3,
    completedThisWeek: 24,
    averageRating: 4.8,
  },
  recentActivity: [
    {
      id: 1,
      type: "appointment",
      message: "New appointment booked by Sarah Johnson",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "review",
      message: "New 5-star review received",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "payment",
      message: "Payment received for consultation",
      time: "3 hours ago",
    },
    {
      id: 4,
      type: "appointment",
      message: "Appointment completed with Mike Chen",
      time: "5 hours ago",
    },
  ],
  // Chart data for Shadcn charts
  appointmentStatusData: [
    { status: "Confirmed", count: 15, fill: "var(--color-confirmed)" },
    { status: "Pending", count: 8, fill: "var(--color-pending)" },
    { status: "Completed", count: 32, fill: "var(--color-completed)" },
    { status: "Cancelled", count: 3, fill: "var(--color-cancelled)" },
  ],
  popularServicesData: [
    { service: "General Consultation", bookings: 45 },
    { service: "Health Checkup", bookings: 32 },
    { service: "Follow-up Visit", bookings: 28 },
    { service: "Vaccination", bookings: 15 },
  ],
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
    color: "var(--chart-2)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const servicesConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const bookingTrendsConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;


export default function DashboardOverview() {
  const {
    todayStats,
    recentActivity,
    appointmentStatusData,
    popularServicesData,
    bookingTrendsData,
  } = mockData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your practice today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Block Time
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Schedule
          </Button>
        </div>
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
              {todayStats.totalAppointments}
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
              {todayStats.pendingAppointments}
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
              {todayStats.completedThisWeek}
            </div>
            <p className="mt-1 text-xs text-gray-600">Successfully completed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {todayStats.averageRating}
            </div>
            <p className="mt-1 text-xs text-gray-600">
              Based on patient reviews
            </p>
          </CardContent>
        </Card>
      </div>
     
      {/* Analytics Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              Total appointments: {appointmentStatusData.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-muted-foreground leading-none">
              Most appointments are completed successfully
            </div>
          </CardFooter>
        </Card>

        {/* Popular Services - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Most booked services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={servicesConfig}>
              <BarChart accessibilityLayer data={popularServicesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="service"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.split(' ')[0]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="bookings" fill="var(--color-bookings)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              General Consultation leads with {popularServicesData[0]?.bookings} bookings
            </div>
            <div className="text-muted-foreground leading-none">
              Showing top services for current month
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Booking Trends and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Booking Trends</CardTitle>
            <CardDescription>Daily booking patterns for this week</CardDescription>
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
                <Bar dataKey="bookings" fill="var(--color-bookings)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 leading-none font-medium">
              Peak day: Saturday with {Math.max(...bookingTrendsData.map(d => d.bookings))} bookings
            </div>
            <div className="text-muted-foreground leading-none">
              Weekend shows higher booking activity
            </div>
          </CardFooter>
        </Card>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
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
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Peak Booking Hours Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Booking Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const intensity = Math.random() * 100; // Mock data
              const getIntensityColor = (intensity: number) => {
                if (intensity > 80) return "bg-blue-600";
                if (intensity > 60) return "bg-blue-500";
                if (intensity > 40) return "bg-blue-400";
                if (intensity > 20) return "bg-blue-300";
                return "bg-blue-100";
              };

              return (
                <div key={hour} className="text-center">
                  <div className="text-xs text-gray-600 mb-1">
                    {hour.toString().padStart(2, "0")}
                  </div>
                  <div
                    className={`h-8 w-full rounded ${getIntensityColor(
                      intensity
                    )} cursor-pointer hover:opacity-80 transition-opacity`}
                    title={`${hour}:00 - ${Math.round(
                      intensity
                    )}% booking rate`}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
            <span>Less busy</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <div className="w-3 h-3 bg-blue-300 rounded"></div>
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
            </div>
            <span>More busy</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
