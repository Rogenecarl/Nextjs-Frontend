"use client";

import { useState } from "react";
import { AppointmentsNavigation } from "@/components/Provider/appointments/appointments-navigation";
import { CalendarSection } from "@/components/Provider/appointments/calendar-section";
import { AppointmentsSection } from "@/components/Provider/appointments/appointments-section";
import type { CalendarEvent, Appointment } from "@/types/calendar";
import ProviderLayout from "@/components/Provider/layout/ProviderLayout";

// Sample events data
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Architecture Discussion",
    date: new Date(2025, 9, 27),
    time: "3:30 PM",
    color: "teal",
  },
  {
    id: "2",
    title: "Stakeholder Update",
    date: new Date(2025, 9, 27),
    time: "6:30 PM",
    color: "pink",
  },
  {
    id: "3",
    title: "Feature Planning",
    date: new Date(2025, 9, 28),
    time: "9:30 AM",
    color: "blue",
  },
  {
    id: "4",
    title: "Tech Talk",
    date: new Date(2025, 9, 28),
    time: "10:00 AM",
    color: "blue",
  },
  {
    id: "5",
    title: "Team Training",
    date: new Date(2025, 9, 29),
    time: "11:00 AM",
    color: "orange",
  },
  {
    id: "6",
    title: "Feature Planning",
    date: new Date(2025, 9, 29),
    time: "1:15 PM",
    color: "pink",
  },
  {
    id: "7",
    title: "Stakeholder Update",
    date: new Date(2025, 9, 29),
    time: "5:00 PM",
    color: "pink",
  },
  {
    id: "8",
    title: "Product Demo",
    date: new Date(2025, 9, 31),
    time: "12:00 PM",
    color: "blue",
  },
  {
    id: "9",
    title: "Bug Triage",
    date: new Date(2025, 10, 1),
    time: "11:00 AM",
    color: "orange",
  },
  {
    id: "10",
    title: "User Testing",
    date: new Date(2025, 10, 2),
    time: "11:15 AM",
    color: "red",
  },
  {
    id: "11",
    title: "Team Standup",
    date: new Date(2025, 10, 2),
    time: "1:00 PM",
    color: "blue",
  },
  {
    id: "12",
    title: "Deployment Planning",
    date: new Date(2025, 10, 3),
    time: "1:00 PM",
    color: "teal",
  },
  {
    id: "13",
    title: "Tech Talk",
    date: new Date(2025, 10, 3),
    time: "3:30 PM",
    color: "orange",
  },
  {
    id: "14",
    title: "Sprint Planning",
    date: new Date(2025, 10, 3),
    time: "5:00 PM",
    color: "purple",
  },
  {
    id: "15",
    title: "Client Meeting",
    date: new Date(2025, 10, 4),
    time: "6:00 PM",
    color: "orange",
  },
  {
    id: "16",
    title: "Sprint Planning",
    date: new Date(2025, 10, 4),
    time: "6:30 PM",
    color: "pink",
  },
  {
    id: "17",
    title: "Team Training",
    date: new Date(2025, 10, 5),
    time: "9:15 AM",
    color: "teal",
  },
  {
    id: "18",
    title: "User Testing",
    date: new Date(2025, 10, 6),
    time: "12:30 PM",
    color: "blue",
  },
  {
    id: "19",
    title: "Product Demo",
    date: new Date(2025, 10, 7),
    time: "11:45 AM",
    color: "orange",
  },
  {
    id: "20",
    title: "Stakeholder Update",
    date: new Date(2025, 10, 7),
    time: "9:45 PM",
    color: "blue",
  },
  {
    id: "21",
    title: "Code Review",
    date: new Date(2025, 10, 8),
    time: "12:30 PM",
    color: "blue",
  },
  {
    id: "22",
    title: "User Testing",
    date: new Date(2025, 10, 9),
    time: "10:30 AM",
    color: "orange",
  },
  {
    id: "23",
    title: "Deployment Planning",
    date: new Date(2025, 10, 9),
    time: "4:00 PM",
    color: "purple",
  },
  {
    id: "24",
    title: "Sprint Planning",
    date: new Date(2025, 10, 10),
    time: "9:15 AM",
    color: "purple",
  },
  {
    id: "25",
    title: "Architecture Discussion",
    date: new Date(2025, 10, 11),
    time: "11:30 AM",
    color: "teal",
  },
  {
    id: "26",
    title: "Product Demo",
    date: new Date(2025, 10, 12),
    time: "8:30 AM",
    color: "blue",
  },
  {
    id: "27",
    title: "User Testing",
    date: new Date(2025, 10, 14),
    time: "6:45 PM",
    color: "red",
  },
  {
    id: "28",
    title: "Deployment Planning",
    date: new Date(2025, 10, 15),
    time: "9:15 PM",
    color: "pink",
  },
  {
    id: "29",
    title: "Stakeholder Update",
    date: new Date(2025, 10, 16),
    time: "9:15 PM",
    color: "orange",
  },
];

