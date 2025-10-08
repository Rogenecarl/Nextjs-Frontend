"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Phone,
  Mail,
  DollarSign,
  User,
  FileText,
  Edit
} from "lucide-react"
import { format } from "date-fns"
import { AppointmentProps } from "@/types/types"
import { cn } from "@/lib/utils"

interface AppointmentDetailsModalProps {
  appointment: AppointmentProps | null
  isOpen: boolean
  onClose: () => void
  onSave?: (appointment: AppointmentProps) => void
}

const statusConfig = {
  pending: { 
    label: "Pending", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock 
  },
  confirmed: { 
    label: "Confirmed", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle 
  },
  completed: { 
    label: "Completed", 
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle 
  },
  cancelled: { 
    label: "Cancelled", 
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle 
  }
}

export function AppointmentDetailsModal({ 
  appointment, 
  isOpen, 
  onClose, 
  onSave 
}: AppointmentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAppointment, setEditedAppointment] = useState<AppointmentProps | null>(null)

  if (!appointment) return null

  const StatusIcon = statusConfig[appointment.status].icon
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleEdit = () => {
    setEditedAppointment({ ...appointment })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedAppointment && onSave) {
      onSave(editedAppointment)
    }
    setIsEditing(false)
    onClose()
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedAppointment(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              Appointment Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn("gap-1", statusConfig[appointment.status].color)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig[appointment.status].label}
              </Badge>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Patient Information</h3>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {getInitials(appointment.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="font-medium text-gray-900">{appointment.user.name}</div>
                  <div className="text-sm text-gray-500">
                    Patient ID: {appointment.user.id}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {appointment.user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Date & Time
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={format(new Date(editedAppointment?.start_time || appointment.start_time), "yyyy-MM-dd")}
                      onChange={(e) => setEditedAppointment(prev => prev ? {
                        ...prev,
                        start_time: e.target.value + 'T' + format(new Date(prev.start_time), "HH:mm:ss")
                      } : null)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="time"
                        value={format(new Date(editedAppointment?.start_time || appointment.start_time), "HH:mm")}
                        onChange={(e) => setEditedAppointment(prev => prev ? {
                          ...prev,
                          start_time: format(new Date(prev.start_time), "yyyy-MM-dd") + 'T' + e.target.value + ':00'
                        } : null)}
                      />
                      <Input
                        type="time"
                        value={format(new Date(editedAppointment?.end_time || appointment.end_time), "HH:mm")}
                        onChange={(e) => setEditedAppointment(prev => prev ? {
                          ...prev,
                          end_time: format(new Date(prev.end_time), "yyyy-MM-dd") + 'T' + e.target.value + ':00'
                        } : null)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-900">
                    <div>{format(new Date(appointment.start_time), "EEEE, MMMM dd, yyyy")}</div>
                    <div className="text-gray-600">
                      {format(new Date(appointment.start_time), "h:mm a")} - {format(new Date(appointment.end_time), "h:mm a")}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                {isEditing ? (
                  <Select
                    value={editedAppointment?.status || appointment.status}
                    onValueChange={(value) => setEditedAppointment(prev => prev ? {
                      ...prev,
                      status: value as any
                    } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge 
                    variant="outline" 
                    className={cn("gap-1", statusConfig[appointment.status].color)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[appointment.status].label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Service
                </label>
                <div className="text-sm text-gray-900">
                  <div className="font-medium">{appointment.services.map(s => s.name).join(', ')}</div>
                  <div className="text-gray-600">
                    {appointment.services.length} service{appointment.services.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Price Range
                </label>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                  <DollarSign className="h-4 w-4" />
                  ${appointment.total_price}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Notes
              </label>
            </div>
            {isEditing ? (
              <Textarea
                value={editedAppointment?.notes || appointment.notes || ""}
                onChange={(e) => setEditedAppointment(prev => prev ? {
                  ...prev,
                  notes: e.target.value
                } : null)}
                placeholder="Add appointment notes..."
                rows={3}
              />
            ) : (
              <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                {appointment.notes || "No notes added"}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}