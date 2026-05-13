import { Form, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    Settings,
    ShoppingBag,
    Heart,
    LogOut,
    LayoutDashboard,
} from 'lucide-react';
import { logout } from '@/routes';
import { ConfirmModal } from '../Auth/logout/ConfirmModal';
import favorites from '@/routes/client/favorites';
import { dashboard } from '@/routes/admin';
import profile from '@/routes/client/profile';

type User = {
    name: string;
    last_name?: string;
    email: string;
    role: 'client ' | 'admin';
    image?: string;
};

type Props = {
    user: User;
    onClose: () => void;
};

export default function UserDropdown({ user, onClose }: Props) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const displayName = user.last_name
        ? `${user.name} ${user.last_name}`
        : user.name;

    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const commonLinks = [
        {
            href: profile.index({ query: { section: 'orders' } }),
            label: 'Mis Compras',
            icon: ShoppingBag,
        },
        { href: favorites.index(), label: 'Favoritos', icon: Heart },
        { href: profile.index(), label: 'Configuración', icon: Settings },
    ];

    const roleLinks = {
        USER: [],
        admin: [
            {
                href: dashboard(),
                label: 'Dashboard Admin',
                icon: LayoutDashboard,
            },
        ],
    };

    const roleBadge = {
        admin: {
            text: 'Administrador',
            className: 'bg-purple-100 text-purple-700',
        },
        client: { text: 'Cliente', className: 'bg-gray-100 text-gray-700' },
    }[user.role] || { text: 'Cliente', className: 'bg-gray-100 text-gray-700' };

    return (
        <>
            {/* Overlay móvil */}
            <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />

            <div
                ref={dropdownRef}
                className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
            >
                {/* Header */}
                <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                            {user.image ? (
                                <img
                                    src={'/storage/' + user.image}
                                    alt={displayName}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-lg font-medium">
                                    {displayName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">
                                {displayName}
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
                {/* Links por rol */}
                {(roleLinks[user.role] || []).length > 0 && (
                    <div className="border-t border-gray-100">
                        <div className="px-4 py-2">
                            <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                                Panel de{' '}
                                {user.role === 'admin'
                                    ? 'Administrador'
                                    : 'Vendedor'}
                            </p>
                        </div>
                        {(roleLinks[user.role] || []).map((link) => (
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
                )}
                {/* Logout */}
                <div className="border-t border-gray-100">
                    <Form method="post" action={logout()}>
                        {({ submit }) => (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsLogoutOpen(true)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    Cerrar sesión
                                </button>

                                <ConfirmModal
                                    isOpen={isLogoutOpen}
                                    onClose={() => setIsLogoutOpen(false)}
                                    onConfirm={() => {
                                        setIsLogoutOpen(false);
                                        onClose();
                                        submit();
                                    }}
                                    title="Cerrar sesión"
                                    message="¿Estás seguro de que quieres cerrar sesión?"
                                    confirmText="Cerrar sesión"
                                    cancelText="Cancelar"
                                    icon="danger"
                                />
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}
