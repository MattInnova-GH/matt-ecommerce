import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

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

export function SidebarNavItem({ item, isActive, isCollapsed }: SidebarNavItemProps) {
    const Icon = item.icon;

    return (
        <Link
            href={item.path}
            className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group
                ${isActive 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-900'}
                ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? item.name : undefined}
        >
            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            {!isCollapsed && (
                <span className="font-medium text-sm truncate">{item.name}</span>
            )}
            {!isCollapsed && item.badge && (
                <span className="ml-auto bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}
