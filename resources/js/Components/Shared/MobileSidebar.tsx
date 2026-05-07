import { X, Store, LogOut, LucideIcon } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
    badge?: string | null;
}

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    role: 'ADMIN' | 'SELLER';
}

export function MobileSidebar({ isOpen, onClose, role }: MobileSidebarProps) {
    const { url } = usePage();

    if (!isOpen) return null;

    // Example nav items based on role (should ideally come from a config)
    const navItems: NavItem[] =
        role === 'ADMIN'
            ? [
                  { name: 'Dashboard', path: '/admin', icon: Store },
                  { name: 'Usuarios', path: '/admin/usuarios', icon: Store },
                  { name: 'Productos', path: '/admin/productos', icon: Store },
              ]
            : [
                  { name: 'Dashboard', path: '/seller', icon: Store },
                  { name: 'Productos', path: '/seller/productos', icon: Store },
                  { name: 'Ordenes', path: '/seller/ordenes', icon: Store },
              ];

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="fixed inset-y-0 left-0 flex w-80 flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                            <Store className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="block text-lg leading-tight font-bold text-gray-900">
                                Matt Ecommerce
                            </span>
                            <p className="text-xs text-gray-500">
                                Panel {role.toLowerCase()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.path);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'} `}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="flex-1 text-sm font-medium">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-gray-200 p-4">
                    <Link
                        method="post"
                        as="button"
                        href="/logout"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 transition-colors hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">
                            Cerrar sesión
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
