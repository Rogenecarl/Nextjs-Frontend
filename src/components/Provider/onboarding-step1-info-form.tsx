"use client";
import { set, z } from "zod";
import { OnboardingCreateProviderProfileFormSchema } from "./features/onboarding/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import { CategoryProps } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useOnboardingCreateProviderProfileStore } from "@/store/create-provider-profile-store";
import { use, useEffect } from "react";

interface HealthcareViewProps {
    categories: CategoryProps[];
}
const onboardingInfoFormSchema = OnboardingCreateProviderProfileFormSchema.pick({
    healthcare_name: true,
    category_id: true,
    description: true,
    email: true,
    phone_number: true,
});
type OnboardingInfoFormType = z.infer<typeof onboardingInfoFormSchema>;
export default function OnboardingInfoForm({ categories }: HealthcareViewProps) {

    const router = useRouter();
    const { setData, ...storedData } = useOnboardingCreateProviderProfileStore((state) => state);

    const form = useForm<OnboardingInfoFormType>({
        resolver: zodResolver(onboardingInfoFormSchema),
        defaultValues: {
            healthcare_name: "",
            category_id: 0,
            description: "",
            email: "",
            phone_number: "",
        },
    });
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = form;


    // THE FIX IS HERE
    useEffect(() => {
        // Only reset the form if we have BOTH the stored data AND the categories list is ready.
        if (storedData.category_id && categories.length > 0) {
            reset({
                healthcare_name: storedData.healthcare_name || "",
                category_id: storedData.category_id || 0,
                description: storedData.description || "",
                email: storedData.email || "",
                phone_number: storedData.phone_number || "",
            });
        }
    }, [
        // Add `categories` to the dependency array.
        // This ensures the effect re-runs when the categories prop arrives.
        storedData.healthcare_name,
        storedData.category_id,
        storedData.description,
        storedData.email,
        storedData.phone_number, ,
        categories,
        reset
    ]);

    const selectedCategoryId = watch("category_id")?.toString() || "0";
    const onSubmit = (data: OnboardingInfoFormType) => {
        setData(data);
        console.log("Form Data:", data);
        router.push('/provider/onboarding/services');
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto">
                    <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Business Information</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                    Provide details about your healthcare business for registration
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {/* Provider Details Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <h2 className="text-lg font-semibold">Provider Details</h2>
                            </div>
                            <p className="mb-6 text-sm text-gray-500">
                                Provide information about your healthcare provider for your profile
                            </p>
                            <div className="space-y-4">
                                {/* Provider Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="healthcare_name">
                                        Provider Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="healthcare_name"
                                        {...register("healthcare_name")}
                                        placeholder="Enter your provider name"
                                        className="w-full"
                                    />
                                    {errors.healthcare_name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.healthcare_name.message}</p>
                                    )}
                                </div>
                                {/* Category Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">
                                        Category Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedCategoryId}
                                        onValueChange={(value) => setValue("category_id", parseInt(value))}
                                    >
                                        <SelectTrigger className="w-full" aria-label="Select provider type">
                                            <SelectValue placeholder="Select provider type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0" disabled>
                                                Select provider type
                                            </SelectItem>
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            {category.icon && (
                                                                <span
                                                                    className="flex h-4 w-4 items-center justify-center"
                                                                    style={{ color: category.color }}
                                                                >
                                                                    {category.icon}
                                                                </span>
                                                            )}
                                                            {category.name}
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="space-y-2 p-2">
                                                    <Skeleton className="h-5 w-full rounded-sm" />
                                                    <Skeleton className="h-5 w-full rounded-sm" />
                                                    <Skeleton className="h-5 w-full rounded-sm" />
                                                    <Skeleton className="h-5 w-full rounded-sm" />
                                                    <Skeleton className="h-5 w-full rounded-sm" />
                                                </div>
                                            )}

                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.category_id.message}</p>
                                    )}
                                </div>
                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        {...register("description")}
                                        className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                        placeholder="Describe your healthcare practice (services offered, specialties, etc.)"
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Location Information Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-green-600" />
                                <h2 className="text-lg font-semibold">Location Information</h2>
                            </div>
                            <p className="mb-6 text-sm text-gray-500">
                                Your business location will be displayed to patients searching for healthcare services
                            </p>
                            <div className="space-y-4">

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex w-full">
                                        <div className="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="provider@example.com"
                                            className="rounded-l-none w-full"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">
                                        Phone <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex w-full">
                                        <div className="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <Input
                                            id="phone_number"
                                            {...register("phone_number")}
                                            placeholder="+63 912 345 6789"
                                            className="rounded-l-none w-full"
                                        />
                                    </div>
                                    {errors.phone_number && (
                                        <p className="text-red-600 text-sm mt-1">{errors.phone_number.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center">
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
