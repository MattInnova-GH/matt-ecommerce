import { Truck } from 'lucide-react';
import { useCheckoutStore, DELIVERY_COST } from '@/stores/checkoutStore';
import { formatPrice } from '../utils/checkout.utils';
import { DeliveryForm } from './DeliveryForm';
import { StoreSelector } from './StoreSelector';

export function DeliveryMethod() {
    const { deliveryMethod, setDeliveryMethod } = useCheckoutStore();

    const options = [
        {
            id: 'delivery' as const,
            label: 'Delivery',
            description: 'Recibe tu pedido en casa',
            badge: formatPrice(DELIVERY_COST),
            badgeColor: 'text-gray-900',
            icon: Truck,
        },
    ];

    return (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6">
            <div>
                <h2 className="mb-1 text-base font-semibold text-gray-900">
                    Método de entrega
                </h2>
                <p className="text-xs text-gray-400">
                    Elige cómo quieres recibir tu pedido
                </p>
            </div>

            {/* Selector */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {options.map((option) => {
                    const Icon = option.icon;
                    const isSelected = deliveryMethod === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={() => setDeliveryMethod(option.id)}
                            className={`flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                                isSelected
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            } `}
                        >
                            <div
                                className={`shrink-0 rounded-lg p-2 transition-colors ${isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                <Icon size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <p
                                        className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}
                                    >
                                        {option.label}
                                    </p>
                                    <span
                                        className={`text-xs font-semibold ${option.badgeColor}`}
                                    >
                                        {option.badge}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-gray-400">
                                    {option.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Formulario condicional */}
            {deliveryMethod === 'delivery' && <DeliveryForm />}
            {deliveryMethod === 'pickup' && <StoreSelector />}
        </div>
    );
}
