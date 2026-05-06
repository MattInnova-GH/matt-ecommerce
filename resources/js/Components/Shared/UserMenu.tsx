// resources/js/Components/Header/UserMenu.tsx
import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    User,
    ChevronDown,
    Settings,
    ShoppingBag,
    Heart,
    LogOut,
    LayoutDashboard,
} from 'lucide-react';

// ============================================
// USER MENU COMPONENT
// ============================================
type UserMenuProps = {
    onOpenAuthModal?: (type: 'login' | 'logout') => void;
};

export default function UserMenu({ onOpenAuthModal }: UserMenuProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { props } = usePage();
    const user = (props as any).auth?.user;
    const isAuthenticated = !!user;

    const handleUserClick = () => {
        if (isAuthenticated) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            onOpenAuthModal?.('login');
        }
    };

    const handleLogoutClick = () => {
        onOpenAuthModal?.('logout');
        setIsDropdownOpen(false);
    };

    // Mostrar nombre completo o solo nombre
    const displayName = user?.last_name
        ? `${user.name} ${user.last_name}`
        : user?.name;

    return (
        <div className="relative">
            <button
                onClick={handleUserClick}
                className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-gray-100 hover:opacity-70"
                aria-label="Menú de usuario"
            >
                {/* Avatar o icono */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {isAuthenticated && user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={displayName || 'Avatar'}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <User size={16} className="text-gray-500" />
                    )}
                </div>

                {isAuthenticated && displayName && (
                    <>
                        <span className="hidden text-sm font-medium text-gray-700 md:block">
                            {displayName.split(' ')[0]}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`hidden transition-transform duration-200 md:block ${
                                isDropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </>
                )}
            </button>

            {isAuthenticated && isDropdownOpen && (
                <UserDropdown
                    user={{
                        ...user,
                        name: displayName || user?.name || '',
                        role: user?.role?.toUpperCase() || 'USER',
                        avatar: user?.avatar || '',
                    }}
                    onClose={() => setIsDropdownOpen(false)}
                    onLogout={handleLogoutClick}
                />
            )}
        </div>
    );
}

// ============================================
// USER DROPDOWN COMPONENT
// ============================================
type User = {
    id?: string;
    name?: string;
    email?: string;
    role?: 'USER' | 'SELLER' | 'ADMIN';
    avatar?: string;
};

type UserDropdownProps = {
    user: User;
    onClose: () => void;
    onLogout: () => void;
};

function UserDropdown({ user, onClose, onLogout }: UserDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Cerrar con ESC
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const userRole = user.role || 'USER';

    // Opciones comunes para todos los usuarios
    const commonLinks = [
        { href: '/mis-compras', label: 'Mis Compras', icon: ShoppingBag },
        { href: '/favoritos', label: 'Favoritos', icon: Heart },
        { href: '/configuracion', label: 'Configuración', icon: Settings },
    ];

    // Opciones específicas según el rol
    const roleLinks: Record<
        string,
        { href: string; label: string; icon: any }[]
    > = {
        USER: [],
        SELLER: [
            {
                href: '/seller',
                label: 'Dashboard Vendedor',
                icon: LayoutDashboard,
            },
        ],
        ADMIN: [
            { href: '/admin', label: 'Dashboard Admin', icon: LayoutDashboard },
        ],
    };

    const getRoleBadge = () => {
        switch (userRole) {
            case 'ADMIN':
                return {
                    text: 'Administrador',
                    className: 'bg-purple-100 text-purple-700',
                };
            case 'SELLER':
                return {
                    text: 'Vendedor',
                    className: 'bg-blue-100 text-blue-700',
                };
            default:
                return {
                    text: 'Cliente',
                    className: 'bg-gray-100 text-gray-700',
                };
        }
    };

    const roleBadge = getRoleBadge();

    return (
        <>
            {/* Overlay para cerrar en móvil */}
            <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />

            <div
                ref={dropdownRef}
                className="absolute right-0 z-50 mt-2 w-80 animate-in overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl duration-200 fade-in slide-in-from-top-2"
            >
                {/* Header del usuario */}
                <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-white">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name || 'Avatar'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-medium">
                                    {user.name?.charAt(0).toUpperCase() ||
                                        user.email?.charAt(0).toUpperCase() ||
                                        'U'}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">
                                {user.name || 'Usuario'}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                                {user.email}
                            </p>
                            <span
                                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${roleBadge.className}`}
                            >
                                {roleBadge.text}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Links comunes */}
                <div className="py-2">
                    {commonLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <link.icon size={18} className="text-gray-400" />
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Separador si hay links de rol */}
                {roleLinks[userRole]?.length > 0 && (
                    <>
                        <div className="border-t border-gray-100">
                            <div className="px-4 py-2">
                                <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                                    Panel de{' '}
                                    {userRole === 'ADMIN'
                                        ? 'Administrador'
                                        : 'Vendedor'}
                                </p>
                            </div>
                            {roleLinks[userRole].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    <link.icon
                                        size={18}
                                        className="text-gray-400"
                                    />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* Separador y botón de logout */}
                <div className="border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </>
    );
}
