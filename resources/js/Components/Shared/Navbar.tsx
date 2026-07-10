import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Search,
    ShoppingCart,
    Menu,
    X,
    Facebook,
    Instagram,
    MessageCircle,
    Music,
    Phone,
    MapPin,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import UserMenu from './UserMenu';
import SearchModal from './SearchModal';
import NotificationBell from './NotificationBell';
import CartDrawer from '@/Components/User/Cart';
import { useCartStore } from '@/stores/cartStore';
import { useAuthModalStore } from '@/stores/authModalStore';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';
import { products } from '@/routes';

type AuthUser = {
    name: string;
    last_name?: string;
    email: string;
    role: 'client' | 'admin';
    image?: string;
} | null;

export default function Navbar() {
    const { url, props } = usePage();
    const auth = (props as any).auth as { user: AuthUser };
    const user = auth?.user ?? null;
    const { settings } = props as any;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { toggleCart, totalItems } = useCartStore();
    const openAuthModal = useAuthModalStore((state) => state.open);
    const cartCount = totalItems();

    return (
        <>
            <nav className="sticky top-0 z-[1001] w-full border-b border-gray-200 bg-white backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="shrink-0">
                            <img
                                src={settings?.logo || '/static/logo.webp'}
                                alt={settings?.site_name || 'Logo'}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        {/* Nav links desktop */}
                        <div className="hidden items-center space-x-8 lg:flex">
                            <NavLink href="/" active={url === '/'}>
                                INICIO
                            </NavLink>

                            <NavLink
                                href={products.url()}
                                active={url.startsWith('/productos')}
                            >
                                PRODUCTOS
                            </NavLink>

                            <NavLink
                                href="/categorias"
                                active={url.startsWith('/categorias')}
                            >
                                CATEGORIAS
                            </NavLink>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                aria-label="Buscar productos"
                                className="transition hover:opacity-60"
                            >
                                <Search size={20} />
                            </button>

                            {/* CART BUTTON */}
                            <button
                                onClick={toggleCart}
                                className="relative transition hover:opacity-60"
                            >
                                <ShoppingCart size={20} />

                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-4 rounded-full bg-black px-1.5 text-center text-[10px] text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {user && <NotificationBell />}

                            {/* UserMenu — maneja autenticado y no autenticado */}
                            <UserMenu
                                user={user}
                                onOpenLogin={() => openAuthModal()}
                            />

                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen((prev) => !prev)
                                }
                                aria-label={
                                    isMobileMenuOpen
                                        ? 'Cerrar menú'
                                        : 'Abrir menú'
                                }
                                className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
                            >
                                {isMobileMenuOpen ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* DRAWER DEL CARRITO */}
            <CartDrawer />

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            {isMobileMenuOpen && (
                <MobileDrawer
                    onClose={() => setIsMobileMenuOpen(false)}
                    currentUrl={url}
                />
            )}
        </>
    );
}

function NavLink({
    href,
    active,
    children,
}: {
    href: string;

    active: boolean;

    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`text-sm font-light tracking-tight transition ${
                active ? 'text-black' : 'text-gray-600 hover:text-black'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileDrawer({
    onClose,
    currentUrl,
}: {
    onClose: () => void;

    currentUrl: string;
}) {
    const { settings } = usePage().props as any;
    const currentYear = new Date().getFullYear();
    const whatsappLink = settings?.whatsapp || 'https://wa.me/51992422219';

    useBodyScrollLock(true);
    const menuItems = [
        {
            href: '/',
            label: 'Inicio',
        },

        {
            href: '/productos',
            label: 'Productos',
        },

        {
            href: '/categorias',
            label: 'Categorías',
        },
    ];

    const legalItems = [
        { href: '/terminos-y-condiciones', label: 'Términos y Condiciones' },
        { href: '/politica-de-privacidad', label: 'Política de Privacidad' },
        { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
        { href: '/libro-de-reclamaciones', label: 'Libro de Reclamaciones' },
    ];

    return (
        <>
            <div
                className="fixed inset-0 z-1010 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed top-0 right-0 bottom-0 z-1020 flex w-80 flex-col bg-white shadow-xl">
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={settings?.logo || '/static/logo.webp'}
                            alt={settings?.site_name || 'Logo'}
                            className="h-12 w-12 object-contain"
                        />
                        <div className="h-9 w-px bg-gray-200" />
                        <a
                            href="https://mattinnovasolution.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Desarrollado por MATT INNOVA SOLUTION"
                        >
                            <img
                                src="/static/matt-innova-logo.jpeg"
                                alt="MATT INNOVA SOLUTION"
                                className="h-12 w-12 object-contain"
                            />
                        </a>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto">
                    <div className="space-y-1 p-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`block rounded-lg px-3 py-3 transition ${
                                    currentUrl === item.href
                                        ? 'bg-gray-100 text-black'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Datos del footer, siempre al final del menú */}
                    <div className="mt-auto space-y-5 border-t border-gray-100 p-4">
                        <div className="flex gap-3">
                            {settings?.facebook && (
                                <a
                                    href={settings.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-[#1877F2] hover:text-white"
                                >
                                    <Facebook size={18} />
                                </a>
                            )}
                            {settings?.instagram && (
                                <a
                                    href={settings.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-[#E1306C] hover:text-white"
                                >
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings?.whatsapp && (
                                <a
                                    href={settings.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-[#25D366] hover:text-white"
                                >
                                    <MessageCircle size={18} />
                                </a>
                            )}
                            {settings?.tiktok && (
                                <a
                                    href={settings.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-black hover:text-white"
                                >
                                    <Music size={18} />
                                </a>
                            )}
                        </div>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg bg-[#25D366]/10 px-3 py-2.5 text-sm font-medium text-[#1a9c4c] transition hover:bg-[#25D366] hover:text-white"
                        >
                            <FaWhatsapp size={18} className="shrink-0" />
                            Escríbenos por WhatsApp
                        </a>

                        <ul className="space-y-2.5 text-sm text-gray-600">
                            {settings?.phone && (
                                <li className="flex items-center gap-2.5">
                                    <Phone
                                        size={16}
                                        className="shrink-0 text-gray-400"
                                    />
                                    <a
                                        href={`tel:${settings.phone}`}
                                        className="transition hover:text-black"
                                    >
                                        {settings.phone}
                                    </a>
                                </li>
                            )}
                            {settings?.address && (
                                <li className="flex items-start gap-2.5">
                                    <MapPin
                                        size={16}
                                        className="mt-0.5 shrink-0 text-gray-400"
                                    />
                                    <span>{settings.address}</span>
                                </li>
                            )}
                        </ul>

                        <ul className="space-y-2.5 text-sm text-gray-500">
                            {legalItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className="transition hover:text-black"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <p className="pt-2 text-xs text-gray-400">
                            © {currentYear}{' '}
                            {settings?.site_name || 'Matt Store'} | producto
                            exclusivo de{' '}
                            <a
                                href="https://mattinnovasolution.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-gray-600 underline underline-offset-2 transition hover:text-black"
                            >
                                MATT INNOVA SOLUTION
                            </a>
                            . Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
