# Provider Dashboard Integration Guide

This guide shows how the provider dashboard has been integrated with the backend API using TanStack Query.

## What's Been Implemented

### 1. Custom Hooks (`frontend/src/hooks/use-provider-frontend-dashboard.ts`)

The dashboard now uses TanStack Query for efficient data fetching and caching:

- `useProviderDashboard()` - Main hook for dashboard overview data
- `useTodaysAppointments()` - Today's confirmed appointments
- `usePendingAppointments()` - All pending appointments
- `useMonthlyStats()` - Current month statistics
- `useWeeklyStats()` - Current week statistics
- `useConfirmedAppointmentsForDateRange()` - Appointments for date range
- `useRefreshDashboard()` - Refresh all dashboard data

### 2. Updated Dashboard Component (`frontend/src/components/Provider/dashboard/DashboardOverview.tsx`)

The component now:
- Fetches real data from the API
- Shows loading skeletons while data loads
- Handles errors gracefully
- Displays real appointment counts and statistics
- Includes a refresh button
- Shows last updated timestamp

## Key Features

### Real-Time Data
- **Today's Appointments**: Shows actual confirmed appointments for today
- **Pending Appointments**: Shows appointments awaiting confirmation
- **Weekly Stats**: Current week's confirmed appointments
- **Monthly Stats**: Current month's confirmed appointments

### Loading States
- Skeleton loading components while data fetches
- Loading indicators on refresh button
- Proper error handling with retry options

### Caching & Performance
- Data is cached for optimal performance
- Automatic refetching on window focus
- Configurable stale times for different data types
- Background updates without blocking UI

## Usage Example

```tsx
import { DashboardOverview } from '@/components/Provider/dashboard/DashboardOverview';

export default function ProviderDashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <DashboardOverview />
    </div>
  );
}
```

## API Integration

The dashboard connects to these backend endpoints:

- `GET /api/provider/dashboard/overview` - Complete dashboard data
- `GET /api/provider/dashboard/todays-appointments` - Today's appointments
- `GET /api/provider/dashboard/pending-appointments` - Pending appointments
- `GET /api/provider/dashboard/monthly-stats` - Monthly statistics
- `GET /api/provider/dashboard/weekly-stats` - Weekly statistics
- `GET /api/provider/dashboard/confirmed-appointments-range` - Date range data

## Data Flow

1. **Component Mounts**: `useProviderDashboard()` automatically fetches overview data
2. **Loading State**: Shows skeleton components while loading
3. **Data Display**: Renders real data from API
4. **Error Handling**: Shows error message with retry option
5. **Refresh**: Manual refresh invalidates cache and refetches data

## Error Handling

The dashboard handles various error scenarios:

- **Network Errors**: Shows retry button
- **Authentication Errors**: Displays appropriate message
- **Server Errors**: Shows error details with refresh option
- **No Data**: Gracefully handles empty states

## Performance Optimizations

- **Stale Time**: Data is considered fresh for specified periods
- **Background Updates**: Data updates in background without blocking UI
- **Query Invalidation**: Smart cache invalidation on refresh
- **Selective Refetching**: Only refetch what's needed

## Customization

### Adjusting Cache Times

```tsx
// In the hook file, modify staleTime values:
export const useProviderDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_OVERVIEW,
    queryFn: fetchDashboardOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes - adjust as needed
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
```

### Adding New Dashboard Widgets

1. Add new API endpoint in backend
2. Create fetch function in hooks file
3. Add new query hook
4. Update dashboard component to use new data

## Testing

To test the dashboard:

1. **Ensure Backend is Running**: Laravel app should be running
2. **Authentication**: User must be logged in with provider role
3. **Sample Data**: Ensure database has appointments for testing
4. **Network Tab**: Check browser dev tools for API calls
5. **React Query DevTools**: Use for debugging query states

## Troubleshooting

### Common Issues

1. **No Data Showing**
   - Check if user has provider role
   - Verify appointments exist in database
   - Check network requests in browser dev tools

2. **Loading Forever**
   - Check backend API is running
   - Verify authentication token is valid
   - Check for CORS issues

3. **Error Messages**
   - Check Laravel logs for backend errors
   - Verify API endpoints are correct
   - Check authentication middleware

### Debug Mode

Enable React Query DevTools for debugging:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Add to your app
<ReactQueryDevtools initialIsOpen={false} />
```

## Next Steps

The dashboard is now fully integrated with real API data. Future enhancements could include:

- Real-time updates with WebSockets
- More detailed analytics charts
- Export functionality
- Advanced filtering options
- Push notifications for new appointments