export interface StoreProduct {
    id: number;
    slug: string;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
}

export interface SocialMediaItem {
    enabled: boolean;
    url: string;
}

export interface BusinessHour {
    isOpen: boolean;
    open: string;
    close: string;
}

export interface Store {
    id: number;
    sellerName: string;
    sellerLastName?: string | null;

    storeName?: string | null;
    description?: string | null;

    image?: string | null;
    storeLogo?: string | null;
    storeCover?: string | null;

    since: string;

    productCount: number;

    phone?: string | null;
    email?: string | null;
    address?: string | null;
    website?: string | null;

    socialMedia?: {
        facebook?: SocialMediaItem;
        instagram?: SocialMediaItem;
        tiktok?: SocialMediaItem;
        whatsapp?: SocialMediaItem;
    };

    businessHours?: Record<string, BusinessHour>;

    products: StoreProduct[];
}
