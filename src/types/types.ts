export interface UserRole {
  role: "user" | "provider" | "admin" | null;
}

export interface UserProps {
  id: number;
  name: string;
  image: string | null;
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
  operating_hours: {
    id: number;
    provider_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    is_closed: boolean;
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

export interface DocumentProps {
  documents: {
    file_path: string;
    status: "pending" | "approved" | "rejected";
    document_type: string;
    remarks: string | null;
  }[];
}

export interface AppointmentProps {
  id: number;
  appointment_number: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  total_price: number;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  provider: {
    id: number;
    name: string;
    email: string;
    cover_photo?: string;
  };
  services: {
    id: number;
    name: string;
    description: string;
    price_min: number;
    price_max: number;
    pivot: {
      price_at_booking: number;
    };
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links: { [key: string]: string | null };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
