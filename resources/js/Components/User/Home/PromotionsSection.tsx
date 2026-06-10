// resources/js/Components/User/Home/PromotionsSection.tsx
import { Link } from '@inertiajs/react';
import { Percent, Calendar, Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type PromotionCategory = {
    id: number;
    name: string;
    slug: string;
    imageUrl?: string | null;
};

type Promotion = {
    id: number;
    name: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    discount_badge: string;
    starts_at: string;
    ends_at: string;
    category: PromotionCategory | null;
};

type Props = {
    promotions: Promotion[];
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function PromotionsSection({ promotions }: Props) {
    // Si no hay promociones activas, no mostrar nada
    if (!promotions || promotions.length === 0) {
        return null;
    }

    return (
        <section className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 py-12 md:py-16">
            <div className="container mx-auto px-4">
                {/* Encabezado */}
                <div className="mb-10 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
                        <Percent className="h-4 w-4" />
                        Ofertas Especiales
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Promociones Activas
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                        Aprovecha los descuentos exclusivos por tiempo limitado
                        en nuestras categorías
                    </p>
                </div>

                {/* Grid de promociones */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {promotions.map((promo) => (
                        <Link
                            key={promo.id}
                            href={`/categorias/${promo.category?.slug}`}
                            className="group block"
                        >
                            <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-48 overflow-hidden">
                                    {/* Imagen de fondo */}
                                    {promo.category?.imageUrl ? (
                                        <img
                                            src={promo.category.imageUrl}
                                            alt={promo.category.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-400 to-orange-500">
                                            <Tag className="h-16 w-16 text-white/30" />
                                        </div>
                                    )}

                                    {/* Overlay oscuro para texto */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                    {/* Badge de descuento grande */}
                                    <div className="absolute top-4 right-4">
                                        <div className="rounded-full bg-red-500 px-4 py-2 text-center shadow-lg">
                                            <span className="text-2xl font-bold text-white">
                                                {promo.discount_badge}
                                            </span>
                                            <span className="ml-1 text-xs font-medium text-white/90">
                                                {promo.discount_type ===
                                                'percentage'
                                                    ? 'OFF'
                                                    : 'DSCTO'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Información en la imagen */}
                                    <div className="absolute right-4 bottom-4 left-4">
                                        <Badge className="mb-2 bg-white/90 text-gray-900 hover:bg-white/90">
                                            {promo.name}
                                        </Badge>
                                        <h3 className="text-2xl font-bold text-white">
                                            {promo.category?.name}
                                        </h3>
                                        <p className="mt-1 line-clamp-2 text-sm text-white/80">
                                            {promo.description ||
                                                `¡${promo.discount_badge} de descuento en toda la categoría!`}
                                        </p>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>
                                                Hasta{' '}
                                                {formatDate(promo.ends_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 font-medium text-primary transition-all group-hover:gap-2">
                                            <span>Ver productos</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
