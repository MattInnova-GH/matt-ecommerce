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
    admin: 'Administrador',
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

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <button
                    onClick={onOpenMobileSidebar}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden dark:hover:bg-zinc-900"
                >
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>

                <div className="hidden lg:block"></div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="relative rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-900"
                        >
                            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {open && (
                            <div
                                className={`absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900`}
                            >
                                <div className="border-b border-gray-100 px-4 py-3 dark:border-zinc-800">
                                    <span className="text-sm font-semibold">
                                        Notificaciones de tienda
                                    </span>
                                </div>
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No hay ventas nuevas
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm leading-tight font-semibold text-gray-900 dark:text-white">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {roleLabels[user.role ?? ''] ?? 'Vendedor'}
                            </p>
                        </div>
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                                className="h-8 w-8 rounded-full border-2 border-indigo-100 object-cover shadow-md sm:h-9 sm:w-9 dark:border-indigo-900"
                            />
                        ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md sm:h-9 sm:w-9">
                                <span className="text-xs font-semibold text-white sm:text-sm">
                                    {getInitials(user.name)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 pb-3 lg:hidden">
                <div className="flex items-center rounded-lg border border-transparent bg-gray-50 px-3 py-2 transition-all focus-within:border-indigo-300 dark:bg-zinc-900">
                    <Search className="h-4 w-4 shrink-0 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar en mi tienda..."
                        className="ml-2 w-full border-none bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-gray-300"
                    />
                </div>
            </div>
        </header>
    );
}
