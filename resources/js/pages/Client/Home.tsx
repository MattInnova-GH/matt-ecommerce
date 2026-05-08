import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';

import HeroSection from '@/Components/User/Home/HeroSection';
import BenefitsBar from '@/Components/User/Home/BenefitsBar';
import CategoriesSection from '@/Components/User/Home/CategoriesSection';
import FeaturedProducts from '@/Components/User/Home/FeaturedProducts';
import PromotionalBanners from '@/Components/User/Home/PromotionalBanners';
import TestimonialsSection from '@/Components/User/Home/TestimonialsSection';
import NewsletterSection from '@/Components/User/Home/NewsletterSection';

type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
};

type Banner = {
    id: number;
    title: string;
    imageUrl: string;
    link?: string;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount: number;
};

type Props = {
    products: Product[];
    categories: Category[];
    banners: Banner[]; // ← faltaba
};

export default function Home({
    products = [],
    categories = [],
    banners = [],
}: Props) {
    return (
        <div>
            <Head title="Inicio" />

            <HeroSection banners={banners} />
            <BenefitsBar />

            <CategoriesSection categories={categories} />

            <FeaturedProducts products={products} />

            <PromotionalBanners />

            <NewsletterSection />

            <TestimonialsSection />
        </div>
    );
}
