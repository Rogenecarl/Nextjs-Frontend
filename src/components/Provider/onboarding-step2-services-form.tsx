"use client";

import React, { useState, useEffect, use } from "react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Plus,
    Stethoscope,
} from 'lucide-react';

import { OnboardingCreateProviderProfileFormSchema } from "@/components/Provider/features/onboarding/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { useOnboardingCreateProviderProfileStore } from "@/store/create-provider-profile-store";
import Link from "next/link";

const onboardingServicesFormSchema = OnboardingCreateProviderProfileFormSchema.pick({
    services: true,
    operating_hours: true,
});

type OnboardingServicesFormType = z.infer<typeof onboardingServicesFormSchema>;
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function getDayName(index: number) {
    return dayNames[index] || "";
}

// Convert time from 24-hour format to 12-hour format for display
function formatTo12Hour(time24: string | null | undefined): string {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    const hoursNum = parseInt(hours, 10);
    const ampm = hoursNum >= 12 ? 'PM' : 'AM';
    const hours12 = hoursNum % 12 || 12;
    return `${hours12}:${minutes} ${ampm}`;
}

// Convert time from HTML time input to backend format (H:i)
function formatToBackend(timeStr: string): string {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
}

export default function OnboardingStep2ServicesForm() {

    const router = useRouter();

    const { setData, ...storedData } = useOnboardingCreateProviderProfileStore((state) => state);

    const healthcare_name = useOnboardingCreateProviderProfileStore((state) => state.healthcare_name);
    const category_id = useOnboardingCreateProviderProfileStore((state) => state.category_id);
    const description = useOnboardingCreateProviderProfileStore((state) => state.description);
    const email = useOnboardingCreateProviderProfileStore((state) => state.email);
    const phone = useOnboardingCreateProviderProfileStore((state) => state.phone_number);

    // React Hook Form setup
    const form = useForm<OnboardingServicesFormType>({
        resolver: zodResolver(onboardingServicesFormSchema),
        defaultValues: {
            services: [],
            operating_hours: Array.from({ length: 7 }, (_, i) => {
                // Monday (1) to Friday (5)
                const isWeekday = i >= 1 && i <= 5;
                return {
                    day_of_week: i,
                    start_time: isWeekday ? "07:00" : null,
                    end_time: isWeekday ? "17:00" : null,
                    is_closed: !isWeekday, // true for weekends (i=0 or i=6), false for weekdays
                };
            }),
        },
        mode: "onChange",
    });
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors, isValid },
    } = form;

    useEffect(() => {
        // Check if data has been loaded from the store
        if (storedData.services) {
            reset({
                services: storedData.services || [],
                operating_hours: storedData.operating_hours || Array.from({ length: 7 }, (_, i) => {
                    const isWeekday = i >= 1 && i <= 5;
                    return {
                        day_of_week: i,
                        start_time: isWeekday ? "07:00" : null,
                        end_time: isWeekday ? "17:00" : null,
                        is_closed: !isWeekday,
                    };
                }),
            });
        }
    }, [
        storedData.services,
        storedData.operating_hours,
        reset
    ]);

    // UseFieldArray for services to manage dynamic list
    const { fields: services, append, remove, update } = useFieldArray({
        control,
        name: "services",
    });
    // Watch operating_hours for UI updates
    const operatingHours = watch("operating_hours") || [];
    // State for dialog modal
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
    // Local state for service form inside dialog
    const [serviceForm, setServiceForm] = useState({
        name: "",
        description: "",
        price_min: "",
        price_max: "",
    });

    // Open dialog for adding new service
    function openAddServiceDialog() {
        setEditingServiceIndex(null);
        setServiceForm({
            name: "",
            description: "",
            price_min: "",
            price_max: "",
        });
        setIsDialogOpen(true);
    }
    // Open dialog for editing existing service
    function handleEditService(index: number) {
        const service = services[index];
        setEditingServiceIndex(index);
        setServiceForm({
            name: service.name,
            description: service.description || "",
            price_min: service.price_min.toString(),
            price_max: service.price_max.toString(),
        });
        setIsDialogOpen(true);
    }

    // Delete service by index
    function handleDeleteService(index: number) {
        remove(index);
    }
    // Handle input changes in dialog form
    function handleServiceFormChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setServiceForm((prev) => ({ ...prev, [name]: value }));
    }
    // Service management functions
    function validateAndSubmitService(e: React.FormEvent) {
        e.preventDefault(); // Prevent form submission
        // Validate service form fields
        if (!serviceForm.name.trim()) {
            alert("Service name is required");
            return;
        }
        const priceMin = parseInt(serviceForm.price_min, 10);
        const priceMax = parseInt(serviceForm.price_max, 10);
        if (isNaN(priceMin) || priceMin < 0) {
            alert("Minimum price must be a non-negative number");
            return;
        }

        if (isNaN(priceMax) || priceMax < 0) {
            alert("Maximum price must be a non-negative number");
            return;
        }
        if (priceMax < priceMin) {
            alert("Maximum price must be greater than or equal to minimum price");
            return;
        }
        const newService = {
            name: serviceForm.name.trim(),
            description: serviceForm.description.trim() || null,
            price_min: priceMin,
            price_max: priceMax,
            is_active: true,
            sort_order: 0,
        };
        if (editingServiceIndex !== null) {
            update(editingServiceIndex, newService);
        } else {
            append(newService);
        }
        setIsDialogOpen(false);
    }

    // Service action handlers
    function handleAddService(e: React.MouseEvent) {
        e.preventDefault();
        openAddServiceDialog();
    }

    function handleEditServiceClick(e: React.MouseEvent, index: number) {
        e.preventDefault();
        handleEditService(index);
    }

    function handleDeleteServiceClick(e: React.MouseEvent, index: number) {
        e.preventDefault();
        handleDeleteService(index);
    }

    // Handle operating hours change
    function handleOperatingHoursChange(
        index: number,
        field: "is_closed" | "start_time" | "end_time",
        value: boolean | string
    ) {
        const updated = [...operatingHours];
        if (field === "is_closed") {
            updated[index].is_closed = value as boolean;
            if (value === true) {
                updated[index].start_time = null;
                updated[index].end_time = null;
            }
        } else if (field === "start_time") {
            updated[index].start_time = value as string;
        } else if (field === "end_time") {
            updated[index].end_time = value as string;
        }
        setValue("operating_hours", updated, { shouldValidate: true, shouldDirty: true });
    }
    // Check if at least one day is open
    const isAnyDayOpen = operatingHours.some((day) => !day.is_closed);

    // Check if there are any operating hours validation errors
    const hasOperatingHoursError = operatingHours.some(
        (day) => !day.is_closed && day.start_time && day.end_time && day.end_time <= day.start_time
    );

    // Back button handler (implement as needed)
    function onBack() {
        // e.g. navigate to previous step
        console.log("Back clicked");
    }
    // Submit handler
    const onSubmit = (data: OnboardingServicesFormType) => {
        setData(data);
        console.log("Form Data:", data);
        router.push('/provider/onboarding/document');

        // Proceed to next step or API call
    };

    useEffect(() => {
        if (!useOnboardingCreateProviderProfileStore.persist.hasHydrated()) return;
        if (!healthcare_name || !category_id || !description || !email || !phone) {
            router.push('/provider/onboarding/info');
        }
    }, [healthcare_name, category_id, description, email, phone, router]);

    return (
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mx-auto">
                    <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold">Services & Schedules</h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    List your healthcare services and set your provider operating hours
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Services Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-purple-600" />
                                    <h2 className="text-lg font-semibold">Healthcare Services</h2>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700"
                                    onClick={handleAddService}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Add Service
                                </Button>
                            </div>
                            <p className="mb-6 text-sm text-gray-500">
                                Add all healthcare services you offer with descriptions and pricing
                            </p>
                            {services.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-8 text-center">
                                    <div className="mb-4 flex justify-center">
                                        <Stethoscope className="h-12 w-12 text-gray-300" />
                                    </div>
                                    <p className="mb-2 text-gray-500">No services added yet</p>
                                    <p className="text-sm text-gray-400">
                                        Click the button above to add your first service
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {services.map((service, index) => (
                                        <div key={service.id ?? index} className="rounded-lg border p-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                                                <div>
                                                    <h3 className="font-medium">{service.name}</h3>
                                                    <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        ₱{service.price_min} - ₱{service.price_max}
                                                    </p>
                                                    <div className="mt-2 flex gap-2 justify-end">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 px-2 text-xs"
                                                            onClick={(e) => handleEditServiceClick(e, index)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-7 px-2 text-xs"
                                                            onClick={(e) => handleDeleteServiceClick(e, index)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {services.length === 0 && (
                                <Alert variant="destructive" className="mt-4 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>You must add at least one service to continue</AlertDescription>
                                </Alert>
                            )}
                            {/* Service Add/Edit Dialog */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingServiceIndex !== null ? "Edit Service" : "Add New Service"}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <Label htmlFor="service-name">
                                                Service Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="service-name"
                                                name="name"
                                                value={serviceForm.name}
                                                onChange={handleServiceFormChange}
                                                placeholder="e.g., General Consultation"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="service-description">Description</Label>
                                            <Textarea
                                                id="service-description"
                                                name="description"
                                                value={serviceForm.description}
                                                onChange={handleServiceFormChange}
                                                placeholder="Describe the service you offer"
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <Label>
                                                Price Range (₱) <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="price_min" className="text-xs text-gray-500">
                                                        Minimum
                                                    </Label>
                                                    <Input
                                                        id="price_min"
                                                        name="price_min"
                                                        type="number"
                                                        min={0}
                                                        step={1}
                                                        placeholder="0"
                                                        value={serviceForm.price_min}
                                                        onChange={handleServiceFormChange}
                                                    />
                                                </div>
                                                <span className="mt-6 text-gray-500">to</span>
                                                <div className="flex-1">
                                                    <Label htmlFor="price_max" className="text-xs text-gray-500">
                                                        Maximum
                                                    </Label>
                                                    <Input
                                                        id="price_max"
                                                        name="price_max"
                                                        type="number"
                                                        min={0}
                                                        step={1}
                                                        placeholder="0"
                                                        value={serviceForm.price_max}
                                                        onChange={handleServiceFormChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsDialogOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="button" onClick={validateAndSubmitService}>
                                                {editingServiceIndex !== null ? "Update Service" : "Add Service"}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    {/* Operating Hours Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold">Operating Hours</h2>
                            </div>
                            <p className="mb-6 text-sm text-gray-500">
                                Set your provider operating hours for each day of the week
                            </p>
                            <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    At least one day must be open with operating hours
                                </AlertDescription>
                            </Alert>
                            <div className="space-y-4">
                                {operatingHours.map((day, i) => (
                                    <div
                                        key={day.day_of_week}
                                        className="flex flex-col sm:flex-row items-center justify-between gap-2"
                                    >
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <Switch
                                                checked={!day.is_closed}
                                                onCheckedChange={(checked) =>
                                                    handleOperatingHoursChange(i, "is_closed", !checked)
                                                }
                                            />
                                            <span className="font-medium">{getDayName(day.day_of_week)}</span>
                                        </div>
                                        {!day.is_closed ? (
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <div className="relative">
                                                    <Input
                                                        type="time"
                                                        className={`w-32 ${!day.is_closed && day.start_time && day.end_time && day.end_time <= day.start_time ? 'border-red-500' : ''}`}
                                                        value={day.start_time || ""}
                                                        onChange={(e) =>
                                                            handleOperatingHoursChange(i, "start_time", formatToBackend(e.target.value))
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <span className="text-gray-500">to</span>
                                                <div className="relative">
                                                    <Input
                                                        type="time"
                                                        className={`w-32 ${!day.is_closed && day.start_time && day.end_time && day.end_time <= day.start_time ? 'border-red-500' : ''}`}
                                                        value={day.end_time || ""}
                                                        onChange={(e) =>
                                                            handleOperatingHoursChange(i, "end_time", formatToBackend(e.target.value))
                                                        }
                                                        required
                                                    />

                                                    {!day.is_closed && day.start_time && day.end_time && day.end_time <= day.start_time && (
                                                        <div className="absolute -bottom-5 left-0 w-64 text-xs text-red-500">
                                                            End time must be after {formatTo12Hour(day.start_time)}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                                                    Open
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 w-full sm:w-auto text-center sm:text-left">
                                                Closed
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.operating_hours && (
                                <p className="mt-2 text-red-600 text-sm">{errors.operating_hours.message}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                    <Link href="/provider/onboarding/info" className="flex items-center justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="flex items-center justify-center"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                        disabled={services.length === 0 || !isAnyDayOpen || !isValid || hasOperatingHoursError}
                    >
                        {hasOperatingHoursError ? (
                            <div className="flex flex-col items-center">
                                <span>Fix Operating Hours Errors</span>
                                <span className="text-xs">Check end times are after start times</span>
                            </div>
                        ) : (
                            <>
                                Next: Documents
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}