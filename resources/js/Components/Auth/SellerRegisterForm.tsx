import { useForm } from '@inertiajs/react';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2, FileText, CreditCard, Store } from 'lucide-react';
import { useState } from 'react';

const BUSINESS_TYPES = ['Tecnología', 'Ropa y moda', 'Alimentos', 'Electrónica', 'Hogar', 'Deportes', 'Salud', 'Otro'];

export function SellerRegisterForm() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        business_name: '',
        business_type: '',
        tax_id_type: '',
        tax_id_number: '',
        address: '',
        experience: '',
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register')); // Debes configurar el controller para manejar esto
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Datos Personales</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nombre" className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
                    <input value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="Apellido" className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
                </div>
                <input value={data.email} onChange={e => setData('email', e.target.value)} type="email" placeholder="Correo electrónico" className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
                <input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="Celular" className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pt-2">Datos del Negocio</h3>
                <input value={data.business_name} onChange={e => setData('business_name', e.target.value)} placeholder="Nombre del negocio" className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
                
                <div className="grid grid-cols-2 gap-4">
                    <select value={data.business_type} onChange={e => setData('business_type', e.target.value)} className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white">
                        <option value="">Tipo de negocio</option>
                        {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input value={data.tax_id_number} onChange={e => setData('tax_id_number', e.target.value)} placeholder="RUC / DNI" className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
                </div>
                <input value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Dirección" className="w-full px-4 py-2.5 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" />
            </div>

            <button disabled={processing} className="w-full py-3 bg-black dark:bg-white dark:text-black text-white rounded-lg font-bold flex items-center justify-center gap-2">
                {processing && <Loader2 className="animate-spin" size={18} />}
                Solicitar cuenta de vendedor
            </button>
        </form>
    );
}
