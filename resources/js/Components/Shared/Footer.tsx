import { Link, usePage } from '@inertiajs/react';
import {
    Phone,
    MapPin,
    CreditCard,
    Truck,
    Shield,
    Headphones,
    Facebook,
    Instagram,
    MessageCircle,
    Music,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const WHATSAPP_NUMBER = '51992422219';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function Footer() {
    const { settings } = usePage().props as any;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <Link href="/" className="shrink-0">
                                {settings?.logo ? (
                                    <img
                                        src={settings.logo}
                                        alt={settings.site_name || 'Logo'}
                                        className="h-20 w-20 rounded bg-white/95 object-contain p-1.5"
                                    />
                                ) : (
                                    <span className="text-xl font-bold tracking-tight text-white">
                                        {settings?.site_name || 'Matt Store'}
                                    </span>
                                )}
                            </Link>

                            {/* Aliado tecnológico */}
                            <div className="h-16 w-px bg-gray-700" />
                            <a
                                href="https://mattinnovasolution.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0"
                                title="Desarrollado por MATT INNOVA SOLUTION"
                            >
                                <img
                                    src="/static/matt-innova-logo.jpeg"
                                    alt="MATT INNOVA SOLUTION"
                                    className="h-20 w-20 rounded bg-white/95 object-contain p-1.5"
                                />
                            </a>
                        </div>
                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            Tu tienda de herramientas de confianza. Calidad,
                            buenos precios y envío rápido.
                        </p>
                        <div className="flex gap-4">
                            {settings?.facebook && (
                                <a
                                    href={settings.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-[#1877F2] hover:text-white"
                                >
                                    <Facebook size={20} />
                                </a>
                            )}
                            {settings?.instagram && (
                                <a
                                    href={settings.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-[#E1306C] hover:text-white"
                                >
                                    <Instagram size={20} />
                                </a>
                            )}
                            {settings?.whatsapp && (
                                <a
                                    href={settings.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-[#25D366] hover:text-white"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            )}
                            {settings?.tiktok && (
                                <a
                                    href={settings.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-black hover:text-white"
                                >
                                    <Music size={20} />
                                </a>
                            )}
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
                                    href="/categorias"
                                    className="transition hover:text-white"
                                >
                                    Categorias
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
                        <h4 className="mb-6 font-semibold text-white">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link
                                    href="/terminos-y-condiciones"
                                    className="transition hover:text-white"
                                >
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/politica-de-privacidad"
                                    className="transition hover:text-white"
                                >
                                    Política de Privacidad
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
                        <a
                            href={settings?.whatsapp || WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-3 flex items-center gap-3 rounded-lg bg-[#25D366]/10 px-3 py-2.5 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
                        >
                            <FaWhatsapp size={20} className="shrink-0" />
                            Escríbenos por WhatsApp
                        </a>
                        {settings?.email && (
                            <div className="mb-4">
                                <p className="mb-1 text-sm font-medium text-white">
                                    Escríbenos por correo
                                </p>
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="block text-sm whitespace-nowrap transition hover:text-white"
                                >
                                    {settings.email}
                                </a>
                            </div>
                        )}
                        <ul className="space-y-4 text-sm">
                            {settings?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin
                                        size={18}
                                        className="text-white-500 mt-0.5 shrink-0"
                                    />
                                    <span>{settings.address}</span>
                                </li>
                            )}
                            {settings?.phone && (
                                <li className="flex items-center gap-3">
                                    <Phone
                                        size={18}
                                        className="text-white-500"
                                    />
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="transition hover:text-white"
                                    >
                                        {settings.phone}
                                    </a>
                                </li>
                            )}
                            <li>
                                <Link
                                    href="/libro-de-reclamaciones"
                                    className="inline-block transition hover:opacity-80"
                                >
                                    <img
                                        src="/img/libro-reclamaciones.jpeg"
                                        alt="Libro de Reclamaciones"
                                        className="h-16 w-auto rounded object-contain"
                                    />
                                </Link>
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

                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row sm:pr-20">
                    <div className="flex gap-4">
                        <CreditCard size={24} className="text-gray-500" />
                        <span className="flex items-center text-xs text-gray-500">
                            Yape • Transferencia bancaria
                        </span>
                    </div>
                    <p className="text-center text-xs text-gray-500">
                        <span className="block">
                            © {currentYear}{' '}
                            {settings?.site_name || 'Matt Store'} | producto
                            exclusivo de{' '}
                            <a
                                href="https://mattinnovasolution.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-gray-400 underline underline-offset-2 transition hover:text-white"
                            >
                                MATT INNOVA SOLUTION
                            </a>
                        </span>
                        <span className="block">
                            Todos los derechos reservados.
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

// Se eliminó la función SocialIcon ya que ahora usamos los componentes directos de Lucide con colores específicos
