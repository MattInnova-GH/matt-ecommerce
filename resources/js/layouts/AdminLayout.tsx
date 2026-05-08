import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    Truck,
    ShoppingCart,
    CreditCard,
    Users,
    Star,
    Image,
    Bell,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ShoppingBag,
    User,
} from 'lucide-react';
import admin from '@/routes/admin';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([
        'products',
        'orders',
    ]);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = (menu: string) => {
        setExpandedMenus((prev) =>
            prev.includes(menu)
                ? prev.filter((m) => m !== menu)
                : [...prev, menu],
        );
    };

    const isActive = (path: string) => {
        if (path === '/admin' && url === '/admin') {
            return true;
        }

        if (path !== '/admin' && url.startsWith(path)) {
            return true;
        }

        return false;
    };

    const navItems = [
        {
            name: 'Dashboard',
            href: admin.dashboard(),
            icon: LayoutDashboard,
            exact: true,
        },
        {
            name: 'Productos',
            href: '/admin/productos',
            icon: Package,
            subitems: [
                { name: 'Todos los productos', href: admin.products.index() },
                { name: 'Crear producto', href: admin.products.create() },
                { name: 'Categorías', href: admin.categories.index() },
                { name: 'Marcas', href: admin.brands.index() },
            ],
        },
        {
            name: 'Proveedores',
            href: '/admin/proveedores',
            icon: Truck,
        },
        {
            name: 'Órdenes',
            href: '/admin/ordenes',
            icon: ShoppingCart,
            subitems: [
                { name: 'Todas las órdenes', href: '/admin/ordenes' },
                { name: 'Pendientes', href: '/admin/ordenes?status=pending' },
                { name: 'Enviadas', href: '/admin/ordenes?status=shipped' },
                { name: 'Entregadas', href: '/admin/ordenes?status=delivered' },
            ],
        },
        {
            name: 'Pagos',
            href: '/admin/pagos',
            icon: CreditCard,
        },
        {
            name: 'Clientes',
            href: '/admin/clientes',
            icon: Users,
        },
        {
            name: 'Usuarios',
            href: admin.users.index(),
            icon: User,
        },
        {
            name: 'Reseñas',
            href: '/admin/resenas',
            icon: Star,
        },
        {
            name: 'Banners',
            href: admin.banners.index(),
            icon: Image,
        },
        {
            name: 'Notificaciones',
            href: '/admin/notificaciones',
            icon: Bell,
        },
        {
            name: 'Reportes',
            href: '/admin/reportes',
            icon: FileText,
            subitems: [
                { name: 'Ventas', href: '/admin/reportes/ventas' },
                { name: 'Productos', href: '/admin/reportes/productos' },
                { name: 'Clientes', href: '/admin/reportes/clientes' },
                { name: 'Exportar', href: '/admin/reportes/exportar' },
            ],
        },
        {
            name: 'Configuración',
            href: admin.settings.index(),
            icon: Settings,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar Desktop */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-xl transition-all duration-300 ${
                    isSidebarOpen ? 'w-64' : 'w-20'
                } hidden lg:block`}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                    {isSidebarOpen ? (
                        <Link href="/admin" className="flex items-center gap-2">
                            <ShoppingBag className="h-6 w-6 text-gray-900" />
                            <span className="text-lg font-bold text-gray-900">
                                Panel de control
                            </span>
                        </Link>
                    ) : (
                        <Link href="/admin" className="mx-auto">
                            <ShoppingBag className="h-6 w-6 text-gray-900" />
                        </Link>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="rounded-lg p-1 hover:bg-gray-100"
                    >
                        <Menu size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            {item.subitems ? (
                                <>
                                    <button
                                        onClick={() =>
                                            toggleMenu(item.name.toLowerCase())
                                        }
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} />
                                            {isSidebarOpen && (
                                                <span>{item.name}</span>
                                            )}
                                        </div>
                                        {isSidebarOpen && (
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform ${
                                                    expandedMenus.includes(
                                                        item.name.toLowerCase(),
                                                    )
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            />
                                        )}
                                    </button>
                                    {isSidebarOpen &&
                                        expandedMenus.includes(
                                            item.name.toLowerCase(),
                                        ) && (
                                            <div className="mt-1 ml-9 space-y-1">
                                                {item.subitems.map(
                                                    (subitem) => (
                                                        <Link
                                                            key={subitem.name}
                                                            href={subitem.href}
                                                            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                                                isActive(
                                                                    subitem.href,
                                                                )
                                                                    ? 'bg-gray-100 text-gray-900'
                                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                            }`}
                                                        >
                                                            {subitem.name}
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                        isActive(item.href)
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon size={18} />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Cerrar sesión */}
                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <button
                            onClick={() => router.post('/logout')}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                            <LogOut size={18} />
                            {isSidebarOpen && <span>Cerrar sesión</span>}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Header Mobile */}
            <div className="sticky top-0 z-30 bg-white shadow-sm lg:hidden">
                <div className="flex h-16 items-center justify-between px-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="rounded-lg p-2 hover:bg-gray-100"
                    >
                        <Menu size={22} />
                    </button>
                    <Link href="/admin" className="flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-gray-900" />
                        <span className="text-lg font-bold text-gray-900">
                            Admin
                        </span>
                    </Link>
                    <div className="w-8"></div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl lg:hidden">
                        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                            <Link
                                href="/admin"
                                className="flex items-center gap-2"
                            >
                                <ShoppingBag className="h-6 w-6 text-gray-900" />
                                <span className="text-lg font-bold text-gray-900">
                                    ZonaRetail Admin
                                </span>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-lg p-1 hover:bg-gray-100"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
                            {navItems.map((item) => (
                                <div key={item.name}>
                                    {item.subitems ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    toggleMenu(
                                                        item.name.toLowerCase(),
                                                    )
                                                }
                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                                    isActive(item.href)
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon size={18} />
                                                    <span>{item.name}</span>
                                                </div>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform ${
                                                        expandedMenus.includes(
                                                            item.name.toLowerCase(),
                                                        )
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </button>
                                            {expandedMenus.includes(
                                                item.name.toLowerCase(),
                                            ) && (
                                                <div className="mt-1 ml-9 space-y-1">
                                                    {item.subitems.map(
                                                        (subitem) => (
                                                            <Link
                                                                key={
                                                                    subitem.name
                                                                }
                                                                href={
                                                                    subitem.href
                                                                }
                                                                onClick={() =>
                                                                    setIsMobileMenuOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                                                    isActive(
                                                                        subitem.href,
                                                                    )
                                                                        ? 'bg-gray-100 text-gray-900'
                                                                        : 'text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {subitem.name}
                                                            </Link>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                                isActive(item.href)
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <item.icon size={18} />
                                            <span>{item.name}</span>
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <button
                                    onClick={() => router.post('/logout')}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </>
            )}

            {/* Main Content */}
            <main
                className={`min-h-screen transition-all duration-300 ${
                    isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
                }`}
            >
                <div className="p-4 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
