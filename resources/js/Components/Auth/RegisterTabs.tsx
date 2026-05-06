import { useState } from 'react';
import { RegisterForm } from './RegisterForm';
import { SellerRegisterForm } from './SellerRegisterForm';

export function RegisterTabs() {
    const [tab, setTab] = useState<'client' | 'seller'>('client');

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 dark:border-zinc-800 mb-6">
                <button
                    onClick={() => setTab('client')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        tab === 'client'
                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Cliente
                </button>
                <button
                    onClick={() => setTab('seller')}
                    className={`pb-3 text-sm font-medium transition-colors ${
                        tab === 'seller'
                            ? 'text-emerald-600 border-b-2 border-emerald-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Vendedor
                </button>
            </div>

            {/* Banner vendedor */}
            {tab === 'seller' && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 text-sm text-emerald-800 dark:text-emerald-300 rounded-r-lg">
                    Completa tus datos y los de tu negocio. Tu solicitud será revisada en 24-48 horas.
                </div>
            )}

            {tab === 'client' ? <RegisterForm /> : <SellerRegisterForm />}
        </div>
    );
}
