import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

type Banner = {
    id: number;
    image_path: string;
    is_active: boolean;
};

interface Props {
    banners: Banner[];
}

export default function HeroSection({ banners }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filtrar solo banners activos
    const activeBanners = banners.filter((banner) => banner.is_active === true);

    // Si no hay banners activos, no mostrar el carousel
    const hasBanners = activeBanners.length > 0;

    // Auto-rotación cada 3 segundos
    useEffect(() => {
        if (!hasBanners) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1,
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [activeBanners.length, hasBanners]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? activeBanners.length - 1 : prevIndex - 1,
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1,
        );
    };

    // Si no hay banners, mostrar imagen por defecto
    const backgroundImage = hasBanners
        ? `/storage/${activeBanners[currentIndex].image_path}`
        : '/static/mainn.jpg';

    return (
        <section className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[85vh]">
            {/* Imagen de fondo con transición suave */}
            <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
                <img
                    src={backgroundImage}
                    //alt="Banner promocional"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Controles del carousel - Solo mostrar si hay banners */}
            {hasBanners && activeBanners.length > 1 && (
                <>
                    {/* Botón anterior */}
                    <button
                        onClick={goToPrevious}
                        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:scale-110 hover:bg-black/70 md:left-6"
                        aria-label="Anterior banner"
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>

                    {/* Botón siguiente */}
                    <button
                        onClick={goToNext}
                        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:scale-110 hover:bg-black/70 md:right-6"
                        aria-label="Siguiente banner"
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                </>
            )}

            {/* Contenido */}
            <div className="relative flex min-h-[70vh] items-center md:min-h-[85vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl text-white">
                        <div className="animate-fade-in mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                            🔥 Hasta 40% OFF
                        </div>
                        <h1 className="animate-fade-in-up mb-4 text-3xl leading-tight font-bold sm:text-4xl md:text-6xl lg:text-7xl">
                            Encuentra todo
                            <span className="block bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                en un solo lugar
                            </span>
                        </h1>
                        <p className="animate-fade-in-up animation-delay-100 mb-6 max-w-lg text-base text-gray-200 sm:text-lg md:text-xl">
                            Miles de productos, mejores precios y envíos
                            rápidos. Descubre las mejores ofertas hoy mismo.
                        </p>

                        <div className="animate-fade-in-up animation-delay-200 flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="/productos"
                                className="inline-flex transform items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-all duration-200 hover:scale-105 hover:bg-gray-100"
                            >
                                Explorar productos
                                <ShoppingBag size={18} />
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="animate-fade-in-up animation-delay-300 mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-8">
                            <div>
                                <p className="text-2xl font-bold">+10k</p>
                                <p className="text-xs text-gray-300">
                                    Productos
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">+5k</p>
                                <p className="text-xs text-gray-300">
                                    Clientes felices
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">24/7</p>
                                <p className="text-xs text-gray-300">Soporte</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
