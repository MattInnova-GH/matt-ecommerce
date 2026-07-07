export interface Address {
    id: number;
    country: string;
    city: string;
    district: string;
    address: string;
    reference?: string;
    postal_code?: string;
    full_address: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    dni?: string;
    avatar?: string;
    is_active: boolean;
}

export interface Order {
    id: number;
    order_number: string;
    total: number;
    status:
        | 'PENDING'
        | 'ACCEPTED'
        | 'REJECTED'
        | 'SHIPPED'
        | 'DELIVERED'
        | 'CANCELLED';
    created_at: string;
    items: {
        id: number;
        product_name: string;
        quantity: number;
        product_price: number;
        subtotal: number;
        product?: {
            thumbnail: string | null;
        };
    }[];
    payment?: {
        method: string;
        status: string;
        receipt_url: string | null;
    };
}

export interface Favorite {
    id: number;
    name: string;
    slug: string;
    price: number;
    thumbnail: string | null;
    category: string;
    imageUrl: string | null;
    is_favorited: boolean;
}

export interface SettingsProps {
    user: User;
    addresses: Address[];
    orders: Order[];
    favorites: Favorite[];
    twoFactorEnabled: boolean;
    flash?: {
        success?: string;
    };
}

export type Section =
    | 'profile'
    | 'password'
    | 'security'
    | 'addresses'
    | 'orders'
    | 'favorites';

export interface PasswordStrengthProps {
    password: string;
}

export interface FlashMessageProps {
    message: string;
}

export interface InputErrorProps {
    message?: string;
}
