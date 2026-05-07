// resources/js/components/Header/Navbar.tsx
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import UserMenu from './UserMenu';
import { AuthModal } from './AuthModal';
import CartDrawer from '@/Components/User/Cart';
import { useCartStore } from '@/stores/cartStore';

type AuthUser = {
    name: string;
    last_name?: string;
    email: string;
    role: 'USER' | 'SELLER' | 'ADMIN';
    image?: string;
} | null;

export default function Navbar() {
    const { url, props } = usePage();

    const { auth } = props as any;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const { openCart, totalItems } = useCartStore();

    const cartCount = totalItems();

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="shrink-0">
                            <img
                                src="/static/logo.webp"
                                alt="Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        {/* Nav links desktop */}
                        <div className="hidden items-center space-x-8 lg:flex">
                            <NavLink href="/" active={url === '/'}>
                                INICIO
                            </NavLink>

                            <NavLink
                                href="/productos"
                                active={url.startsWith('/productos')}
                            >
                                PRODUCTOS
                            </NavLink>

                            <NavLink
                                href="/tiendas"
                                active={url.startsWith('/tiendas')}
                            >
                                TIENDAS
                            </NavLink>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-4 lg:space-x-6">
                            <button className="hidden transition hover:opacity-60 sm:block dark:text-white">
                                <Search size={20} />
                            </button>

                            {/* CART BUTTON */}
                            <button
                                onClick={openCart}
                                className="relative transition hover:opacity-60 dark:text-white"
                            >
                                <ShoppingCart size={20} />

                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-4 rounded-full bg-black px-1.5 text-center text-[10px] text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* UserMenu — maneja autenticado y no autenticado */}
                            <UserMenu
                                user={user}
                                onOpenLogin={() => setIsLoginOpen(true)}
                            />

                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden dark:hover:bg-zinc-900"
                            >
                                <Menu size={22} className="dark:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* DRAWER DEL CARRITO */}
            <CartDrawer />

            <AuthModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
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
                active
                    ? 'text-black dark:text-white'
                    : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
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
            href: '/tiendas',
            label: 'Tiendas',
        },
    ];

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="fixed top-0 right-0 bottom-0 z-50 flex w-80 flex-col bg-white shadow-xl dark:bg-zinc-950">
                <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-zinc-800">
                    <img
                        src="/static/logo.webp"
                        alt="Logo"
                        className="h-8 w-auto object-contain"
                    />

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-900"
                    >
                        <X size={22} className="dark:text-white" />
                    </button>
                </div>
                <div className="space-y-1 p-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`block rounded-lg px-3 py-3 transition ${
                                currentUrl === item.href
                                    ? 'bg-gray-100 text-black dark:bg-zinc-800'
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-900'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
