import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm font-medium tracking-widest text-gray-400 uppercase">
                        Total Ventas
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        $0.00
                    </p>
                </div>
                <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm font-medium tracking-widest text-gray-400 uppercase">
                        Nuevos Usuarios
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        0
                    </p>
                </div>
                <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm font-medium tracking-widest text-gray-400 uppercase">
                        Pedidos Pendientes
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        0
                    </p>
                </div>
            </div>
            <div className="mt-4 min-h-[100vh] rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Actividad Reciente
                </h2>
                <p className="text-gray-500">
                    No hay actividad reciente para mostrar.
                </p>
            </div>
        </AdminLayout>
    );
}
