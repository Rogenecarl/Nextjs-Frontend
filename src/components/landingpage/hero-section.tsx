"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MapPin } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative z-10 pt-20 pb-16 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Find Healthcare
          <span className="block text-indigo-600">Near You</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect with trusted healthcare providers in your area. Book appointments, 
          read reviews, and get the care you deserve.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/healthcare">
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Search className="mr-2 h-5 w-5" />
              Find Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/map">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
            >
              <MapPin className="mr-2 h-5 w-5" />
              View Map
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">1000+ Verified Providers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium">50,000+ Happy Patients</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="font-medium">24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}