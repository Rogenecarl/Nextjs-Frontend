"use client";

import { Calendar, Shield, Clock, Star, MapPin, Users } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Schedule appointments with healthcare providers in just a few clicks. No more waiting on hold.",
    color: "text-blue-600"
  },
  {
    icon: Shield,
    title: "Verified Providers",
    description: "All healthcare providers are thoroughly vetted and verified for your safety and peace of mind.",
    color: "text-green-600"
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    description: "See real-time availability and book appointments that fit your schedule perfectly.",
    color: "text-purple-600"
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description: "Read authentic reviews from other patients to make informed decisions about your care.",
    color: "text-yellow-600"
  },
  {
    icon: MapPin,
    title: "Location-based Search",
    description: "Find healthcare providers near you with our advanced location-based search feature.",
    color: "text-red-600"
  },
  {
    icon: Users,
    title: "Multiple Specialties",
    description: "Access a wide range of healthcare specialties all in one convenient platform.",
    color: "text-indigo-600"
  }
];

export default function FeaturesSection() {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We've built the most comprehensive healthcare platform to make finding 
            and booking healthcare services simple, safe, and convenient.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-6`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}