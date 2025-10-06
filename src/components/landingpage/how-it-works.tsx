"use client";

import { Search, Calendar, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse through our extensive network of verified healthcare providers in your area.",
    step: "01"
  },
  {
    icon: Calendar,
    title: "Book Appointment",
    description: "Select your preferred time slot and book your appointment instantly with real-time availability.",
    step: "02"
  },
  {
    icon: CheckCircle,
    title: "Get Care",
    description: "Receive quality healthcare services from trusted professionals at your convenience.",
    step: "03"
  }
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Getting the healthcare you need has never been easier. 
            Follow these simple steps to connect with the right provider.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                {step.step}
              </div>
              
              {/* Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 pt-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-100 mb-6">
                  <step.icon className="h-10 w-10 text-indigo-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-indigo-200 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}