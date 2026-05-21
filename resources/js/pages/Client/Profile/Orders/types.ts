export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

export interface OrderItem {
    id: number;
    product_name: string;
    product_thumbnail: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface Order {
    id: number;
    order_number: string;
    status: OrderStatus;
    total: number;
    subtotal: number;
    shipping_cost: number;
    payment_method: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    shipping_address: {
        full_name: string;
        address: string;
        city: string;
        district: string;
        country: string;
        postal_code?: string;
        reference?: string;
    };
    tracking_code?: string;
}
