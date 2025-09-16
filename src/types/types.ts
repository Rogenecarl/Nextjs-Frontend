export interface UserRole {
    role: 'user' | 'provider' | 'admin' | null;
}

export interface UserProps {
    id: number;
    name: string;
    email: string;
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

export interface CategoryProps {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    is_active: boolean;
    sort_order: number;
    count: number | 0;
}