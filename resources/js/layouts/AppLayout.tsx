import { AuthModal } from '@/Components/Shared/AuthModal';
import Chatbot from '@/Components/Shared/Chatbot';
import Footer from '@/Components/Shared/Footer';
import Navbar from '@/Components/Shared/Navbar';

import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultTab="login"
            />
            <Chatbot />
        </>
    );
}
