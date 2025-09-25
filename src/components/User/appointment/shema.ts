import { z } from "zod";

export const BookingServiceFormSchema = z.object({
  selectedServices: z
    .array(z.number())
    .min(1, "Please select at least one service"),
});

export const BookingDateTimeFormSchema = z.object({
  selectedDate: z.date({
    message: "Please select a date",
  }),
  selectedTime: z.string().min(1, "Please select a time slot"),
  selectedSlot: z
    .object({
      start_time: z.string(),
      end_time: z.string(),
      formatted_time: z.string(),
      datetime: z.string(),
    })
    .optional(), // Store the complete slot object for booking
});

export const BookingConfirmationSchema = z.object({
  providerId: z.number(),
  selectedServices: z.array(z.number()),
  selectedDate: z.date(),
  selectedTime: z.string(),
  selectedSlot: z.object({
    start_time: z.string(),
    end_time: z.string(),
    formatted_time: z.string(),
    datetime: z.string(),
  }),
  notes: z.string().optional(),
});

export type BookingServiceFormType = z.infer<typeof BookingServiceFormSchema>;
export type BookingDateTimeFormType = z.infer<typeof BookingDateTimeFormSchema>;
export type BookingConfirmationType = z.infer<typeof BookingConfirmationSchema>;
