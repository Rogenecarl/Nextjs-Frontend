"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce-hook";
import { getSearchSuggestions } from "@/services/providerService";
import { ProviderProps } from "@/types/types";
import { Building, Stethoscope, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialSearchTerm?: string;
}

export default function SearchBarWithSuggestions({
  onSearch,
  initialSearchTerm = "",
}: SearchBarProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [isOpen, setIsOpen] = useState(false);

  // Update input value when initialSearchTerm changes (from URL params)
  useEffect(() => {
    setInputValue(initialSearchTerm);
  }, [initialSearchTerm]);

  const debouncedSearchTerm = useDebounce(inputValue, 300);

  const { data: suggestions = [], isLoading } = useQuery<ProviderProps[]>({
    queryKey: ["getSearchSuggestions", debouncedSearchTerm],
    queryFn: () => getSearchSuggestions(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
  });

  const handleSelectSuggestion = (providerId: number) => {
    router.push(`/providers/${providerId}`);
    setIsOpen(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsOpen(!!value);
    // If the input is cleared (empty), trigger the search
    if (!value.trim()) {
      onSearch("");
    }
  };

  return (
    <div className="relative">
      <Command
        className="overflow-visible rounded-lg border"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search services, providers, or locations..."
          value={inputValue}
          onValueChange={handleInputChange}
          onFocus={() => setIsOpen(!!inputValue)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="h-12 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (inputValue.trim()) {
                onSearch(inputValue.trim());
                setIsOpen(false);
              }
            }
          }}
        />

        {isOpen && (
          <CommandList className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg z-50 border">
            {isLoading && (
              <CommandEmpty>
                <div className="p-4 text-sm text-muted-foreground">
                  Loading suggestions...
                </div>
              </CommandEmpty>
            )}

            {!isLoading && suggestions.length === 0 && debouncedSearchTerm && (
              <CommandEmpty>
                <div className="p-4 text-sm">
                  No results found for "{debouncedSearchTerm}".
                </div>
              </CommandEmpty>
            )}

            {!isLoading &&
              suggestions.map((provider) => {
                const matchedService =
                  provider.services && provider.services[0];
                const itemValue = `${provider.healthcare_name} ${
                  matchedService ? matchedService.name : provider.address
                }`;

                return (
                  <CommandItem
                    key={provider.id}
                    value={itemValue}
                    onSelect={() => handleSelectSuggestion(provider.id)}
                    className="flex items-start gap-4 p-3 cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {matchedService ? (
                        <Stethoscope className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Building className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="font-medium truncate">
                        {provider.healthcare_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {matchedService ? (
                          <span className="text-blue-600 font-medium">
                            Offers: {matchedService.name}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {provider.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
