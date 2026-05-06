import Navbar from '@/Components/Shared/Navbar';
import Footer from '@/Components/Shared/Footer';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}
