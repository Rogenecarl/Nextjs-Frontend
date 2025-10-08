"use client";

import { Calendar, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  activeView: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onViewChange("calendar")}
        className={cn(
          "flex items-start gap-3 rounded-lg border bg-white p-4 transition-all hover:border-slate-300",
          activeView === "calendar"
            ? "border-slate-300 shadow-sm"
            : "border-slate-200"
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            activeView === "calendar" ? "bg-blue-50" : "bg-slate-50"
          )}
        >
          <Calendar
            className={cn(
              "h-5 w-5",
              activeView === "calendar" ? "text-blue-600" : "text-slate-600"
            )}
          />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-900">
            Calendar Views
          </div>
          <div className="text-xs text-slate-500">Month, Week & Day views</div>
        </div>
      </button>

      <button
        onClick={() => onViewChange("list")}
        className={cn(
          "flex items-start gap-3 rounded-lg border bg-white p-4 transition-all hover:border-slate-300",
          activeView === "list"
            ? "border-slate-300 shadow-sm"
            : "border-slate-200"
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            activeView === "list" ? "bg-blue-50" : "bg-slate-50"
          )}
        >
          <List
            className={cn(
              "h-5 w-5",
              activeView === "list" ? "text-blue-600" : "text-slate-600"
            )}
          />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-900">
            Appointments List
          </div>
          <div className="text-xs text-slate-500">Table view with filters</div>
        </div>
      </button>
    </div>
  );
}
