import {
    Store,
    LogOut,
    Menu,
    LayoutDashboard,
    Package,
    CreditCard,
    Settings2,
    Truck,
    Users,
    Settings,
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { SidebarNavItem } from '@/Components/Shared/SidebarNavItem';

interface SellerSidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const primaryNavItems = [
    { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
    { name: 'Gestión de productos', path: '/seller/productos', icon: Package },
    { name: 'Órdenes', path: '/seller/ordenes', icon: CreditCard },
    {
        name: 'Perfil de tienda',
        path: '/seller/gestion-perfil',
        icon: Settings2,
    },
];

const managementNavItems = [
    { name: 'Envíos', path: '/seller/envios', icon: Truck },
    { name: 'Clientes', path: '/seller/clientes', icon: Users },
    { name: 'Configuración', path: '/seller/configuracion', icon: Settings },
];

export function SellerSidebar({
    isCollapsed,
    onToggleCollapse,
}: SellerSidebarProps) {
    const { url } = usePage();

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-40 hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out lg:flex lg:flex-col dark:border-zinc-800 dark:bg-zinc-950 ${isCollapsed ? 'w-20' : 'w-72'} `}
        >
            <div
                className={`shrink-0 border-b border-gray-200 p-5 dark:border-zinc-800 ${isCollapsed ? 'px-3' : ''}`}
            >
                <Link
                    href="/seller"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                        <Store className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <span className="block text-lg leading-tight font-bold text-gray-900 dark:text-white">
                                Seller Panel
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto p-4">
                <div className="space-y-1">
                    {!isCollapsed && (
                        <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Principal
                        </p>
                    )}
                    {primaryNavItems.map((item) => (
                        <SidebarNavItem
                            key={item.path}
                            item={item}
                            isActive={url === item.path}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>

                <div className="space-y-1">
                    {!isCollapsed && (
                        <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                            Gestión
                        </p>
                    )}
                    {managementNavItems.map((item) => (
                        <SidebarNavItem
                            key={item.name}
                            item={item}
                            isActive={url.startsWith(item.path)}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>
            </nav>

            <div className="shrink-0 space-y-1 border-t border-gray-200 p-4 dark:border-zinc-800">
                <Link
                    method="post"
                    as="button"
                    href="/logout"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20 ${isCollapsed ? 'justify-center' : ''} `}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                        <span className="text-sm font-medium">
                            Cerrar sesión
                        </span>
                    )}
                </Link>

                <button
                    onClick={onToggleCollapse}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-900 ${isCollapsed ? 'justify-center' : ''} `}
                >
                    <Menu className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                        <span className="text-sm font-medium">
                            Colapsar menú
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
