"use client";

import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const { data, isLoading, error } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  // Combine unread and read notifications, with unread first
  const allNotifications = [
    ...(data?.unread || []),
    ...(data?.read || [])
  ];
  const unreadCount = data?.unread_count || 0;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  if (error) {
    return null; // Hide notification bell if there's an error
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3">
          <DropdownMenuLabel className="font-semibold p-0">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto p-1"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Mark all read"
              )}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem disabled>
            <div className="text-center py-4 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            </div>
          </DropdownMenuItem>
        ) : allNotifications.length === 0 ? (
          <DropdownMenuItem disabled>
            <div className="text-center py-4 text-muted-foreground">
              No notifications
            </div>
          </DropdownMenuItem>
        ) : (
          allNotifications.map((notification) => {
            // Use title from notification data or generate based on type
            const getNotificationTitle = () => {
              if ('title' in notification.data && notification.data.title) {
                return notification.data.title;
              }
              if (notification.type.includes('NewAppointment')) {
                return 'New Appointment Request';
              } else if (notification.type.includes('AppointmentConfirmed')) {
                return 'Appointment Confirmed';
              }
              return 'Notification';
            };

            return (
              <DropdownMenuItem 
                key={notification.id} 
                className="flex-col items-start p-4 cursor-pointer"
                onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{getNotificationTitle()}</h4>
                      {!notification.read_at && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.data.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center">
          <Button variant="ghost" size="sm" className="text-sm">
            View all notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}