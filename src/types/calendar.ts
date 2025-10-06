export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type ServiceType = "consultation" | "checkup" | "followup" | "procedure" | "emergency"

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: "male" | "female" | "other"
}

export interface Service {
  id: string
  name: string
  category: string
  duration: number // in minutes
  price: {
    min: number
    max: number
  }
}

export interface Appointment {
  id: string
  patient: Patient
  service: Service
  date: Date
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time: string
  color: "teal" | "pink" | "blue" | "orange" | "red" | "purple"
}
