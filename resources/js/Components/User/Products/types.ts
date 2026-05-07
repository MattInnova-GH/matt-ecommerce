export interface ProductVariant {
    type: string;
    value: string;
}

export interface PublicProduct {
    id: number;
    slug: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    imageUrl?: string;
    colors?: string[];
    sizes?: string[];
    variants?: ProductVariant[];
}

export interface Category {
    id: string | number;
    name: string;
    productCount: number;
}
