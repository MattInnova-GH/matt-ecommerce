import { Head } from '@inertiajs/react';

import HeroSection from '@/Components/User/Home/HeroSection';
import BenefitsBar from '@/Components/User/Home/BenefitsBar';
import CategoriesSection from '@/Components/User/Home/CategoriesSection';
import FeaturedProducts from '@/Components/User/Home/FeaturedProducts';
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
    banners: Banner[];
    reviews: Review[];
};

export default function Home({
    products = [],
    categories = [],
    banners = [],
    reviews = [],
}: Props) {
    //console.log('REVIEWS::', reviews);
    return (
        <div>
            <Head title="Inicio" />

            <HeroSection banners={banners} />

            <BenefitsBar />

            <CategoriesSection categories={categories} />

            <FeaturedProducts products={products} />

            {/*
            <PromotionalBanners />
            */}

            <NewsletterSection />

            <TestimonialsSection reviews={reviews} />
        </div>
    );
}
