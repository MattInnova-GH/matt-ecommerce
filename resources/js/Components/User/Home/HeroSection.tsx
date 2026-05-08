import { ShoppingBag } from 'lucide-react';
import { Link } from '@inertiajs/react';

type Banner = {
    id: number;
    title: string;
    imageUrl: string;
    link?: string;
};

export default function HeroSection({ banners }: { banners: Banner[] }) {
    return (
        <section className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[85vh]">
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
                <img
                    src="/static/mainn.jpg"
                    alt="Moda sostenible y tecnología"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/30 to-transparent" />
            </div>

            {/* Contenido */}
            <div className="relative flex min-h-[70vh] items-center md:min-h-[85vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl text-white">
                        <div className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                            🔥 Hasta 40% OFF
                        </div>
                        <h1 className="mb-4 text-3xl leading-tight font-bold sm:text-4xl md:text-6xl lg:text-7xl">
                            Encuentra todo
                            <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                en un solo lugar
                            </span>
                        </h1>
                        <p className="mb-6 max-w-lg text-base text-gray-200 sm:text-lg md:text-xl">
                            Miles de productos, mejores precios y envíos
                            rápidos. Descubre las mejores ofertas hoy mismo.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="/productos"
                                className="inline-flex transform items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-all duration-200 hover:scale-105 hover:bg-gray-100"
                            >
                                Explorar productos
                                <ShoppingBag size={18} />
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-8">
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
