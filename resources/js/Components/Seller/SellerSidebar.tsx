import { Store, LogOut, Menu, LayoutDashboard, Package, CreditCard, Settings2, Truck, Users, Settings } from 'lucide-react';
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
    { name: 'Perfil de tienda', path: '/seller/gestion-perfil', icon: Settings2 },
];

const managementNavItems = [
    { name: 'Envíos', path: '/seller/envios', icon: Truck },
    { name: 'Clientes', path: '/seller/clientes', icon: Users },
    { name: 'Configuración', path: '/seller/configuracion', icon: Settings },
];

export function SellerSidebar({ isCollapsed, onToggleCollapse }: SellerSidebarProps) {
    const { url } = usePage();

    return (
        <aside
            className={`
                hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-40
                bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-20' : 'w-72'}
            `}
        >
            <div className={`shrink-0 p-5 border-b border-gray-200 dark:border-zinc-800 ${isCollapsed ? 'px-3' : ''}`}>
                <Link href="/seller" className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <span className="text-lg font-bold text-gray-900 dark:text-white block leading-tight">
                                Seller Panel
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-1">
                    {!isCollapsed && (
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
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
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
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

            <div className="shrink-0 p-4 border-t border-gray-200 dark:border-zinc-800 space-y-1">
                <Link
                    method="post"
                    as="button"
                    href="/logout"
                    className={`
                        flex items-center gap-3 px-3 py-2 w-full rounded-lg
                        text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors
                        ${isCollapsed ? 'justify-center' : ''}
                    `}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">Cerrar sesión</span>}
                </Link>

                <button
                    onClick={onToggleCollapse}
                    className={`
                        flex items-center gap-3 px-3 py-2 w-full rounded-lg
                        text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors
                        ${isCollapsed ? 'justify-center' : ''}
                    `}
                >
                    <Menu className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">Colapsar menú</span>}
                </button>
            </div>
        </aside>
    );
}
