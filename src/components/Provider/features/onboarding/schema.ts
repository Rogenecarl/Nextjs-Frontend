import { z } from 'zod';

export enum DocumentType {
    TaxDocument = 'tax_document',
    BirDocument = 'bir_document',
}

export const OnboardingCreateProviderProfileFormSchema = z.object({
    healthcare_name: z.string().min(1, "Healthcare name is required").max(255),
    category_id: z.number().int().min(1, "Category is required"),
    description: z.string().min(1, "Description is required").max(1000),
    phone_number: z.string().min(1, "Phone number is required").max(20),
    email: z.string().email().min(1, "Email is required").max(255),
    status: z.enum(['verified', 'pending']),
    cover_photo: z.any().refine((file) => file?.size <= 2048 * 1024, `Max image size is 2MB.`).refine(
        (file) => ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg+xml", "image/webp"].includes(file?.type),
        "Only .jpg, .jpeg, .png, .gif, .svg and .webp formats are supported."
    ).nullable(),
    address: z.string().min(1, "Address is required").max(255),
    city: z.string().min(1, "City is required").max(100),
    province: z.string().min(1, "Province is required").max(100),
    latitude: z.number(),
    longitude: z.number(),
    services: z.array(z.object({
        name: z.string().min(1, "Service name is required").max(255),
        description: z.string().nullable(),
        price_min: z.number().int().min(0),
        price_max: z.number().int().min(0),
        is_active: z.boolean().optional(),
        sort_order: z.number().int().min(0).optional(),
    })).optional(),
    operating_hours: z.array(z.object({
        day_of_week: z.number().int().min(0).max(6),
        start_time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Start time must be in HH:mm format").nullable(),
        end_time: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "End time must be in HH:mm format").nullable(),
        is_closed: z.boolean().optional(),
    })).optional(),
    documents: z.array(z.object({
        document_type: z.nativeEnum(DocumentType),
        file_path: z.any().refine((file) => file?.size <= 2048 * 1024, `Max image size is 2MB.`).refine(
            (file) => ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg+xml", "image/webp"].includes(file?.type),
            "Only .jpg, .jpeg, .png, .gif, .svg and .webp image formats are supported."
        ),
    })).optional(),
}).refine(data => {
    if (data.services) {
        for (const service of data.services) {
            if (service.price_max < service.price_min) {
                return false;
            }
        }
    }
    return true;
}, {
    message: "Maximum price must be greater than or equal to minimum price",
    path: ["services"],
}).refine(data => {
    if (data.operating_hours) {
        for (const hours of data.operating_hours) {
            if (!hours.is_closed && hours.start_time && hours.end_time && hours.end_time <= hours.start_time) {
                return false;
            }
        }
    }
    return true;
}, {
    message: "End time must be after start time",
    path: ["operating_hours"],
});

export type OnboardingCreateProviderProfileType = z.infer<typeof OnboardingCreateProviderProfileFormSchema>;