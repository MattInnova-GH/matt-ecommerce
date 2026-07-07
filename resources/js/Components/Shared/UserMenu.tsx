import { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import UserDropdown from './UserDropdown';

type User = {
    name: string;
    last_name?: string;
    email: string;
    role: 'client' | 'admin';
    image?: string;
};

type Props = {
    user: User | null;
    onOpenLogin: () => void;
};

export default function UserMenu({ user, onOpenLogin }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) {
        return (
            <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-gray-100 hover:opacity-70"
                aria-label="Iniciar sesión"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                    <User size={16} className="text-gray-500" />
                </div>
            </button>
        );
    }

    const firstName = user.name.split(' ')[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 rounded-lg border px-2 py-1 transition hover:bg-gray-100 ${
                    isOpen
                        ? 'border-gray-300 bg-gray-100 ring-2 ring-gray-900/10'
                        : 'border-transparent hover:opacity-70'
                }`}
                aria-label="Menú de usuario"
                aria-expanded={isOpen}
            >
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-gray-100 transition-colors ${
                        isOpen ? 'border-gray-900' : 'border-gray-200'
                    }`}
                >
                    {user.image ? (
                        <img
                            src={'/storage/' + user.image}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <User size={16} className="text-gray-500" />
                    )}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 md:block">
                    {firstName}
                </span>
                <ChevronDown
                    size={16}
                    className={`hidden transition-transform duration-200 md:block ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <UserDropdown user={user} onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
}
