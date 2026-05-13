import React, { useState } from 'react';
import { router, useForm, Head } from '@inertiajs/react';
import {
    ShoppingCart,
    Star,
    StarHalf,
    ArrowLeft,
    Package,
    Truck,
    Shield,
    RefreshCw,
    Minus,
    Plus,
    CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProductImage {
    id: number;
    image_url: string;
}

interface ReviewUser {
    id: number;
    first_name: string;
    avatar: string | null;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    user: ReviewUser;
    created_at: string;
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    thumbnail: string | null;
    images?: ProductImage[];
}

interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    thumbnail: string | null;
    images: ProductImage[];
    category?: { id: number; name: string };
    brand?: { id: number; name: string };
    reviews: Review[];
}

interface ProductDetailProps {
    product: ProductDetail;
    averageRating: number;
    totalReviews: number;
    relatedProducts: RelatedProduct[];
    canReview: boolean;
}

function ReviewForm({ productId }: { productId: number }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: productId,
        rating: 5,
        comment: '',
    });

    const [hover, setHover] = useState(0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reviews', {
            onSuccess: () => {
                reset('comment', 'rating');
                toast.success(
                    'Reseña enviada con éxito. Pendiente de aprobación.',
                );
            },
            onError: (err) => {
                if (err.review) {
                    toast.error(err.review as string);
                } else {
                    toast.error(
                        'Error al enviar la reseña. Por favor verifica los campos.',
                    );
                }
            },
        });
    };

    return (
        <Card className="mt-8 border-indigo-100 bg-indigo-50/30">
            <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Danos tu opinión</h3>
                <form onSubmit={submit} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            Calificación:
                        </span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-0.5 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-6 w-6 ${
                                            star <= (hover || data.rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-muted-foreground/30'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder="Cuéntanos tu experiencia con este producto..."
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            className="min-h-32 bg-white"
                            required
                        />
                        {errors.comment && (
                            <p className="text-xs text-destructive">
                                {errors.comment}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto"
                    >
                        {processing ? 'Enviando...' : 'Publicar reseña'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(amount);
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function RatingStars({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
        <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
                <Star
                    key={`full-${i}`}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                />
            ))}
            {hasHalfStar && (
                <StarHalf className="h-4 w-4 fill-amber-400 text-amber-400" />
            )}
            {[...Array(Math.max(0, emptyStars))].map((_, i) => (
                <Star
                    key={`empty-${i}`}
                    className="h-4 w-4 text-muted-foreground/30"
                />
            ))}
        </div>
    );
}

export default function ProductDetail({
    product,
    averageRating,
    totalReviews,
    relatedProducts,
    canReview,
}: ProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(
        product.thumbnail
            ? product.thumbnail.startsWith('http')
                ? product.thumbnail
                : `/storage/${product.thumbnail}`
            : null,
    );
    const [quantity, setQuantity] = useState(1);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const { addItem, openCart } = useCartStore();

    // Combinar thumbnail con galería, evitando duplicados
    const allImages: ProductImage[] = [
        ...(product.thumbnail ? [{ id: 0, image_url: product.thumbnail }] : []),
        ...product.images.filter((img) => img.image_url !== product.thumbnail),
    ];

    const addToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.thumbnail
                ? product.thumbnail.startsWith('http')
                    ? product.thumbnail
                    : `/storage/${product.thumbnail}`
                : '',
            category: product.category?.name || 'General',
        });
        openCart();
    };

    const handleProcessPayment = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.thumbnail
                ? product.thumbnail.startsWith('http')
                    ? product.thumbnail
                    : `/storage/${product.thumbnail}`
                : '',
            category: product.category?.name || 'General',
        });
        router.get('/checkout');
    };

    console.log('DETALLES DEL PRODUCTO::', product);

    return (
        <ScrollArea className="h-full">
            <Head title={product.name} />
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 lg:px-8">
                    {/* Breadcrumb / Volver */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.get('/productos')}
                        className="mb-6 gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al catálogo
                    </Button>

                    {/* Producto principal */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Galería de imágenes */}
                        <div className="space-y-4">
                            <Dialog
                                open={isImageDialogOpen}
                                onOpenChange={setIsImageDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <div className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted">
                                        {selectedImage ? (
                                            <img
                                                src={selectedImage}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package className="h-16 w-16 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </div>
                                </DialogTrigger>
                                {selectedImage && (
                                    <DialogContent className="max-w-4xl">
                                        <img
                                            src={selectedImage}
                                            alt={product.name}
                                            className="h-auto w-full rounded-lg"
                                        />
                                    </DialogContent>
                                )}
                            </Dialog>
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-5 gap-2">
                                    {allImages.map((img, index) => {
                                        const imgUrl = img.image_url.startsWith(
                                            'http',
                                        )
                                            ? img.image_url
                                            : `/storage/${img.image_url}`;

                                        return (
                                            <div key={img.id ?? index}>
                                                <button
                                                    onClick={() =>
                                                        setSelectedImage(imgUrl)
                                                    }
                                                    className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                                                        selectedImage === imgUrl
                                                            ? 'border-primary ring-2 ring-primary'
                                                            : 'hover:border-primary/50'
                                                    }`}
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt={`${product.name} - ${index + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Información del producto */}
                        <div className="space-y-6">
                            <div>
                                {product.category && (
                                    <p className="mb-1 text-sm font-medium text-muted-foreground">
                                        {product.category.name}
                                    </p>
                                )}
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {product.name}
                                </h1>
                                <div className="mt-2 flex items-center gap-3">
                                    <RatingStars rating={averageRating} />
                                    <span className="text-sm font-medium">
                                        {averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        ({totalReviews}{' '}
                                        {totalReviews === 1
                                            ? 'opinión'
                                            : 'opiniones'}
                                        )
                                    </span>
                                    {product.brand && (
                                        <>
                                            <Separator
                                                orientation="vertical"
                                                className="h-4"
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                Marca: {product.brand.name}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <span className="text-3xl font-bold text-primary">
                                    {formatCurrency(product.price)}
                                </span>
                                <div className="mt-2">
                                    {product.stock > 0 ? (
                                        <Badge
                                            variant="outline"
                                            className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                        >
                                            En stock ({product.stock} unidades)
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive">
                                            Sin stock
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold">Descripción</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {product.description ||
                                        'Sin descripción disponible'}
                                </p>
                            </div>

                            <Separator />

                            {/* Cantidad y carrito */}
                            <div className="space-y-4">
                                {product.stock > 0 && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium">
                                            Cantidad:
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            quantity - 1,
                                                        ),
                                                    )
                                                }
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-12 text-center font-medium">
                                                {quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.min(
                                                            product.stock,
                                                            quantity + 1,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    quantity >= product.stock
                                                }
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col gap-3">
                                    <Button
                                        size="lg"
                                        className="w-full gap-2"
                                        disabled={product.stock === 0}
                                        onClick={addToCart}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        {product.stock === 0
                                            ? 'Sin stock'
                                            : 'Agregar al carrito'}
                                    </Button>
                                    {product.stock > 0 && (
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="w-full gap-2"
                                            onClick={handleProcessPayment}
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            Procesar pago
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Beneficios */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    {
                                        icon: Truck,
                                        title: 'Envío rápido',
                                        sub: 'Entrega en 3-5 días',
                                    },
                                    {
                                        icon: Shield,
                                        title: 'Garantía',
                                        sub: '30 días de garantía',
                                    },
                                    {
                                        icon: RefreshCw,
                                        title: 'Devoluciones',
                                        sub: 'Hasta 7 días después',
                                    },
                                    {
                                        icon: Package,
                                        title: 'Embalaje seguro',
                                        sub: 'Protegido durante el envío',
                                    },
                                ].map(({ icon: Icon, title, sub }) => (
                                    <div
                                        key={title}
                                        className="flex items-center gap-3 rounded-lg border p-3"
                                    >
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {sub}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Opiniones */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                Opiniones de clientes
                            </h2>
                        </div>

                        {canReview && <ReviewForm productId={product.id} />}

                        <div className="mt-8">
                            {product.reviews.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center">
                                        <p className="text-muted-foreground">
                                            No hay opiniones disponibles para
                                            este producto todavía.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {product.reviews.map((review) => (
                                        <Card key={review.id}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                                                    <div className="flex flex-1 gap-4">
                                                        <Avatar className="h-10 w-10 border border-indigo-50">
                                                            <AvatarImage
                                                                src={
                                                                    review.user
                                                                        .avatar
                                                                        ? `/storage/${review.user.avatar}`
                                                                        : undefined
                                                                }
                                                            />
                                                            <AvatarFallback className="bg-indigo-50 text-indigo-600">
                                                                {review.user.first_name.charAt(
                                                                    0,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold">
                                                                    {
                                                                        review
                                                                            .user
                                                                            .first_name
                                                                    }
                                                                </span>
                                                                <RatingStars
                                                                    rating={
                                                                        review.rating
                                                                    }
                                                                />
                                                            </div>
                                                            <p className="mt-2 text-sm text-muted-foreground">
                                                                {review.comment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground sm:text-right">
                                                        {formatDate(
                                                            review.created_at,
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Productos relacionados */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="mb-6 text-2xl font-bold">
                                Productos relacionados
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {relatedProducts.map((related) => (
                                    <Card
                                        key={related.id}
                                        className="group overflow-hidden transition-shadow hover:shadow-lg"
                                    >
                                        <a href={`/productos/${related.slug}`}>
                                            <div className="relative aspect-square overflow-hidden bg-muted">
                                                {related.thumbnail ? (
                                                    <img
                                                        src={`/storage/${related.thumbnail}`}
                                                        alt={related.name}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package className="h-12 w-12 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>
                                        </a>
                                        <CardContent className="p-4">
                                            <a
                                                href={`/productos/${related.slug}`}
                                            >
                                                <h3 className="line-clamp-2 font-semibold hover:text-primary">
                                                    {related.name}
                                                </h3>
                                            </a>
                                            <p className="mt-2 text-xl font-bold text-primary">
                                                {formatCurrency(related.price)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
}
