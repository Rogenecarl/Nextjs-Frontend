import { CategoryProps, ProviderProps } from "@/types/types";
import { Card, CardContent } from "../ui/card";
import { Calendar, Heart, MapPin, Star } from "lucide-react";
import { Button } from "../ui/button";

interface ProviderCardProps {
    provider: ProviderProps;
}

export default function ProviderCard({
    provider,

}: ProviderCardProps) {

    return (
        <Card className="group relative flex h-full cursor-pointer flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            {/* Favorite Button */}
            <CardContent className="flex h-full flex-col p-0">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                    {provider.cover_photo && (
                        <img
                            src={provider.cover_photo}
                            alt={`Cover photo of ${provider.healthcare_name}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    )}</div>

                {/* Card Content */}
                <div className="flex flex-grow flex-col p-4">
                    {/* Service Name and Rating */}
                    <div className="mb-2 flex items-start justify-between">
                        <h3 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {provider.healthcare_name}
                        </h3>
                        <div className="ml-2 flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">1.5</span>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="mb-2 text-sm text-gray-600">
                        <span className="font-medium">
                            Category: {provider.category_id}
                        </span>
                    </div>

                    {/* Address */}
                    <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1">
                            Address: {provider.address}, {provider.city}, {provider.province}
                        </span>
                    </div>

                    {/* Services */}
                    <div className="mb-4 flex flex-wrap gap-1">
                        {provider.services.slice(0, 3).map((serviceItem, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                            >
                                <span>{serviceItem.name}</span>
                            </span>
                        ))}
                        {provider.services.length > 3 && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                +{provider.services.length - 3} more
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex gap-2">
                        <Button
                            className="flex-1 bg-blue-600 text-white transition-colors duration-200 hover:bg-blue-700"
                            size="sm"
                        >
                            <Calendar className="mr-1 h-3 w-3" />
                            Book Now
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                            size="sm"
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
