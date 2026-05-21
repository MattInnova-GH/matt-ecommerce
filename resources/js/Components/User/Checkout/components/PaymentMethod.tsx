import { Banknote, Smartphone } from 'lucide-react';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { TransferModal } from './TransferModal';
import { YapeModal } from './YapeModal';

export function PaymentMethod() {
    const {
        paymentMethod,
        setPaymentMethod,
        openTransferModal,
        openYapeModal,
        isTransferModalOpen,
        isYapeModalOpen,
    } = useCheckoutStore();

    const options = [
        {
            id: 'transfer' as const,
            label: 'Transferencia',
            description: 'Cuenta bancaria / CCI',
            icon: Banknote,
        },
        {
            id: 'yape' as const,
            label: 'Yape',
            description: 'Código o QR de pago',
            icon: Smartphone,
        },
    ];

    const handleSelect = (id: 'transfer' | 'yape') => {
        setPaymentMethod(id);
        if (id === 'transfer') openTransferModal();
        if (id === 'yape') openYapeModal();
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="mb-1 text-base font-semibold text-gray-900">
                Método de pago
            </h2>
            <p className="mb-5 text-xs text-gray-400">
                Selecciona cómo deseas pagar
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = paymentMethod === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                                isSelected
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div
                                className={`rounded-xl p-3 transition-colors ${isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                <Icon size={20} />
                            </div>
                            <div>
                                <p
                                    className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}
                                >
                                    {option.label}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">
                                    {option.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {isTransferModalOpen && <TransferModal />}
            {isYapeModalOpen && <YapeModal />}
        </div>
    );
}
