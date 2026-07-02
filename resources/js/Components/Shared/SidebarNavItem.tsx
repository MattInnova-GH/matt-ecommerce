import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
    badge?: string | null;
}

interface SidebarNavItemProps {
    item: NavItem;
    isActive: boolean;
    isCollapsed: boolean;
}

export function SidebarNavItem({
    item,
    isActive,
    isCollapsed,
}: SidebarNavItemProps) {
    const Icon = item.icon;

    return (
        <Link
            href={item.path}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100'
            } ${isCollapsed ? 'justify-center' : ''} `}
            title={isCollapsed ? item.name : undefined}
        >
            <Icon
                className={`h-5 w-5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`}
            />
            {!isCollapsed && (
                <span className="truncate text-sm font-medium">
                    {item.name}
                </span>
            )}
            {!isCollapsed && item.badge && (
                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}
