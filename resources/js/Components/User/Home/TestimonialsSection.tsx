import { Star } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: 'María González',
            role: 'Cliente frecuente',
            comment:
                'Excelente servicio y productos de calidad. Los envíos son muy rápidos.',
            rating: 5,
        },
        {
            name: 'Carlos Rodríguez',
            role: 'Comprador verificado',
            comment:
                'Me encanta la variedad de productos. Siempre encuentro lo que busco.',
            rating: 5,
        },
        {
            name: 'Ana Martínez',
            role: 'Cliente premium',
            comment: 'El soporte al cliente es increíble. Muy recomendable.',
            rating: 5,
        },
    ];

    return (
        <section className="bg-gray-50 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-center text-2xl font-light sm:mb-12 sm:text-3xl lg:text-4xl">
                    Lo que dicen nuestros clientes
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className="rounded-xl bg-white p-6 shadow-sm"
                        >
                            <div className="mb-3 flex gap-1">
                                {[...Array(testimonial.rating)].map((_, j) => (
                                    <Star
                                        key={j}
                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <p className="mb-4 text-sm text-gray-600">
                                {testimonial.comment}
                            </p>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {testimonial.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {testimonial.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
