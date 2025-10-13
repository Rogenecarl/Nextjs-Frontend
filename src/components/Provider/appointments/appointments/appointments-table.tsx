"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { MoreHorizontal, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import type { AppointmentProps } from "@/types/types"
import { cn } from "@/lib/utils"
import { useConfirmAppointment, useCompleteAppointment, useCancelAppointment } from "./use-provider-appointment-hook"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { AppointmentsTableSkeleton } from "./appointments-table-skeleton"

interface AppointmentsTableProps {
  appointments: AppointmentProps[]
  onAppointmentClick?: (appointment: AppointmentProps) => void
  isLoading?: boolean
}

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  no_show: {
    label: "No Show",
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
}

export function AppointmentsTable({ appointments, onAppointmentClick, isLoading = false }: AppointmentsTableProps) {
  const [sortBy, setSortBy] = useState<"date" | "patient" | "service" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null)

  // Mutation hooks
  const confirmMutation = useConfirmAppointment()
  const completeMutation = useCompleteAppointment()
  const cancelMutation = useCancelAppointment()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Action handlers
  const handleConfirm = async (appointmentId: string) => {
    const loadingToast = toast.loading("Confirming appointment...")

    try {
      await confirmMutation.mutateAsync(appointmentId)
      toast.dismiss(loadingToast)
      toast.success("Appointment confirmed successfully")
      setShowConfirmDialog(null)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to confirm appointment")
    }
  }

  const handleComplete = async (appointmentId: string) => {
    const loadingToast = toast.loading("Marking appointment as complete...")

    try {
      await completeMutation.mutateAsync(appointmentId)
      toast.dismiss(loadingToast)
      toast.success("Appointment marked as complete")
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to complete appointment")
    }
  }

  const handleCancel = async (appointmentId: string) => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason")
      return
    }

    const loadingToast = toast.loading("Cancelling appointment...")

    try {
      await cancelMutation.mutateAsync({
        appointmentId,
        reason: cancelReason,
      })
      toast.dismiss(loadingToast)
      toast.success("Appointment cancelled successfully")
      setShowCancelDialog(null)
      setCancelReason("")
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to cancel appointment")
    }
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "date":
        comparison = new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        break
      case "patient":
        comparison = a.user.name.localeCompare(b.user.name)
        break
      case "service":
        const aServiceName = a.services[0]?.name || ""
        const bServiceName = b.services[0]?.name || ""
        comparison = aServiceName.localeCompare(bServiceName)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  // Show skeleton loading state
  if (isLoading) {
    return <AppointmentsTableSkeleton />
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-gray-700 font-semibold py-4 px-6">Appointment #</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Name</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Date & Time</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Service</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Status</TableHead>
              <TableHead className="text-gray-700 font-semibold py-4">Price</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                onClick={() => onAppointmentClick?.(appointment)}
              >
                <TableCell className="py-4 px-6">
                  <div className="font-mono text-sm font-semibold text-gray-900">#{appointment.appointment_number}</div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                        {getInitials(appointment.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{appointment.user.name}</div>
                      {/* <div className="text-sm text-gray-500">{appointment.user.email}</div> */}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-gray-900">{appointment.formatted_date}</div>
                    <div className="text-sm text-gray-500">
                      {appointment.formatted_start_time} - {appointment.formatted_end_time}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="space-y-0.5">
                    <div className="font-medium text-gray-900">
                      {appointment.services.map((s) => s.name).join(", ")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.services.length} service
                      {appointment.services.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={cn("font-semibold px-3 py-1", statusConfig[appointment.status].color)}
                  >
                    {statusConfig[appointment.status].label}
                  </Badge>
                </TableCell>

                <TableCell className="py-4">
                  <div className="font-semibold text-gray-900">${appointment.total_price}</div>
                </TableCell>

                <TableCell className="py-4" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {appointment.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                            onClick={() => setShowConfirmDialog(appointment.id.toString())}
                            disabled={confirmMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {confirmMutation.isPending ? "Confirming..." : "Confirm Booking"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAppointmentClick?.(appointment)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                            onClick={() => setShowCancelDialog(appointment.id.toString())}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Booking
                          </DropdownMenuItem>
                        </>
                      )}
                      {appointment.status === "confirmed" && (
                        <>
                          <DropdownMenuItem
                            className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                            onClick={() => handleComplete(appointment.id.toString())}
                            disabled={completeMutation.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {completeMutation.isPending ? "Completing..." : "Mark as Complete"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAppointmentClick?.(appointment)}>
                            View Details
                          </DropdownMenuItem>
                        </>
                      )}
                      {appointment.status !== "pending" && appointment.status !== "confirmed" && (
                        <DropdownMenuItem onClick={() => onAppointmentClick?.(appointment)}>
                          View Details
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="space-y-3 p-4">
          {sortedAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer bg-white"
              onClick={() => onAppointmentClick?.(appointment)}
            >
              {/* Appointment Number Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <div className="font-mono text-sm font-semibold text-gray-900">#{appointment.appointment_number}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {appointment.status === "pending" && (
                      <>
                        <DropdownMenuItem
                          className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                          onClick={() => setShowConfirmDialog(appointment.id.toString())}
                          disabled={confirmMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {confirmMutation.isPending ? "Confirming..." : "Confirm Booking"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAppointmentClick?.(appointment)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                          onClick={() => setShowCancelDialog(appointment.id.toString())}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Booking
                        </DropdownMenuItem>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <>
                        <DropdownMenuItem
                          className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                          onClick={() => handleComplete(appointment.id.toString())}
                          disabled={completeMutation.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {completeMutation.isPending ? "Completing..." : "Mark as Complete"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAppointmentClick?.(appointment)}>
                          View Details
                        </DropdownMenuItem>
                      </>
                    )}
                    {appointment.status !== "pending" && appointment.status !== "confirmed" && (
                      <DropdownMenuItem onClick={() => onAppointmentClick?.(appointment)}>
                        View Details
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                    {getInitials(appointment.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{appointment.user.name}</div>
                  {/* <div className="text-sm text-gray-500 truncate">{appointment.user.email}</div> */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 font-semibold">Date & Time</div>
                  <div className="text-sm font-semibold text-gray-900">{appointment.formatted_date}</div>
                  <div className="text-sm text-gray-600">
                    {appointment.formatted_start_time} - {appointment.formatted_end_time}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 font-semibold">Service</div>
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.services.map((s) => s.name).join(", ")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.services.length} service
                    {appointment.services.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Badge
                  variant="outline"
                  className={cn("font-semibold px-3 py-1", statusConfig[appointment.status].color)}
                >
                  {statusConfig[appointment.status].label}
                </Badge>

                <div className="font-semibold text-gray-900 text-lg">${appointment.total_price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            There are no appointments matching your current filters.
          </p>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule New Appointment
          </Button>
        </div>
      )}

      {/* Confirm Dialog */}
      <Dialog open={!!showConfirmDialog} onOpenChange={() => setShowConfirmDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <DialogTitle className="text-xl">Confirm Appointment</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Are you sure you want to confirm this appointment? The patient will be notified via email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(null)}
              disabled={confirmMutation.isPending}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirm(showConfirmDialog!)}
              disabled={confirmMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {confirmMutation.isPending ? "Confirming..." : "Confirm Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={!!showCancelDialog}
        onOpenChange={() => {
          setShowCancelDialog(null)
          setCancelReason("")
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100">
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
              <DialogTitle className="text-xl">Cancel Appointment</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Please provide a reason for cancelling this appointment. The patient will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="resize-none h-24 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelDialog(null)
                setCancelReason("")
              }}
              disabled={cancelMutation.isPending}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleCancel(showCancelDialog!)}
              disabled={cancelMutation.isPending || !cancelReason.trim()}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
