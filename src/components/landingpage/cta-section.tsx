"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
            Join thousands of patients who trust our platform for their healthcare needs. 
            Start your journey to better health today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/role">
              <Button 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up as Patient
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/auth/role">
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                Join as Provider
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}