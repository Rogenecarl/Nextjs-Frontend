export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
export type ServiceType = "consultation" | "checkup" | "followup" | "procedure" | "emergency"

export interface User {
  id: number
  name: string
  email?: string
  phone?: string
  age?: number
  gender?: "male" | "female" | "other"
}

export interface Service {
  id: number
  name: string
  description?: string
  category?: string
  duration?: number // in minutes
  price_min?: number
  price_max?: number
}

// Updated to match your API response structure
export interface Appointment {
  id: number
  appointment_number: string
  user: User
  services: Service[] // Changed from single service to array
  start_time: string // ISO string from API
  end_time: string // ISO string from API
  formatted_start_time: string // Formatted time from backend (e.g., "2:30 PM")
  formatted_end_time: string // Formatted time from backend (e.g., "3:30 PM")
  formatted_date: string // Formatted date from backend (e.g., "Jan 15, 2024")
  status: AppointmentStatus
  notes?: string
  total_price: string
  created_at: string
  updated_at: string
  cancelled_at?: string
  cancelled_by?: string
  cancellation_reason?: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  color: "teal" | "pink" | "blue" | "orange" | "red" | "purple"
}
