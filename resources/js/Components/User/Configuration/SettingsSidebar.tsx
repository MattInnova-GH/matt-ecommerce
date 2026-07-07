import React from 'react';
import {
    User as UserIcon,
    Settings,
    LogOut,
    ShoppingBag,
    ChevronRight,
    Heart,
    ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Section, User } from './types/settings';

interface SettingsSidebarProps {
    user: User;
    activeSection: Section;
    onSectionChange: (section: Section) => void;
    onLogout: () => void;
}

function getInitials(first: string, last: string) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

const navItems: {
    id: Section | 'logout';
    label: string;
    icon: React.ElementType;
}[] = [
    { id: 'profile', label: 'Mi Perfil', icon: UserIcon },
    { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBag },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'password', label: 'Configuración', icon: Settings },
    { id: 'security', label: 'Seguridad', icon: ShieldCheck },
    { id: 'logout', label: 'Cerrar sesión', icon: LogOut },
];

export function SettingsSidebar({
    user,
    activeSection,
    onSectionChange,
    onLogout,
}: SettingsSidebarProps) {
    return (
        <aside className="w-full lg:w-64 lg:shrink-0">
            <Card className="overflow-hidden">
                <div className="flex items-center gap-3 bg-muted/50 p-5">
                    {user.avatar ? (
                        <img
                            src={`/storage/${user.avatar}`}
                            alt="Avatar"
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-2 ring-border">
                            {getInitials(user.first_name, user.last_name)}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
                <Separator />
                <nav className="p-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        const isLogout = item.id === 'logout';

                        if (isLogout) {
                            return (
                                <React.Fragment key={item.id}>
                                    <Separator className="my-2" />
                                    <button
                                        onClick={onLogout}
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        {item.label}
                                    </button>
                                </React.Fragment>
                            );
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() =>
                                    onSectionChange(item.id as Section)
                                }
                                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {item.label}
                                {isActive && (
                                    <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />
                                )}
                            </button>
                        );
                    })}
                </nav>
            </Card>
        </aside>
    );
}
