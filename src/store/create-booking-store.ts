import { BookingServiceFormType, BookingDateTimeFormType } from "@/components/User/appointment/shema";
import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand/react";

// Complete booking state interface
interface BookingState {
  // Step 1: Service selection
  selectedServices?: number[];
  
  // Step 2: Date and time selection
  selectedDate?: Date;
  selectedTime?: string;
  selectedSlot?: {
    start_time: string;
    end_time: string;
    formatted_time: string;
    datetime: string;
  };
  
  // Provider information
  providerId?: number;
  
  // Additional booking details
  notes?: string;
  
  // Actions
  setData: (data: Partial<BookingState>) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      // Initial state
      selectedServices: undefined,
      selectedDate: undefined,
      selectedTime: undefined,
      selectedSlot: undefined,
      providerId: undefined,
      notes: undefined,
      
      // Actions
      setData: (data) => set((state) => ({ ...state, ...data })),
      clearBooking: () => set({
        selectedServices: undefined,
        selectedDate: undefined,
        selectedTime: undefined,
        selectedSlot: undefined,
        providerId: undefined,
        notes: undefined,
      }),
    }),
    {
      name: "user-booking-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
