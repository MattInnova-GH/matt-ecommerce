import { Search, Bell, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SessionUser {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
}

interface SellerHeaderProps {
    onOpenMobileSidebar: () => void;
    user: SessionUser;
}

const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    SELLER: 'Vendedor',
    USER: 'Usuario',
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function SellerHeader({ onOpenMobileSidebar, user }: SellerHeaderProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                <button
                    onClick={onOpenMobileSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="hidden lg:block"></div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                        >
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {open && (
                            <div className={`
                                absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-50
                            `}>
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                                    <span className="text-sm font-semibold">Notificaciones de tienda</span>
                                </div>
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No hay ventas nuevas
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{roleLabels[user.role ?? ''] ?? 'Vendedor'}</p>
                        </div>
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-md border-2 border-indigo-100 dark:border-indigo-900"
                            />
                        ) : (
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md shrink-0">
                                <span className="text-white text-xs sm:text-sm font-semibold">
                                    {getInitials(user.name)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:hidden px-4 pb-3">
                <div className="flex items-center bg-gray-50 dark:bg-zinc-900 rounded-lg px-3 py-2 border border-transparent focus-within:border-indigo-300 transition-all">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Buscar en mi tienda..."
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 dark:text-gray-300 placeholder-gray-400"
                    />
                </div>
            </div>
        </header>
    );
}
