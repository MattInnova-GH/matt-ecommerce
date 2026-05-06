import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';
import { LoginForm } from '@/Components/Auth/LoginForm';

export default function Login() {
    return (
        <UserLayout>
            <Head title="Iniciar Sesión" />
            <div className="mx-auto max-w-md px-4 py-20">
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                        Bienvenido de nuevo
                    </h1>
                    <LoginForm />
                </div>
            </div>
        </UserLayout>
    );
}
