export type OrderStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export interface OrderItem {
    id: number;
    product_name: string;
    product_thumbnail: string | null;
    quantity: number;
    product_price: number;
    subtotal: number;
}

export interface ShippingAddress {
    address: string;
    district?: string;
    postalCode?: string;
    reference?: string;
    recipientName: string;
    phone: string;
}

export interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    total: number;
    subtotal: number;
    tax: number;
    rejection_reason: string | null;
    payment_method: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    shipping_address: ShippingAddress | null;
}
