"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Award, Building2, Calendar, CheckCircle, Clock, Star, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function WelcomeDashboard() {
    const [isHovered, setIsHovered] = useState(false);

    const steps = [
        {
            step: '01',
            title: 'Create Profile',
            description: 'Add your practice details, specialties, and credentials',
            icon: Building2,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            step: '02',
            title: 'Set Availability',
            description: 'Configure your schedule and appointment preferences',
            icon: Calendar,
            color: 'from-purple-500 to-pink-500',
        },
        {
            step: '03',
            title: 'Start Connecting',
            description: 'Begin receiving bookings from patients in your area',
            icon: Users,
            color: 'from-green-500 to-emerald-500',
        },
    ];
    return (
        <div className="flex w-full flex-col items-center">
            {/* Header */}
            <div className="mb-10 max-w-3xl text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                    <UserPlus className="h-8 w-8 text-white" />
                </div>

                <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Complete Your Provider Profile
                    </span>
                </h1>

                <p className="mb-6 text-lg leading-relaxed text-gray-600">
                    Set up your healthcare provider profile to connect with patients, manage appointments, and grow your practice.
                </p>

                <div className="mb-8 flex flex-wrap justify-center gap-3">
                    <Badge className="bg-green-100 px-3 py-1.5 text-green-700 hover:bg-green-100">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Free to Join
                    </Badge>
                    <Badge className="bg-blue-100 px-3 py-1.5 text-blue-700 hover:bg-blue-100">
                        <Clock className="mr-2 h-4 w-4" />5 Min Setup
                    </Badge>
                    <Badge className="bg-purple-100 px-3 py-1.5 text-purple-700 hover:bg-purple-100">
                        <Award className="mr-2 h-4 w-4" />
                        Verified Profiles
                    </Badge>
                </div>

                {/* CTA Button */}
                <Link href="/provider/onboarding/info" className="inline-block">
                    <Button
                        size="lg"
                        className="transform rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-6 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Provider Profile
                        <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </Button>
                </Link>
            </div>

            {/* Process Steps */}
            <div className="mb-10 w-full max-w-4xl">
                <h2 className="mb-6 text-center text-xl font-semibold">
                    Get Started in <span className="text-blue-600">3 Simple Steps</span>
                </h2>

                <div className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <Card className="h-full bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="relative mb-4">
                                        <div
                                            className={`h-12 w-12 bg-gradient-to-r ${step.color} mx-auto flex items-center justify-center rounded-xl`}
                                        >
                                            <step.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold text-white">
                                            {step.step}
                                        </div>
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                                    <p className="text-sm text-gray-600">{step.description}</p>
                                </CardContent>
                            </Card>
                            {index < 2 && (
                                <div className="absolute top-1/2 -right-3 z-10 hidden -translate-y-1/2 transform md:block">
                                    <ArrowRight className="h-6 w-6 text-gray-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits */}
            <div className="w-full max-w-4xl">
                <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                <Star className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold">Why Join Our Healthcare Network?</h3>
                        </div>

                        <ul className="space-y-3 pl-14">
                            <li className="flex items-start">
                                <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                <span>Connect with thousands of patients looking for quality healthcare</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                <span>Streamlined booking system with automated scheduling</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                <span>Build your reputation with verified reviews and ratings</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                                <span>Manage your practice with powerful analytics and insights</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
