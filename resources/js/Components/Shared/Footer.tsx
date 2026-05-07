import { Link } from '@inertiajs/react';
import {
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Truck,
    Shield,
    Headphones,
} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                        <Link href="/" className="mb-6 inline-block">
                            <img
                                src="/img/inicio/logo.webp"
                                alt="Logo"
                                className="h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            Tu tienda online de confianza. Encuentra todo lo que
                            necesitas con los mejores precios y envíos rápidos.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02" />
                            <SocialIcon d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01" />
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-white">
                            Comprar
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link
                                    href="/productos"
                                    className="transition hover:text-white"
                                >
                                    Todos los productos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/tiendas"
                                    className="transition hover:text-white"
                                >
                                    Tiendas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="transition hover:text-white"
                                >
                                    Inicio
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-white">Ayuda</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link
                                    href="/contacto"
                                    className="transition hover:text-white"
                                >
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/envios"
                                    className="transition hover:text-white"
                                >
                                    Envíos y entregas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/devoluciones"
                                    className="transition hover:text-white"
                                >
                                    Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/preguntas-frecuentes"
                                    className="transition hover:text-white"
                                >
                                    Preguntas frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-semibold text-white">
                            Contacto
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin
                                    size={18}
                                    className="text-white-500 mt-0.5 shrink-0"
                                />
                                <span>Av. Principal 123, Ciudad</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-white-500" />
                                <a
                                    href="tel:+123456789"
                                    className="transition hover:text-white"
                                >
                                    +1 234 567 89
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-white-500" />
                                <a
                                    href="mailto:info@tienda.com"
                                    className="transition hover:text-white"
                                >
                                    info@tienda.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="flex items-center justify-center gap-3 sm:justify-start">
                            <Truck size={20} className="text-white-500" />
                            <span className="text-sm">
                                Envíos a todo el país
                            </span>
                        </div>
                        <div className="flex items-center justify-center gap-3 sm:justify-start">
                            <Shield size={20} className="text-white-500" />
                            <span className="text-sm">Compra 100% segura</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 sm:justify-start">
                            <Headphones size={20} className="text-white-500" />
                            <span className="text-sm">Soporte 24/7</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
                    <div className="flex gap-4">
                        <CreditCard size={24} className="text-gray-500" />
                        <span className="flex items-center text-xs text-gray-500">
                            Yape • Plin • Tarjetas
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">
                        © {currentYear} Matt Innova Solution. Todos los derechos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ d }: { d: string }) {
    return (
        <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-emerald-600 hover:text-white"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
            >
                <path fill="currentColor" d={d} />
            </svg>
        </a>
    );
}
