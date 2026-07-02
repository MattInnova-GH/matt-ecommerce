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

            {/*
            <PromotionalBanners />
            */}

            <NewsletterSection />

            {/* TEMP: mock reviews para probar animación — eliminar cuando el backend los provea */}
            <TestimonialsSection
                reviews={[
                    {
                        id: 1,
                        name: 'Ana García',
                        rating: 5,
                        comment:
                            'Excelente calidad en todos los productos. El envío fue muy rápido y el empaque impecable.',
                    },
                    {
                        id: 2,
                        name: 'Carlos Méndez',
                        rating: 4,
                        comment:
                            'Muy buena experiencia de compra. Los precios son competitivos y el servicio al cliente es de primera.',
                    },
                    {
                        id: 3,
                        name: 'María López',
                        rating: 5,
                        comment:
                            'Me encantó la variedad de productos disponibles. Sin duda volveré a comprar aquí.',
                    },
                    {
                        id: 4,
                        name: 'Luis Torres',
                        rating: 4,
                        comment:
                            'Entrega puntual y producto tal cual se muestra en la foto. Totalmente recomendado.',
                    },
                    {
                        id: 5,
                        name: 'Sofía Ramírez',
                        rating: 5,
                        comment:
                            'La mejor tienda online que he encontrado. Atención personalizada y productos de calidad.',
                    },
                ]}
            />
        </div>
    );
}
