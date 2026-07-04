import { AuthModal } from '@/Components/Shared/AuthModal';
import Chatbot from '@/Components/Shared/Chatbot';
import Footer from '@/Components/Shared/Footer';
import Navbar from '@/Components/Shared/Navbar';
import { Toaster } from '@/components/ui/sonner';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <div className="hidden lg:block">
                <Footer />
            </div>
            <AuthModal />
            <Chatbot />
            <Toaster richColors />
        </>
    );
}
