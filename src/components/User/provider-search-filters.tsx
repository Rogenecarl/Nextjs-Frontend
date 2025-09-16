"use client"

import { useState } from "react"
import { Search, MapPin, Star, Clock, Briefcase } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CategoryProps } from "@/types/types"

interface SearchFilters {
    availability: string
    rating: string
    distance: string
    services: string
}

export default function SearchFiltersCategory() {

    const [categories, setCategories] = useState<CategoryProps[]>([
        { id: 1, name: "Home Cleaning", slug: "cleaning", description: "", icon: "🧹", color: "blue", is_active: true, sort_order: 1, count: 5 },
    ])

    const [filters, setFilters] = useState<SearchFilters>({
        availability: "",
        rating: "",
        distance: "",
        services: "",
    })
    const [searchQuery, setSearchQuery] = useState("")

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleSearch = () => {
        console.log("Search query:", searchQuery)
        console.log("Filters:", filters)
        // Add search logic here
    }

    const clearFilters = () => {
        setFilters({
            availability: "",
            rating: "",
            distance: "",
            services: "",
        })
        setSearchQuery("")
    }

    const selectedCategory = filters?.services || null;
    return (

        <>
            <Card className="w-full max-w-6xl mx-auto p-6 bg-card border border-border">

                <div className="space-y-5">
                    <div className="flex flex-col lg:flex-row gap-2 items-end">
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search for services, healthcare providers, or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 text-base"
                            />
                        </div>

                        {/* Filters in Row */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            {/* Availability Filter */}
                            <div>
                                <Select value={filters.availability} onValueChange={(value) => handleFilterChange("availability", value)}>
                                    <SelectTrigger className="h-12">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <SelectValue placeholder="Availability" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Available Today</SelectItem>
                                        <SelectItem value="tomorrow">Available Tomorrow</SelectItem>
                                        <SelectItem value="this-week">This Week</SelectItem>
                                        <SelectItem value="next-week">Next Week</SelectItem>
                                        <SelectItem value="flexible">Flexible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Rating Filter */}
                            <div >
                                <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                                    <SelectTrigger className="h-12">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-primary" />
                                            <SelectValue placeholder="Rating" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 Stars</SelectItem>
                                        <SelectItem value="4">4+ Stars</SelectItem>
                                        <SelectItem value="3">3+ Stars</SelectItem>
                                        <SelectItem value="2">2+ Stars</SelectItem>
                                        <SelectItem value="1">1+ Stars</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Distance Filter */}
                            <div>
                                <Select value={filters.distance} onValueChange={(value) => handleFilterChange("distance", value)}>
                                    <SelectTrigger className="h-12">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <SelectValue placeholder="Distance" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Within 1 mile</SelectItem>
                                        <SelectItem value="5">Within 5 miles</SelectItem>
                                        <SelectItem value="10">Within 10 miles</SelectItem>
                                        <SelectItem value="25">Within 25 miles</SelectItem>
                                        <SelectItem value="50">Within 50 miles</SelectItem>
                                        <SelectItem value="any">Any distance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Services Filter */}
                            <div>
                                <Select value={filters.services} onValueChange={(value) => handleFilterChange("services", value)}>
                                    <SelectTrigger className="h-12">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-primary" />
                                            <SelectValue placeholder="Services" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cleaning">Home Cleaning</SelectItem>
                                        <SelectItem value="plumbing">Plumbing</SelectItem>
                                        <SelectItem value="electrical">Electrical</SelectItem>
                                        <SelectItem value="gardening">Gardening</SelectItem>
                                        <SelectItem value="painting">Painting</SelectItem>
                                        <SelectItem value="handyman">Handyman</SelectItem>
                                        <SelectItem value="tutoring">Tutoring</SelectItem>
                                        <SelectItem value="fitness">Personal Training</SelectItem>
                                        <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                                        <SelectItem value="photography">Photography</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="flex justify-center">
                    <Button variant="outline" onClick={clearFilters} className="px-6 h-10 bg-transparent">
                        Clear Filters
                    </Button>
                </div> */}

                    {/* Active Filters Display */}
                    {(filters.availability || filters.rating || filters.distance || filters.services) && (
                        <div className="pt-4 border-t border-border">
                            <div className="flex flex-wrap gap-2">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                {filters.availability && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {filters.availability}
                                    </span>
                                )}
                                {filters.rating && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {filters.rating}+ stars
                                    </span>
                                )}
                                {filters.distance && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {filters.distance} miles
                                    </span>
                                )}
                                {filters.services && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {filters.services}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </>
    )

}
