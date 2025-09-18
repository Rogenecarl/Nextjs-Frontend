import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Eye, Plus, Star, TrendingUp, Users } from 'lucide-react';

interface ProviderApprovedDashboardProps {
    provider: {
        id: number;
        business_name: string;
        status: string;
        created_at: string;
    };
}

export default function ProviderApprovedDashboard({ provider }: ProviderApprovedDashboardProps) {
    // Mock data for demonstration
    const stats = {
        totalBookings: 156,
        activeBookings: 12,
        totalRevenue: 15420,
        monthlyRevenue: 3240,
        averageRating: 4.8,
        totalReviews: 89,
        completionRate: 96,
        responseTime: '2 hours',
    };

    // Recent bookings mock data
    const recentBookings = [
        {
            id: 1,
            service: 'House Cleaning',
            customer: 'John Doe',
            date: '2024-01-15',
            time: '10:00 AM',
            status: 'confirmed',
            amount: 120,
        },
        {
            id: 2,
            service: 'Plumbing Repair',
            customer: 'Jane Smith',
            date: '2024-01-16',
            time: '2:00 PM',
            status: 'pending',
            amount: 85,
        },
        {
            id: 3,
            service: 'Garden Maintenance',
            customer: 'Mike Johnson',
            date: '2024-01-17',
            time: '9:00 AM',
            status: 'completed',
            amount: 200,
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            confirmed: { color: 'bg-blue-100 text-blue-700', label: 'Confirmed' },
            pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
            completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
            cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    return (
        <div className="space-y-4">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {provider.business_name}!</h1>
                    <p className="text-gray-600">Here's what's happening with your business today.</p>
                </div>
                {/* <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </Button> */}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
                        <p className="mt-1 flex items-center text-xs text-green-600">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</div>
                        <p className="mt-1 flex items-center text-xs text-green-600">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            +8% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.averageRating}</div>
                        <p className="mt-1 text-xs text-gray-600">Based on {stats.totalReviews} reviews</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Active Bookings</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.activeBookings}</div>
                        <p className="mt-1 text-xs text-gray-600">{stats.completionRate}% completion rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-base font-semibold">
                            <Plus className="mr-2 h-5 w-5 text-blue-600" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Service
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Set Availability
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Update Pricing
                        </Button>
                    </CardContent>
                </Card>

                <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-base font-semibold">
                            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                            Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Response Time</span>
                            <span className="font-medium">{stats.responseTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Completion Rate</span>
                            <span className="font-medium text-green-600">{stats.completionRate}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Customer Satisfaction</span>
                            <div className="flex items-center">
                                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{stats.averageRating}/5</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-base font-semibold">
                            <Clock className="mr-2 h-5 w-5 text-purple-600" />
                            Today's Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="py-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">3</div>
                            <p className="text-sm text-gray-600">Appointments Today</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-xs text-gray-500">Next: House Cleaning at 2:00 PM</div>
                            <Button className="w-full" variant="outline" size="sm">
                                View Full Schedule
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                        <CardDescription>Your latest booking requests</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View All
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{booking.service}</h4>
                                        <p className="text-sm text-gray-600">{booking.customer}</p>
                                        <div className="mt-1 flex items-center text-xs text-gray-500">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {booking.date} at {booking.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-gray-900">${booking.amount}</div>
                                    <div className="mt-1">{getStatusBadge(booking.status)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
