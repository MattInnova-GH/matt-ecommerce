import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
    id: number;
    name: string;
    comment: string;
    rating: number;
    avatar?: string | null;
}

interface Props {
    reviews: Review[];
}

export default function TestimonialsSection({ reviews = [] }: Props) {
    if (reviews.length === 0) {
        return null;
    }

    // Double the reviews to create an endless loop effect
    const displayReviews = [...reviews, ...reviews];

    return (
        <section className="overflow-hidden bg-gray-50 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-center text-2xl font-light sm:mb-12 sm:text-3xl lg:text-4xl">
                    Lo que dicen nuestros clientes
                </h2>

                <div className="relative">
                    <div className="animate-marquee flex gap-6 py-4 whitespace-nowrap">
                        {displayReviews.map((testimonial, i) => (
                            <div
                                key={`${testimonial.id}-${i}`}
                                className="inline-block w-80 shrink-0 rounded-xl bg-white p-6 whitespace-normal shadow-sm transition-transform hover:scale-[1.02]"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-indigo-50">
                                        <AvatarImage
                                            src={
                                                testimonial.avatar || undefined
                                            }
                                        />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                            {testimonial.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {testimonial.name}
                                        </p>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, j) => (
                                                <Star
                                                    key={j}
                                                    className={`h-3 w-3 ${
                                                        j < testimonial.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'fill-gray-200 text-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-600 italic">
                                    "{testimonial.comment}"
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlays for smooth edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 to-transparent"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 to-transparent"></div>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
