import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';
import HeroSection from '@/Components/User/Home/HeroSection';
import BenefitsBar from '@/Components/User/Home/BenefitsBar';
import CategoriesSection from '@/Components/User/Home/CategoriesSection';
import FeaturedProducts from '@/Components/User/Home/FeaturedProducts';
import NewsletterSection from '@/Components/User/Home/NewsletterSection';

interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount?: number;
}

interface HomeProps {
    products: Product[];
    categories: Category[];
}

export default function Home({ products = [], categories = [] }: HomeProps) {
    return (
        <UserLayout>
            <Head title="Inicio | Matt - Moda y Tecnología" />

            <HeroSection />
            <BenefitsBar />
            <CategoriesSection categories={categories} />
            <FeaturedProducts products={products} />
            <NewsletterSection />
        </UserLayout>
    );
}
