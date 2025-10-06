"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Define the shape of a distance filter for type safety
export interface DistanceFilter {
  type: "nearest" | "radius";
  value: number; // For 'nearest', it's a limit; for 'radius', it's km
  label: string;
}

const distanceOptions: DistanceFilter[] = [
  { type: "nearest", value: 20, label: "Nearest to me" },
  { type: "radius", value: 5, label: "Within 5 km" },
  { type: "radius", value: 10, label: "Within 10 km" },
  { type: "radius", value: 15, label: "Within 15 km" },
  { type: "radius", value: 20, label: "Within 20 km" },
];

interface DistanceFeatureProps {
  // Callback function to notify the parent component of a change
  onFilterChange: (filter: DistanceFilter | null) => void;
  // Prop to disable the button while locating the user
  isLocating: boolean;
}

export default function DistanceFeature({
  onFilterChange,
  isLocating,
}: DistanceFeatureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<DistanceFilter | null>(
    null
  );

  const handleSelect = (filter: DistanceFilter | null) => {
    // If the user selects the same filter again, we treat it as a clear/reset
    const newFilter = selectedFilter?.label === filter?.label ? null : filter;
    setSelectedFilter(newFilter);
    setIsOpen(false);
    // This is the most important part: call the function from the parent
    onFilterChange(newFilter);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[180px] justify-between bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200"
          disabled={isLocating}
        >
          <LocateFixed className="mr-2 h-4 w-4" />
          {selectedFilter ? selectedFilter.label : "Filter by distance"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {distanceOptions.map((option) => (
                <CommandItem
                  key={option.label}
                  value={option.label}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedFilter?.label === option.label
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
