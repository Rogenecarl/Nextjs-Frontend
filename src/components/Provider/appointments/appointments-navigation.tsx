"use client";
import {
  List,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentsNavigationProps {
  activeSection: "calendar" | "appointments";
  onSectionChange: (section: "calendar" | "appointments") => void;
}

export function AppointmentsNavigation({
  activeSection,
  onSectionChange,
}: AppointmentsNavigationProps) {
  const sections = [
    {
      key: "calendar" as const,
      label: "Calendar Views",
      icon: Grid3x3,
      description: "Month, Week & Day views",
      color: "text-blue-600",
    },
    {
      key: "appointments" as const,
      label: "Appointments List",
      icon: List,
      description: "Table view with filters",
      color: "text-green-600",
    },
  ];



  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Main Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-2">
                Manage your appointments and schedule efficiently
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start">
            {/* Section Tabs */}
            <div className="flex bg-gray-50 rounded-xl p-1.5 border border-gray-200 shadow-sm">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                return (
                  <button
                    key={section.key}
                    onClick={() => onSectionChange(section.key)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 min-w-[180px] sm:min-w-[200px]",
                      isActive
                        ? "bg-white shadow-md border border-gray-200 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? section.color : "text-gray-500"
                      )}
                    />
                    <div className="text-left">
                      <div
                        className={cn(
                          "font-semibold text-sm",
                          isActive ? "text-gray-900" : "text-gray-700"
                        )}
                      >
                        {section.label}
                      </div>
                      <div
                        className={cn(
                          "text-xs mt-0.5",
                          isActive ? "text-gray-600" : "text-gray-500"
                        )}
                      >
                        {section.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
