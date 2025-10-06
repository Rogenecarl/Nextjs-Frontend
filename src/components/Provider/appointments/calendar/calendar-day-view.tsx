"use client"

import type { CalendarEvent, Appointment } from "@/types/calendar"
import { format, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, CheckCircle, XCircle, Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  appointments?: Appointment[]
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200", 
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200"
}

const hours = Array.from({ length: 24 }, (_, i) => i)

const eventColorClasses = {
  teal: "bg-teal-100 text-teal-700 border-teal-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  red: "bg-red-100 text-red-700 border-red-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
}

export function DayView({ currentDate, events, appointments = [] }: DayViewProps) {
  const dayEvents = events.filter((event) => isSameDay(event.date, currentDate))
  const dayAppointments = appointments.filter((appointment) => isSameDay(appointment.date, currentDate))

  const getAppointmentForHour = (hour: number) => {
    return dayAppointments.find(apt => {
      const startHour = parseInt(apt.startTime.split(':')[0])
      return startHour === hour
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4">
      {/* Main day view */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Day header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="text-sm font-medium text-gray-600 uppercase">{format(currentDate, "EEEE")}</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">{format(currentDate, "dd")}</div>
        </div>

        {/* Time grid */}
        <div className="overflow-auto max-h-[calc(100vh-250px)]">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b border-gray-200">
              {/* Time label */}
              <div className="w-20 flex-shrink-0 border-r border-gray-200 px-3 py-4 text-xs text-gray-500 text-right bg-gray-50">
                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>

              {/* Event area */}
              <div className="flex-1 min-h-[60px] hover:bg-gray-50 transition-colors p-2 relative">
                {(() => {
                  const appointment = getAppointmentForHour(hour)
                  if (appointment) {
                    const StatusIcon = appointment.status === 'pending' ? Clock : 
                                     appointment.status === 'confirmed' ? CheckCircle :
                                     appointment.status === 'completed' ? CheckCircle : XCircle
                    
                    return (
                      <div className={cn(
                        "absolute inset-2 rounded-lg border p-3",
                        statusColors[appointment.status]
                      )}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="font-medium text-sm">
                              {appointment.startTime} - {appointment.endTime}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold">{appointment.patient.name}</div>
                          <div className="text-sm opacity-80">{appointment.service.name}</div>
                          <div className="text-xs opacity-70">
                            {appointment.service.category} • {appointment.service.duration}min
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Mini calendar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{format(currentDate, "MMMM yyyy")}</h3>
          </div>
          <Calendar mode="single" selected={currentDate} className="rounded-md" />
        </div>

        {/* Appointments list */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Today's Appointments</h3>
            <Badge variant="secondary">{dayAppointments.length}</Badge>
          </div>
          <div className="space-y-3">
            {dayAppointments.length > 0 ? (
              dayAppointments.map((appointment) => {
                const StatusIcon = appointment.status === 'pending' ? Clock : 
                                 appointment.status === 'confirmed' ? CheckCircle :
                                 appointment.status === 'completed' ? CheckCircle : XCircle
                
                return (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            {getInitials(appointment.patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{appointment.patient.name}</div>
                          <div className="text-xs text-gray-500">
                            Age {appointment.patient.age} • {appointment.patient.gender}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn("gap-1 text-xs", statusColors[appointment.status])}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      <div className="text-sm font-medium">{appointment.service.name}</div>
                      <div className="text-xs text-gray-500">
                        {appointment.startTime} - {appointment.endTime} • {appointment.service.duration}min
                      </div>
                      {appointment.notes && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {appointment.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Mail className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-xs font-medium text-gray-900">
                        ${appointment.service.price.min}-${appointment.service.price.max}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No appointments today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