// Sample appointments data
const sampleAppointments: Appointment[] = [
  {
    id: "1",
    patient: {
      id: "p1",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "+1234567890",
      age: 32,
      gender: "female",
    },
    service: {
      id: "s1",
      name: "General Consultation",
      category: "Primary Care",
      duration: 30,
      price: { min: 80, max: 120 },
    },
    date: new Date(2025, 10, 6),
    startTime: "09:00",
    endTime: "09:30",
    status: "confirmed",
    notes: "Follow-up for blood pressure",
    createdAt: new Date(2025, 10, 1),
    updatedAt: new Date(2025, 10, 1),
  },
  {
    id: "2",
    patient: {
      id: "p2",
      name: "Michael Chen",
      email: "michael@email.com",
      phone: "+1234567891",
      age: 45,
      gender: "male",
    },
    service: {
      id: "s2",
      name: "Health Checkup",
      category: "Preventive Care",
      duration: 60,
      price: { min: 150, max: 200 },
    },
    date: new Date(2025, 10, 6),
    startTime: "10:00",
    endTime: "11:00",
    status: "pending",
    createdAt: new Date(2025, 10, 2),
    updatedAt: new Date(2025, 10, 2),
  },
  {
    id: "3",
    patient: {
      id: "p3",
      name: "Emily Davis",
      email: "emily@email.com",
      phone: "+1234567892",
      age: 28,
      gender: "female",
    },
    service: {
      id: "s3",
      name: "Follow-up Visit",
      category: "Follow-up",
      duration: 20,
      price: { min: 60, max: 80 },
    },
    date: new Date(2025, 10, 7),
    startTime: "14:30",
    endTime: "14:50",
    status: "confirmed",
    notes: "Post-surgery check",
    createdAt: new Date(2025, 10, 3),
    updatedAt: new Date(2025, 10, 3),
  },
  {
    id: "4",
    patient: {
      id: "p4",
      name: "Robert Wilson",
      email: "robert@email.com",
      phone: "+1234567893",
      age: 55,
      gender: "male",
    },
    service: {
      id: "s1",
      name: "General Consultation",
      category: "Primary Care",
      duration: 30,
      price: { min: 80, max: 120 },
    },
    date: new Date(2025, 10, 8),
    startTime: "11:00",
    endTime: "11:30",
    status: "completed",
    createdAt: new Date(2025, 10, 4),
    updatedAt: new Date(2025, 10, 8),
  },
  {
    id: "5",
    patient: {
      id: "p5",
      name: "Lisa Anderson",
      email: "lisa@email.com",
      phone: "+1234567894",
      age: 38,
      gender: "female",
    },
    service: {
      id: "s4",
      name: "Specialist Consultation",
      category: "Specialty Care",
      duration: 45,
      price: { min: 200, max: 300 },
    },
    date: new Date(2025, 10, 9),
    startTime: "15:00",
    endTime: "15:45",
    status: "cancelled",
    notes: "Patient requested cancellation",
    createdAt: new Date(2025, 10, 5),
    updatedAt: new Date(2025, 10, 6),
  },
];

export default function AppointmentsPage() {
  const [activeSection, setActiveSection] = useState<"calendar" | "appointments">("calendar");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "today" | "upcoming" | "history" | "cancelled"
  >("all");

  const filteredAppointments = sampleAppointments.filter((appointment) => {
    const today = new Date();
    const appointmentDate = appointment.date;

    switch (selectedFilter) {
      case "today":
        return appointmentDate.toDateString() === today.toDateString();
      case "upcoming":
        return appointmentDate > today && appointment.status !== "cancelled";
      case "history":
        return appointmentDate < today || appointment.status === "completed";
      case "cancelled":
        return appointment.status === "cancelled";
      default:
        return true;
    }
  });

  // Calculate appointment counts for navigation
  const appointmentCounts = {
    all: sampleAppointments.length,
    today: sampleAppointments.filter(apt => 
      apt.date.toDateString() === new Date().toDateString()
    ).length,
    upcoming: sampleAppointments.filter(apt => 
      apt.date > new Date() && apt.status !== "cancelled"
    ).length,
    history: sampleAppointments.filter(apt => 
      apt.date < new Date() || apt.status === "completed"
    ).length,
    cancelled: sampleAppointments.filter(apt => 
      apt.status === "cancelled"
    ).length
  };

  return (
    <ProviderLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <AppointmentsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {activeSection === "calendar" ? (
            <CalendarSection
              events={sampleEvents}
              appointments={sampleAppointments}
            />
          ) : (
            <AppointmentsSection
              appointments={filteredAppointments}
              filter={selectedFilter}
              onFilterChange={setSelectedFilter}
              appointmentCounts={appointmentCounts}
            />
          )}
        </main>
      </div>
    </ProviderLayout>
  );
}
