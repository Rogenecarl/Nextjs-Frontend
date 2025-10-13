"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, RotateCcw, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useProviderOperatingHours,
  useUpdateProviderOperatingHours,
} from "@/hooks/useProviderOperatingHoursMutation";

interface OperatingHourData {
  day_of_week: number;
  start_time: string | null;
  end_time: string | null;
  is_closed: boolean;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Convert time from HTML time input to backend format (H:i)
function formatToBackend(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

// Convert backend time format to HTML time input format
function formatToInput(timeStr: string | null): string {
  if (!timeStr) return "";
  return timeStr.substring(0, 5); // Remove seconds if present
}

// Validate time format (H:i)
function isValidTimeFormat(timeStr: string | null): boolean {
  if (!timeStr) return true; // null is valid for closed days
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
}

export default function ProviderOperatingHours() {
  const [operatingHours, setOperatingHours] = useState<OperatingHourData[]>([]);
  const [originalOperatingHours, setOriginalOperatingHours] = useState<
    OperatingHourData[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    data: operatingHoursData,
    isLoading,
    error: operatingHoursError,
  } = useProviderOperatingHours();

  const updateMutation = useUpdateProviderOperatingHours();

  // Initialize operating hours from API data or defaults
  useEffect(() => {
    if (operatingHoursData?.operating_hours) {
      const hours = operatingHoursData.operating_hours.map((hour: any) => ({
        day_of_week: hour.day_of_week,
        start_time: formatToInput(hour.start_time),
        end_time: formatToInput(hour.end_time),
        is_closed: hour.is_closed,
      }));

      // Ensure all 7 days are present
      const allDays = Array.from({ length: 7 }, (_, i) => {
        const existingDay = hours.find((h: any) => h.day_of_week === i);
        if (existingDay) {
          return existingDay;
        }
        // Default for missing days
        const isWeekday = i >= 1 && i <= 5;
        return {
          day_of_week: i,
          start_time: isWeekday ? "09:00" : null,
          end_time: isWeekday ? "17:00" : null,
          is_closed: !isWeekday,
        };
      });

      // FIX: Use deep copies for both states
      setOperatingHours(JSON.parse(JSON.stringify(allDays)));
      setOriginalOperatingHours(JSON.parse(JSON.stringify(allDays)));
      setHasChanges(false);
    } else if (!isLoading && !operatingHoursData?.operating_hours) {
      // Initialize with default values if no data exists
      const defaultHours = Array.from({ length: 7 }, (_, i) => {
        const isWeekday = i >= 1 && i <= 5;
        return {
          day_of_week: i,
          start_time: isWeekday ? "09:00" : null,
          end_time: isWeekday ? "17:00" : null,
          is_closed: !isWeekday,
        };
      });

      // FIX: Also use deep copies here for the default state
      setOperatingHours(JSON.parse(JSON.stringify(defaultHours)));
      setOriginalOperatingHours(JSON.parse(JSON.stringify(defaultHours)));
      setHasChanges(false);
    }
  }, [operatingHoursData, isLoading]);

  // Check for changes whenever operating hours change
  useEffect(() => {
    if (originalOperatingHours.length > 0) {
      const hasActualChanges = checkForChanges(
        operatingHours,
        originalOperatingHours
      );
      setHasChanges(hasActualChanges);
    }
  }, [operatingHours, originalOperatingHours]);

  // Handle field changes
  function handleOperatingHourChange(
    index: number,
    field: string,
    value: string | boolean
  ) {
    // FIX: Create a deep copy of the current state to modify
    const updated = JSON.parse(JSON.stringify(operatingHours));

    if (field === "is_closed") {
      updated[index].is_closed = value as boolean;
      if (value === true) {
        updated[index].start_time = null;
        updated[index].end_time = null;
      } else {
        // Set default times when opening a day
        updated[index].start_time = "09:00";
        updated[index].end_time = "17:00";
      }
    } else if (field === "start_time") {
      updated[index].start_time = value as string;
    } else if (field === "end_time") {
      updated[index].end_time = value as string;
    }

    setOperatingHours(updated);
  }

  // Helper function to check if there are actual changes
  function checkForChanges(
    current: OperatingHourData[],
    original: OperatingHourData[]
  ): boolean {
    if (current.length !== original.length) {
      return true;
    }

    return current.some((currentDay) => {
      const originalDay = original.find(
        (d) => d.day_of_week === currentDay.day_of_week
      );
      if (!originalDay) {
        return true;
      }

      return (
        currentDay.is_closed !== originalDay.is_closed ||
        currentDay.start_time !== originalDay.start_time ||
        currentDay.end_time !== originalDay.end_time
      );
    });
  }

  // Reset to original values
  function handleReset() {
    // FIX: Reset with a deep copy of the original hours
    setOperatingHours(JSON.parse(JSON.stringify(originalOperatingHours)));
    setHasChanges(false);
    toast.info("Changes reset to original values");
  }

  // Save changes
  async function handleSave() {
    // Format the data for backend
    const formattedOperatingHours = operatingHours.map((day) => {
      const startTime = day.is_closed
        ? null
        : formatToBackend(day.start_time || "");
      const endTime = day.is_closed
        ? null
        : formatToBackend(day.end_time || "");

      // Validate time format
      if (!day.is_closed) {
        if (!isValidTimeFormat(startTime)) {
          toast.error(
            `Invalid start time format for ${getDayName(day.day_of_week)}`
          );
          throw new Error("Invalid time format");
        }
        if (!isValidTimeFormat(endTime)) {
          toast.error(
            `Invalid end time format for ${getDayName(day.day_of_week)}`
          );
          throw new Error("Invalid time format");
        }
      }

      return {
        day_of_week: day.day_of_week,
        start_time: startTime,
        end_time: endTime,
        is_closed: day.is_closed,
      };
    });

    try {
      await updateMutation.mutateAsync({
        operating_hours: formattedOperatingHours,
      });

      // Update original data to current state with deep copy
      setOriginalOperatingHours(JSON.parse(JSON.stringify(operatingHours)));
      setHasChanges(false);

      toast.success("Operating hours updated successfully!");
    } catch (error) {
      console.error("Failed to update operating hours:", error);
    }
  }

  // Helper function to get day name
  function getDayName(dayOfWeek: number): string {
    return DAYS[dayOfWeek] || `Day ${dayOfWeek}`;
  }

  // Check if any day is open (at least one day must be open)
  const isAnyDayOpen = operatingHours.some((day) => !day.is_closed);
  const hasOperatingHoursError = !isAnyDayOpen;

  // Check if there are any time validation errors
  const hasTimeValidationErrors = operatingHours.some(
    (day) =>
      !day.is_closed &&
      day.start_time &&
      day.end_time &&
      day.end_time <= day.start_time
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operating Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (operatingHoursError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Operating Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Error loading operating hours. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your availability and operating hours
            </p>
          </div>
          <div className="flex gap-3">
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={updateMutation.isPending}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            {hasChanges && (
              <Button
                onClick={handleSave}
                disabled={
                  updateMutation.isPending ||
                  !isAnyDayOpen ||
                  hasOperatingHoursError ||
                  hasTimeValidationErrors
                }
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {hasTimeValidationErrors ? (
                  <div className="flex flex-col items-center">
                    <span>Fix Time Errors</span>
                    <span className="text-xs">
                      Check end times are after start times
                    </span>
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              📅 Weekly Schedule
            </h3>
            <p className="text-sm text-blue-700">
              Set your operating hours for each day of the week. Patients will
              only be able to book appointments during these hours.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                At least one day must be open with operating hours
              </p>
            </div>
          </div>

          {hasOperatingHoursError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                ⚠️ At least one day must be open for appointments.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {operatingHours.map((day, index) => (
              <div
                key={day.day_of_week}
                className="flex flex-col sm:flex-row items-center justify-between gap-2 py-2"
              >
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Switch
                    checked={!day.is_closed}
                    onCheckedChange={(checked) =>
                      handleOperatingHourChange(index, "is_closed", !checked)
                    }
                  />
                  <span className="font-medium min-w-[100px]">
                    {getDayName(day.day_of_week)}
                  </span>
                </div>

                {!day.is_closed ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Input
                        type="time"
                        className={`w-32 ${
                          !day.is_closed &&
                          day.start_time &&
                          day.end_time &&
                          day.end_time <= day.start_time
                            ? "border-red-500"
                            : ""
                        }`}
                        value={day.start_time || ""}
                        onChange={(e) =>
                          handleOperatingHourChange(
                            index,
                            "start_time",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="relative">
                      <Input
                        type="time"
                        className={`w-32 ${
                          !day.is_closed &&
                          day.start_time &&
                          day.end_time &&
                          day.end_time <= day.start_time
                            ? "border-red-500"
                            : ""
                        }`}
                        value={day.end_time || ""}
                        onChange={(e) =>
                          handleOperatingHourChange(
                            index,
                            "end_time",
                            e.target.value
                          )
                        }
                        required
                      />
                      {!day.is_closed &&
                        day.start_time &&
                        day.end_time &&
                        day.end_time <= day.start_time && (
                          <div className="absolute -bottom-5 left-0 w-64 text-xs text-red-500">
                            End time must be after start time
                          </div>
                        )}
                    </div>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                      Open
                    </span>
                  </div>
                ) : (
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 w-full sm:w-auto text-center sm:text-left">
                    Closed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
