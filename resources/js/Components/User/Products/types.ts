export interface ProductVariant {
    type: string;
    value: string;
}

export interface PublicProduct {
    id: number;
    slug: string;
    name: string;
    description?: string;
    final_price: number; // ✅ Precio con descuento (NUEVO)
    has_discount: boolean; // ✅ Si tiene descuento (NUEVO)
    discount_badge?: string; // ✅ Texto del descuento ej: "-20%" (NUEVO)
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
    colors?: string[];
    sizes?: string[];
    variants?: ProductVariant[];
    is_favorited?: boolean;
}

export interface Category {
    id: string | number;
    name: string;
    productCount: number;
}
