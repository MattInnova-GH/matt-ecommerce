import { AuthModal } from '@/Components/Shared/AuthModal';
import UserMenu from '@/Components/Shared/UserMenu';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>(
        'login',
    );

    const handleOpenAuthModal = (type: 'login' | 'logout') => {
        if (type === 'logout') {
            // Manejar logout con Inertia
            router.post(route('logout'));
        } else {
            setAuthModalTab(type);
            setIsAuthModalOpen(true);
        }
    };

    return (
        <>
            <header className="border-b border-gray-200">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <a href="/" className="text-xl font-bold">
                        ZonaRetail
                    </a>
                    <UserMenu onOpenAuthModal={handleOpenAuthModal} />
                </div>
            </header>
            <main>{children}</main>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultTab={authModalTab}
            />
        </>
    );
}
