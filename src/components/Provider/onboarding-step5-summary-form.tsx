"use client";

import { OnboardingCreateProviderProfileFormSchema } from "./features/onboarding/schema";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useOnboardingCreateProviderProfileStore } from "@/store/create-provider-profile-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight, Image, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useCreateProviderProfile } from "@/hooks/useProviderMutation";

const onboardingInfoFormSchema = OnboardingCreateProviderProfileFormSchema.pick({
    cover_photo: true,
});

type OnboardingInfoFormType = z.infer<typeof onboardingInfoFormSchema>;

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default function OnboardingSummaryForm() {
    const router = useRouter();

    const allStoredData = useOnboardingCreateProviderProfileStore((state) => state);
    const { setData, ...providerData } = allStoredData;

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const createProviderMutation = useCreateProviderProfile();

    const form = useForm<OnboardingInfoFormType>({
        resolver: zodResolver(onboardingInfoFormSchema),
        defaultValues: {
            cover_photo: null,
        },
    });
    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = form;

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Verify that the file is an image
        if (!file.type.startsWith('image/')) {
            form.setError('cover_photo', {
                type: 'manual',
                message: 'Only image files are accepted. Please select a valid image file.'
            });
            return;
        }

        setSelectedFile(file);
        setValue('cover_photo', file);
        form.clearErrors('cover_photo');

        // Create preview for images
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setValue('cover_photo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: OnboardingInfoFormType) => {
        const formData = new FormData();

        // Append the simple key-value pairs from your store
        formData.append('healthcare_name', providerData.healthcare_name || '');
        formData.append('category_id', providerData.category_id?.toString() || '');
        formData.append('description', providerData.description || '');
        formData.append('email', providerData.email || '');
        formData.append('phone_number', providerData.phone_number || '');
        formData.append('longitude', providerData.longitude?.toString() || '');
        formData.append('latitude', providerData.latitude?.toString() || '');
        formData.append('address', providerData.address || '');
        formData.append('city', providerData.city || '');
        formData.append('province', providerData.province || '');

        // For arrays of objects, stringify them. The backend will need to parse them.
        formData.append('services', JSON.stringify(providerData.services || []));
        formData.append('operating_hours', JSON.stringify(providerData.operating_hours || []));

        // Handle documents - we need to append each document file separately
        if (providerData.documents && providerData.documents.length > 0) {
            // Add document metadata as JSON
            const documentsMetadata = providerData.documents.map((doc, index) => ({
                document_type: doc.document_type,
                index: index // To match files with metadata
            }));
            formData.append('documents_metadata', JSON.stringify(documentsMetadata));

            // Add each document file with indexed name
            providerData.documents.forEach((doc, index) => {
                if (doc.file_path instanceof File) {
                    formData.append(`documents[${index}][file_path]`, doc.file_path);
                    formData.append(`documents[${index}][document_type]`, doc.document_type);
                }
            });
        }

        // Append the actual cover photo file
        if (data.cover_photo) {
            formData.append('cover_photo', data.cover_photo);
        }

        // Send data to the backend using the TanStack mutation
        createProviderMutation.mutate(formData);
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Image className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Complete Your Profile</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Add a cover photo to make your profile stand out to potential clients
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                        {/* Section Header */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <Image className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Cover Photo</h2>
                                <p className="text-sm text-gray-500">Upload an image that represents your healthcare service</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Cover Photo Upload Section */}
                            <div className="space-y-4">
                                <div
                                    className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${selectedFile
                                        ? 'border-blue-300 bg-blue-50'
                                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                                        }`}
                                >
                                    {selectedFile ? (
                                        <div className="space-y-4">
                                            {/* File Preview */}
                                            {previewUrl ? (
                                                <div className="relative">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Cover photo preview"
                                                        className="mx-auto max-h-64 rounded object-contain"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                        onClick={clearSelectedFile}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Image className="mx-auto h-12 w-12 text-blue-600" />
                                                    <p className="mt-2 font-medium text-blue-700">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-sm text-blue-600">
                                                        {formatFileSize(selectedFile.size)}
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={clearSelectedFile}
                                                    >
                                                        <X className="mr-1 h-3 w-3" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm font-medium text-gray-700">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                JPG, JPEG, PNG, GIF, SVG, WEBP (MAX. 2MB)
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-3"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                Choose File
                                            </Button>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Accepted formats: JPG, JPEG, PNG, GIF, SVG, WEBP up to 2MB
                                </p>
                            </div>

                            {/* Validation Errors */}
                            {errors.cover_photo && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-700">
                                        {errors.cover_photo.message as string}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Information Alert */}
                            <Alert className="border-blue-200 bg-blue-50">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800">
                                    <strong>Tip:</strong> A high-quality cover photo helps attract more clients.
                                    Choose an image that best represents your healthcare services.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </CardContent>
                </Card>

                {/* Error Message */}
                {createProviderMutation.isError && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                            {createProviderMutation.error instanceof Error
                                ? createProviderMutation.error.message
                                : "Failed to create provider profile. Please try again."}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => router.back()}
                        disabled={createProviderMutation.isPending}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
                        disabled={createProviderMutation.isPending}
                    >
                        {createProviderMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                Complete Profile
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );

}