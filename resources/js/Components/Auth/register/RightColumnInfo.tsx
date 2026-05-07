import { Check, DollarSign, Shield, Truck } from 'lucide-react';

export default function RightColumnInfo() {
    const benefits = [
        {
            icon: <Check size={16} />,
            title: 'Llega a más clientes',
            description:
                'Miles de compradores visitan nuestra plataforma cada día',
        },
        {
            icon: <DollarSign size={16} />,
            title: 'Comisiones competitivas',
            description:
                'La comisión más baja del mercado, solo pagas por lo que vendes',
        },
        {
            icon: <Shield size={16} />,
            title: 'Pagos seguros',
            description:
                'Protegemos tu dinero y el de tus clientes en cada transacción',
        },
        {
            icon: <Truck size={16} />,
            title: 'Envíos integrados',
            description: 'Gestión de envíos fácil y con las mejores tarifas',
        },
    ];

    return (
        <div className="hidden flex-col justify-center bg-gray-50 px-12 lg:flex xl:px-20">
            <div className="mx-auto max-w-md">
                <div className="mb-10">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
                        <span className="text-xl font-bold text-white">T</span>
                    </div>
                    <h2 className="mb-3 text-2xl font-semibold text-gray-900">
                        Vende en la tienda más grande de Latinoamérica
                    </h2>
                    <p className="leading-relaxed text-gray-500">
                        Únete a miles de emprendedores que ya confían en
                        nosotros para hacer crecer su negocio.
                    </p>
                </div>

                <div className="space-y-6">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-8 w-8 rounded-full border-2 border-white bg-gray-300"
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            <span className="font-semibold text-gray-900">
                                +10,000
                            </span>{' '}
                            vendedores activos
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
