import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    appointment_id?: number;
    user_name?: string;
    provider_name?: string;
    title?: string;
    message: string;
    type?: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

interface NotificationsResponse {
  unread: Notification[];
  read: Notification[];
  unread_count: number;
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationsResponse> => {
      const response = await axiosInstance.get("/notifications");
      return response.data;
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await axiosInstance.post(
        `/notifications/${notificationId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        "/notifications/mark-all-as-read"
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
