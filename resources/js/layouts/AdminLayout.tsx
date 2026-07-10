import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Star,
    Image,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ShoppingBag,
    User,
    PanelLeftClose,
    PanelLeftOpen,
    TicketPercent,
    FileWarning,
} from 'lucide-react';
import admin from '@/routes/admin';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

// -- Tipos --
interface NavSubItem {
    name: string;
    href: string;
}
interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
    subitems?: NavSubItem[];
}

// -- Componente de ítem de nav colapsado (solo ícono con tooltip) --
function CollapsedNavItem({
    item,
    isActive,
}: {
    item: NavItem;
    isActive: boolean;
}) {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={item.href}
                        className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        )}
                    >
                        <item.icon size={18} />
                        {item.badge ? (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                        ) : null}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs font-medium">
                    {item.name}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// -- Sidebar Content (reutilizado en desktop y mobile) --
function SidebarContent({
    mobile = false,
    isSidebarOpen,
    setIsSidebarOpen,
    setIsMobileMenuOpen,
    navItems,
    expandedMenus,
    toggleMenu,
    isActive,
}: {
    mobile?: boolean;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    setIsMobileMenuOpen: (value: boolean) => void;
    navItems: NavItem[];
    expandedMenus: string[];
    toggleMenu: (menu: string) => void;
    isActive: (path: string) => boolean;
}) {
    return (
        <div className="flex h-full flex-col">
            {/* Logo / Header */}
            <div
                className={cn(
                    'flex h-16 items-center border-b px-4',
                    isSidebarOpen || mobile
                        ? 'justify-between'
                        : 'justify-center',
                )}
            >
                {(isSidebarOpen || mobile) && (
                    <Link
                        href="/"
                        className="flex min-w-0 items-center gap-2.5"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                            <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm leading-tight font-semibold text-foreground">
                                Panel de control
                            </p>
                            <p className="truncate text-[10px] text-muted-foreground"></p>
                        </div>
                    </Link>
                )}

                {!mobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? (
                            <PanelLeftClose size={16} />
                        ) : (
                            <PanelLeftOpen size={16} />
                        )}
                    </Button>
                )}

                {mobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={18} />
                    </Button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const expanded = expandedMenus.includes(
                        item.name.toLowerCase(),
                    );

                    if (!isSidebarOpen && !mobile) {
                        return (
                            <div
                                key={item.name}
                                className="mb-0.5 flex justify-center"
                            >
                                <CollapsedNavItem
                                    item={item}
                                    isActive={active}
                                />
                            </div>
                        );
                    }

                    if (item.subitems) {
                        return (
                            <div key={item.name}>
                                <button
                                    onClick={() =>
                                        toggleMenu(item.name.toLowerCase())
                                    }
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} />
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {item.badge && (
                                            <Badge
                                                variant="secondary"
                                                className="h-4 px-1.5 text-[10px]"
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}
                                        <ChevronDown
                                            size={14}
                                            className={cn(
                                                'text-muted-foreground transition-transform duration-200',
                                                expanded && 'rotate-180',
                                            )}
                                        />
                                    </div>
                                </button>

                                {expanded && (
                                    <div className="mt-0.5 ml-5 space-y-0.5 border-l py-1 pl-3">
                                        {item.subitems.map((subitem) => (
                                            <Link
                                                key={subitem.name}
                                                href={subitem.href}
                                                onClick={() =>
                                                    mobile &&
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className={cn(
                                                    'block rounded-md px-3 py-1.5 text-sm transition-colors',
                                                    isActive(subitem.href)
                                                        ? 'bg-primary/10 font-medium text-primary'
                                                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                                                )}
                                            >
                                                {subitem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => mobile && setIsMobileMenuOpen(false)}
                            className={cn(
                                'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                active
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={16} />
                                <span>{item.name}</span>
                            </div>
                            {item.badge && (
                                <Badge
                                    variant={active ? 'outline' : 'secondary'}
                                    className={cn(
                                        'h-4 px-1.5 text-[10px]',
                                        active &&
                                            'border-primary-foreground/50 text-primary-foreground',
                                    )}
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer: User + Logout */}
            <div className="border-t p-3">
                {isSidebarOpen || mobile ? (
                    <Button
                        className="flex w-full"
                        variant="destructive"
                        onClick={() => router.post('/logout')}
                    >
                        <LogOut className="mr-1 h-4 w-4" />
                        Cerrar sesión
                    </Button>
                ) : (
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="mx-auto flex h-10 w-10"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => router.post('/logout')}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className="text-xs font-medium"
                            >
                                Cerrar sesión
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['productos']);

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

    const navItems: NavItem[] = [
        {
            name: 'Dashboard',
            href: admin.dashboard().url,
            icon: LayoutDashboard,
        },
        {
            name: 'Productos',
            href: '/admin/productos',
            icon: Package,
            subitems: [
                {
                    name: 'Todos los productos',
                    href: admin.products.index().url,
                },
                { name: 'Crear producto', href: admin.products.create().url },
                { name: 'Categorías', href: admin.categories.index().url },
                { name: 'Marcas', href: admin.brands.index().url },
            ],
        },
        {
            name: 'Órdenes',
            href: admin.orders.index().url,
            icon: ShoppingCart,
        },
        {
            name: 'Usuarios',
            href: admin.users.index().url,
            icon: User,
        },
        {
            name: 'Reseñas',
            href: admin.reviews.index().url,
            icon: Star,
        },
        {
            name: 'Banners',
            href: admin.banners.index().url,
            icon: Image,
        },
        {
            name: 'Promociones',
            href: admin.promotions.index().url,
            icon: TicketPercent,
        },
        {
            name: 'Reclamos',
            href: admin.complaints.index().url,
            icon: FileWarning,
        },
        {
            name: 'Configuración',
            href: admin.settings.index().url,
            icon: Settings,
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* ── Sidebar Desktop ── */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 hidden h-screen border-r bg-card transition-all duration-300 lg:block',
                    isSidebarOpen ? 'w-60' : 'w-[60px]',
                )}
            >
                <SidebarContent
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    navItems={navItems}
                    expandedMenus={expandedMenus}
                    toggleMenu={toggleMenu}
                    isActive={isActive}
                />
            </aside>

            {/* ── Mobile Overlay ── */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className="fixed top-0 left-0 z-50 h-full w-72 border-r bg-card shadow-xl lg:hidden">
                        <SidebarContent
                            mobile
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                            setIsMobileMenuOpen={setIsMobileMenuOpen}
                            navItems={navItems}
                            expandedMenus={expandedMenus}
                            toggleMenu={toggleMenu}
                            isActive={isActive}
                        />
                    </aside>
                </>
            )}

            {/* ── Topbar ── */}
            <header
                className={cn(
                    'sticky top-0 z-30 flex h-16 items-center border-b bg-card/95 backdrop-blur transition-all duration-300',
                    isSidebarOpen ? 'lg:ml-60' : 'lg:ml-15',
                )}
            >
                <div className="flex w-full items-center justify-between gap-4 px-4">
                    {/* Left: mobile burger */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={18} />
                        </Button>

                        {/* Breadcrumb / title placeholder */}
                        <div className="hidden items-center gap-1.5 text-sm text-muted-foreground lg:flex">
                            <ShoppingBag size={14} />
                            <span>/</span>
                            <span className="font-medium text-foreground capitalize">
                                {url.split('/')[2] ?? 'dashboard'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main
                className={cn(
                    'min-h-[calc(100vh-3.5rem)] transition-all duration-300',
                    isSidebarOpen ? 'lg:ml-60' : 'lg:ml-[60px]',
                )}
            >
                <div className="p-4 lg:p-6">{children}</div>
            </main>
            <Toaster richColors />
        </div>
    );
}
