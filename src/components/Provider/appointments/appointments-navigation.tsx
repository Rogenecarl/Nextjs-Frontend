"use client"
import { List, Grid3x3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppointmentsNavigationProps {
  activeSection: "calendar" | "appointments"
  onSectionChange: (section: "calendar" | "appointments") => void
}

export function AppointmentsNavigation({ activeSection, onSectionChange }: AppointmentsNavigationProps) {
  const sections = [
    {
      key: "calendar" as const,
      label: "Calendar Views",
      icon: Grid3x3,
      description: "Month, Week & Day views",
    },
    {
      key: "appointments" as const,
      label: "Appointments List",
      icon: List,
      description: "Table view with filters",
    },
  ]

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-sm text-gray-600">Manage your appointments and schedule efficiently</p>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.key
            return (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={cn(
                  "flex items-center gap-3 px-5 py-4 rounded-lg border-2 transition-all duration-200 min-w-[200px]",
                  isActive
                    ? "bg-white border-cyan-500 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white",
                )}
              >
                <div className={cn("p-2 rounded-lg", isActive ? "bg-cyan-50" : "bg-gray-100")}>
                  <Icon className={cn("h-5 w-5", isActive ? "text-cyan-600" : "text-gray-600")} />
                </div>
                <div className="text-left flex-1">
                  <div className={cn("font-semibold text-sm", isActive ? "text-gray-900" : "text-gray-700")}>
                    {section.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
