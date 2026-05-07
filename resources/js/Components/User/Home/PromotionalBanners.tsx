import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function PromotionalBanners() {
    const banners = [
        {
            img: '/img/inicio/nitendo.jpg',
            title: 'Tecnología',
            href: '/productos/tecnologia',
        },
        {
            img: '/img/inicio/juegoMueble.jpg',
            title: 'Hogar',
            href: '/productos/hogar',
        },
    ];

    return (
        <section className="py-16">
            <div className="container mx-auto grid gap-6 md:grid-cols-2">
                {banners.map((b, i) => (
                    <Link
                        key={i}
                        href={b.href}
                        className="relative h-[300px] overflow-hidden rounded-xl"
                    >
                        <img
                            src={b.img}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-2xl">{b.title}</h3>
                            <ArrowRight />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
