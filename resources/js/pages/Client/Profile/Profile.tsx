import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import type {
    Section,
    SettingsProps,
} from '@/Components/User/Configuration/types/settings';
import { SettingsSidebar } from '@/Components/User/Configuration/SettingsSidebar';
import { ProfileSection } from '@/Components/User/Configuration/ProfileSection';
import { PasswordSection } from '@/Components/User/Configuration/PasswordSection';
import { TwoFactorSection } from '@/Components/User/Configuration/TwoFactorSection';
import { AddressesSection } from '@/Components/User/Configuration/AddressesSection';
import { OrderSection } from '@/Components/User/Configuration/OrderSection';
import { FavoritesSection } from '@/Components/User/Configuration/FavoritesSection';

export default function SettingsPage({
    user,
    addresses,
    orders,
    favorites,
    twoFactorEnabled,
    flash,
}: SettingsProps) {
    const VALID_SECTIONS: Section[] = [
        'profile',
        'password',
        'security',
        'addresses',
        'orders',
        'favorites',
    ];

    const { url } = usePage();
    // Get section from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const initialSection = (urlParams.get('section') as Section) || 'profile';

    const [activeSection, setActiveSection] = useState<Section>(
        VALID_SECTIONS.includes(initialSection) ? initialSection : 'profile',
    );

    // Update section when URL changes (e.g. clicking "Mis Compras" from header while on profile)
    const [prevUrl, setPrevUrl] = useState(url);
    if (url !== prevUrl) {
        setPrevUrl(url);
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section') as Section;
        if (section && VALID_SECTIONS.includes(section)) {
            setActiveSection(section);
        }
    }

    const handleLogout = () => {
        router.post('/logout');
    };

    const sectionLabels: Record<Section, string> = {
        profile: 'Mi Perfil',
        password: 'Configuración',
        security: 'Seguridad',
        addresses: 'Direcciones',
        orders: 'Mis Pedidos',
        favorites: 'Favoritos',
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Mi Cuenta
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestiona tu información personal y preferencias
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                    <SettingsSidebar
                        user={user}
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                        onLogout={handleLogout}
                    />

                    <main className="min-w-0 flex-1">
                        <p className="mb-4 text-xs text-muted-foreground lg:hidden">
                            Mi Cuenta &rsaquo;{' '}
                            <span className="font-medium text-foreground">
                                {sectionLabels[activeSection]}
                            </span>
                        </p>
                        <Card>
                            <CardContent className="p-6 sm:p-8">
                                {activeSection === 'profile' && (
                                    <ProfileSection
                                        user={user}
                                        flash={flash?.success}
                                    />
                                )}
                                {activeSection === 'password' && (
                                    <PasswordSection flash={flash?.success} />
                                )}
                                {activeSection === 'security' && (
                                    <TwoFactorSection
                                        enabled={twoFactorEnabled}
                                    />
                                )}
                                {activeSection === 'addresses' && (
                                    <AddressesSection
                                        addresses={addresses}
                                        flash={flash?.success}
                                    />
                                )}
                                {activeSection === 'orders' && (
                                    <OrderSection orders={orders} />
                                )}
                                {activeSection === 'favorites' && (
                                    <FavoritesSection favorites={favorites} />
                                )}
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
}
