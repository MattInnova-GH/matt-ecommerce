import { AuthModal } from '@/Components/Shared/AuthModal';
import Navbar from '@/Components/Shared/Navbar';

import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>(
        'login',
    );

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultTab={authModalTab}
            />
        </>
    );
}
