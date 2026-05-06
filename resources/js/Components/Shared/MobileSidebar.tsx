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
    const navItems: NavItem[] = role === 'ADMIN' ? [
        { name: 'Dashboard', path: '/admin', icon: Store },
        { name: 'Usuarios', path: '/admin/usuarios', icon: Store },
        { name: 'Productos', path: '/admin/productos', icon: Store },
    ] : [
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

            <div className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-zinc-950 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white block leading-tight">Matt Ecommerce</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Panel {role.toLowerCase()}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.path);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                                    ${isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-900'}
                                `}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="flex-1 font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
                    <Link 
                        method="post" 
                        as="button" 
                        href="/logout" 
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Cerrar sesión</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
