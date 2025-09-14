export interface UserRole {
    id: number;
    role: 'user' | 'provider' | 'admin' | null;
}

export interface ProviderProps {
    id: number;
    user_id: number;
    category_id: number;
    verified_by: number | null;
    healthcare_name: string;
    description: string;
    phone_number: string;
    cover_photo: string;
    email: string;
    status: string;
    address: string;
    city: string;
    province: string;
    latitude: string;
    longitude: string;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
    services: {
        id: number;
        provider_id: number;
        name: string;
        description: string;
        price_min: number;
        price_max: number;
    }[];
}