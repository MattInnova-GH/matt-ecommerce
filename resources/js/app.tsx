import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';

import AdminLayout from '@/layouts/AdminLayout';
import 'leaflet/dist/leaflet.css';
import AppLayout from './layouts/AppLayout';

createInertiaApp({
    // No usamos VITE_APP_NAME como fallback porque queda fijo desde el
    // build y no refleja el nombre configurado en Configuracion. Si la
    // pagina no define un titulo propio, se conserva el que ya haya en
    // el documento (el que Laravel renderizo con el nombre real).
    title: (title) => (title ? `${title}` : document.title),
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
