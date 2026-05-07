import { Clock, RefreshCw, Shield, Truck } from 'lucide-react';

export default function BenefitsBar() {
    const benefits = [
        {
            icon: Truck,
            title: 'Envío gratis',
            description: 'En compras mayores a $50',
        },
        {
            icon: Shield,
            title: 'Compra segura',
            description: 'Protegemos tus datos',
        },
        {
            icon: RefreshCw,
            title: '30 días',
            description: 'Devoluciones fáciles',
        },
        {
            icon: Clock,
            title: '24/7 Soporte',
            description: 'Atención al cliente',
        },
    ];

    return (
        <div className="border-y border-gray-200 bg-gray-50 py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <benefit.icon className="w-5shrink-0 h-5 text-gray-600" />
                            <div>
                                <p className="text-xs font-medium text-gray-900 sm:text-sm">
                                    {benefit.title}
                                </p>
                                <p className="hidden text-xs text-gray-500 sm:block">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
