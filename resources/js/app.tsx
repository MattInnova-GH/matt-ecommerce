import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';

import AdminLayout from '@/layouts/AdminLayout';
import SellerLayout from '@/layouts/SellerLayout';
import AppLayout from '@/layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        // User Pages
        if (name.startsWith('User/')) {
            // Check if name is 'User/Home' or similar, you might want UserLayout
            // For now, if you want manual control in the page, keep null
            return null;
        }

        // Admin Pages
        if (name.startsWith('Admin/')) {
            return AdminLayout;
        }

        // Seller Pages
        if (name.startsWith('Seller/')) {
            return SellerLayout;
        }

        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                // Since AuthLayout was deleted/not found in your new layouts,
                // using AppLayout as fallback or you might need to create it.
                return AppLayout;
            case name.startsWith('settings/'):
                return AppLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return <TooltipProvider delayDuration={0}>{app}</TooltipProvider>;
    },
    progress: {
        color: '#4B5563',
    },
});
