import { Head } from '@inertiajs/react';

import HeroSection from '@/Components/User/Home/HeroSection';
import BenefitsBar from '@/Components/User/Home/BenefitsBar';
import CategoriesSection from '@/Components/User/Home/CategoriesSection';
import FeaturedProducts from '@/Components/User/Home/FeaturedProducts';
import TestimonialsSection from '@/Components/User/Home/TestimonialsSection';
import NewsletterSection from '@/Components/User/Home/NewsletterSection';
import PromotionsSection from '@/Components/User/Home/PromotionsSection';

type Product = {
    id: number;
    name: string;
    price: number;
    final_price: number; // ✅ NUEVO
    has_discount: boolean; // ✅ NUEVO
    discount_badge?: string; // ✅ NUEVO
    imageUrl?: string;
    slug: string;
};

type Promotion = {
    id: number;
    name: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    discount_badge: string;
    starts_at: string;
    ends_at: string;
    category: {
        id: number;
        name: string;
        slug: string;
        imageUrl?: string | null;
    } | null;
};

type Banner = {
    id: number;
    image_path: string;
    is_active: boolean;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount: number;
};

type Review = {
    id: number;
    name: string;
    comment: string;
    rating: number;
    avatar?: string | null;
};

type Props = {
    products: Product[];
    categories: Category[];
    activePromotions: Promotion[]; // ✅ NUEVO
    banners: Banner[];
    reviews: Review[];
};

export default function Home({
    products = [],
    categories = [],
    activePromotions = [], // ✅ NUEVO
    banners = [],
    reviews = [],
}: Props) {
    return (
        <div>
            <Head title="Inicio" />

            <HeroSection banners={banners} />

            <BenefitsBar />

            <CategoriesSection categories={categories} />

            {/* ✅ Sección de promociones - Solo se muestra si hay promociones activas */}
            <PromotionsSection promotions={activePromotions} />

            <FeaturedProducts products={products} />

            <NewsletterSection />

            <TestimonialsSection reviews={reviews} />
        </div>
    );
}
