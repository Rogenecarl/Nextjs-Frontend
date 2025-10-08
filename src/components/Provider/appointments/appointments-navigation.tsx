"use client";
import { Calendar, List } from "lucide-react";
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
      icon: Calendar,
      description: "Month, Week & Day views",
    },
    {
      key: "appointments" as const,
      label: "Appointments List",
      icon: List,
      description: "Table view with filters",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-6 max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Appointments
          </h1>
          <p className="text-gray-600">
            Manage your appointments and schedule efficiently
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                onClick={() => onSectionChange(section.key)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                )}
              >
                <Icon className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium text-sm">{section.label}</div>
                  <div
                    className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-gray-300" : "text-gray-500"
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
  );
}
