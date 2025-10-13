import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`;

// Interface for operating hours data
interface OperatingHourData {
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_closed?: boolean;
}

interface OperatingHour {
  id: number;
  provider_id: number;
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

interface OperatingHoursUpdateData {
  operating_hours: OperatingHourData[];
}

interface OperatingHoursResponse {
  operating_hours: OperatingHour[];
  message: string;
}

// Hook for fetching provider's operating hours
export const useProviderOperatingHours = () => {
  return useQuery({
    queryKey: ["provider-operating-hours"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${API_URL}/provider/operating-hours`
      );
      return response.data as OperatingHoursResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook for updating provider's operating hours
export const useUpdateProviderOperatingHours = () => {
  const queryClient = useQueryClient();

  return useMutation<OperatingHoursResponse, Error, OperatingHoursUpdateData>({
    mutationFn: async (operatingHoursData: OperatingHoursUpdateData) => {
      const response = await axiosInstance.put(
        `${API_URL}/provider/operating-hours`,
        operatingHoursData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Operating hours updated successfully:", data);
      toast.success("Operating hours updated successfully!");

      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["provider-operating-hours"],
      });
    },

    onError: (error: any) => {
      console.error("Update operating hours error:", error);

      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        const firstErrorMessage = validationErrors[firstErrorKey][0];
        toast.error(
          firstErrorMessage || "Please check your operating hours details."
        );
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to update operating hours.");
      } else if (error.response?.status === 401) {
        toast.error("Please log in to update operating hours.");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update operating hours. Please try again."
        );
      }
    },
  });
};

// Export types for use in components
export type {
  OperatingHour,
  OperatingHourData,
  OperatingHoursUpdateData,
  OperatingHoursResponse,
};
