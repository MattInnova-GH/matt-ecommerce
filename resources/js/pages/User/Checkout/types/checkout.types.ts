export type DeliveryMethod = 'delivery' | 'pickup';

export type PaymentMethod = 'card' | 'yape' | 'cash';

export interface DeliveryAddress {
    lat: number;
    lng: number;
    address: string;
    reference?: string;
    phone: string;
    recipientName: string;
}

export interface SelectedStore {
    id: number;
    name: string;
    address: string;
}

export interface CheckoutItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    image: string;
    category?: string;
}

export interface OrderTotals {
    subtotal: number;
    deliveryCost: number;
    total: number;
}
