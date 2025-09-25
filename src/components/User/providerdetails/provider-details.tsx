import { Button } from "@/components/ui/button";
import { ProviderProps } from "@/types/types";
import { Badge, Building2, Clock, Heart, Mail, MapPin, MessageCircle, Navigation, Phone, Star, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProviderDetailsContentProps {
    provider: ProviderProps;
}

export default function ProviderDetailsContent({ provider }: ProviderDetailsContentProps) {
    return (
        <div className="flex w-full flex-col gap-6">


            <div className="relative h-125 overflow-hidden rounded-lg">
                {/* Background Image */}
                {provider.cover_photo ? (
                    <img src={provider.cover_photo} alt={provider.healthcare_name} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Building2 className="h-24 w-24 text-gray-400" />
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute right-0 bottom-0 left-0 p-6">
                    <div className="flex items-end justify-between">
                        <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                                <h1 className="text-3xl font-bold text-white">{provider.healthcare_name}</h1>
                            </div>
                            <div className="mb-2 flex items-center gap-2">
                                <h1 className="text-zinc-300">{provider.address}, {provider.city}, {provider.province}</h1>
                            </div>

                            <div className="mb-2 flex items-center gap-2">
                                <div className="flex">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            key={index}
                                            className={cn(
                                                'h-5 w-5',
                                                index < Math.floor(provider.id)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-300 text-gray-300',
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-medium text-white">{provider.id}</span>
                                <span className="text-white/80">({provider.id} reviews)</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="border-white/20 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                            >
                                <Heart className='fill-red-500 text-white' />
                            </Button>

                            <Button size="lg" className="bg-blue-600 px-8 font-semibold text-white hover:bg-blue-700">
                                Book Appointment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Badges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    className="flex items-center gap-3 rounded-lg border-l-4 bg-white p-4 shadow-sm border-l-green-500"
                >
                    <div
                        className="flex h-8 w-8 items-center justify-center rounded-fullbg-green-100"
                    >
                        <Clock className="text-green-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Operating Hours</p>
                        <div className="flex items-center gap-2">
                            <span
                                className="animate-pulse bg-green-500"
                            />
                            <p className="text-sm font-semibold text-gray-900">
                                open now
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border-l-4 border-l-blue-500 bg-white p-4 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Contact Number</p>
                        <p className="text-sm font-semibold text-gray-900">{provider.phone_number}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border-l-4 border-l-purple-500 bg-white p-4 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                        <Building2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Category</p>
                        <p className="text-sm font-semibold text-gray-900">{provider.category_id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border-l-4 border-l-orange-500 bg-white p-4 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                        <Star className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Patient Reviews</p>
                        <p className="text-sm font-semibold text-gray-900">{provider.id}+ Reviews</p>
                    </div>
                </div>
            </div>


            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - Main Content */}
                <div className="space-y-4 lg:col-span-2">
                    {/* about */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                About {provider.healthcare_name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">
                                {provider.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* available services */}
                    {!provider.services || provider.services.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-blue-500" />
                                    Available Services
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex h-32 items-center justify-center text-center">
                                    <p className="text-gray-500">No services available at the moment</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-blue-500" />
                                    Available Services
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {provider.services.map((service) => (
                                        <div
                                            key={service.id}
                                            className="group rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {service.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {service.description && (
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {service.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-end gap-1 text-right">
                                                {service.price_max ? (
                                                    <span className="font-semibold text-green-600">
                                                        ₱{service.price_min} - ₱{service.price_max}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-500">
                                                        Price upon request
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-5">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-blue-500" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Address */}
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                <div>
                                    <p className="font-medium text-gray-900">Address</p>
                                    <p className="text-gray-600">{provider.address}, {provider.city}, {provider.province}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3">
                                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                                <div>
                                    <p className="font-medium text-gray-900">Phone</p>
                                    <p className="text-gray-600">{provider.phone_number}</p>
                                </div>
                            </div>

                            {/* Email */}
                            {provider.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500" />
                                    <div>
                                        <p className="font-medium text-gray-900">Email</p>
                                        <p className="text-gray-600">{provider.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>

                                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                                    <Navigation className="mr-2 h-4 w-4" />
                                    Get Directions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operating Hours */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-500" />
                                Operating Hours
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {provider.operating_hours.map((schedule, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex items-center justify-between py-2bg-blue-50 px-2 rounded-lg"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {schedule.day_of_week}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700">{provider.operating_hours[index].start_time}, {provider.operating_hours[index].end_time}</span>
                                        
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
