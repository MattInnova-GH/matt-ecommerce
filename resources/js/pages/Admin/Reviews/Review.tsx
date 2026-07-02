import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Star,
    Search,
    Trash2,
    CheckCircle,
    MessageCircle,
    Package,
    Calendar,
    MoreHorizontal,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Review {
    id: number;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        avatar: string | null;
    };
    product: {
        id: number;
        name: string;
        slug: string;
        image: string | null;
        price: number;
    };
}

interface Props {
    reviews: Review[];
}

export default function Review({ reviews }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
    const [reviewToApprove, setReviewToApprove] = useState<Review | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const filtered = reviews.filter((review) => {
        const matchSearch =
            review.user.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            review.user.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            review.product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase());

        const matchRating =
            ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
        const matchStatus =
            statusFilter === 'all' ||
            (statusFilter === 'approved' && review.is_approved) ||
            (statusFilter === 'pending' && !review.is_approved);

        return matchSearch && matchRating && matchStatus;
    });

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
              ).toFixed(1)
            : 0;

    const approvedReviewsCount = reviews.filter((r) => r.is_approved).length;

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((review) => {
            distribution[review.rating as keyof typeof distribution]++;
        });

        return distribution;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const handleDelete = () => {
        if (!reviewToDelete) {
            return;
        }

        setIsProcessing(true);

        router.delete(`/admin/reviews/${reviewToDelete.id}`, {
            onSuccess: () => {
                setReviewToDelete(null);
                toast.success('Reseña eliminada exitosamente');
                setIsProcessing(false);
            },
            onError: () => {
                toast.error('Error al eliminar la reseña');
                setIsProcessing(false);
            },
        });
    };

    const handleApprove = () => {
        if (!reviewToApprove) {
            return;
        }

        setIsProcessing(true);

        router.post(
            `/admin/reviews/${reviewToApprove.id}/approve`,
            {},
            {
                onSuccess: () => {
                    setReviewToApprove(null);
                    toast.success('Reseña aprobada exitosamente');
                    setIsProcessing(false);
                },
                onError: () => {
                    toast.error('Error al aprobar la reseña');
                    setIsProcessing(false);
                },
            },
        );
    };

    const distribution = getRatingDistribution();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Reseñas
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona las reseñas y comentarios de productos
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Reseñas
                        </CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {reviews.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Reseñas recibidas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Calificación Promedio
                        </CardTitle>
                        <Star className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {averageRating}
                        </div>
                        <div className="mt-1">
                            {renderStars(parseFloat(averageRating as string))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Reseñas Aprobadas
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {approvedReviewsCount}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Mostrando en la tienda
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Rating Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Distribución de Calificaciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div
                                key={rating}
                                className="flex items-center gap-4"
                            >
                                <div className="flex w-16 items-center gap-1">
                                    <span className="text-sm font-medium">
                                        {rating}
                                    </span>
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full rounded-full bg-yellow-400 transition-all"
                                            style={{
                                                width: `${reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-12 text-right text-sm text-gray-600">
                                    {
                                        distribution[
                                            rating as keyof typeof distribution
                                        ]
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por usuario, producto o comentario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Calificación" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las estrellas</SelectItem>
                        <SelectItem value="5">5 estrellas</SelectItem>
                        <SelectItem value="4">4 estrellas</SelectItem>
                        <SelectItem value="3">3 estrellas</SelectItem>
                        <SelectItem value="2">2 estrellas</SelectItem>
                        <SelectItem value="1">1 estrella</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="approved">Aprobadas</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Usuario</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Calificación</TableHead>
                            <TableHead className="max-w-md">
                                Comentario
                            </TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <MessageCircle className="mb-2 h-8 w-8" />
                                        <p>No se encontraron reseñas</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((review) => (
                                <TableRow
                                    key={review.id}
                                    className="hover:bg-gray-50"
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={
                                                        review.user.avatar ||
                                                        undefined
                                                    }
                                                />
                                                <AvatarFallback className="bg-indigo-100 text-xs text-indigo-600">
                                                    {review.user.first_name.charAt(
                                                        0,
                                                    )}
                                                    {review.user.last_name.charAt(
                                                        0,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {review.user.first_name}{' '}
                                                    {review.user.last_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {review.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {review.product.image ? (
                                                <img
                                                    src={
                                                        '/storage/' +
                                                        review.product.image
                                                    }
                                                    alt={review.product.name}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <Package className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {review.product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    S/ {review.product.price}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {renderStars(review.rating)}
                                            <p className="text-xs text-gray-500">
                                                {review.rating} de 5 estrellas
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="line-clamp-2 text-sm text-gray-600">
                                            {review.comment}
                                        </p>
                                        {review.comment.length > 100 && (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="link"
                                                        className="h-auto p-0 text-xs"
                                                    >
                                                        Ver más
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Comentario completo
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="mt-4">
                                                        <div className="mb-4 flex items-center gap-2">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage
                                                                    src={
                                                                        review
                                                                            .user
                                                                            .avatar ||
                                                                        undefined
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {review.user.first_name.charAt(
                                                                        0,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">
                                                                    {
                                                                        review
                                                                            .user
                                                                            .first_name
                                                                    }{' '}
                                                                    {
                                                                        review
                                                                            .user
                                                                            .last_name
                                                                    }
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    {renderStars(
                                                                        review.rating,
                                                                    )}
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatDate(
                                                                            review.created_at,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(review.created_at)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {review.is_approved ? (
                                            <Badge className="bg-green-100 text-green-700">
                                                Aprobada
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-yellow-100 text-yellow-700">
                                                Pendiente
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Acciones
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {!review.is_approved && (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setReviewToApprove(
                                                                review,
                                                            )
                                                        }
                                                        className="text-green-600"
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Aceptar Reseña
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setReviewToDelete(
                                                            review,
                                                        )
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar Reseña
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog
                open={!!reviewToDelete}
                onOpenChange={() => setReviewToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar Reseña</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de eliminar esta reseña de{' '}
                            <strong>
                                {reviewToDelete?.user.first_name}{' '}
                                {reviewToDelete?.user.last_name}
                            </strong>
                            ? Esta acción eliminará el comentario
                            permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Approve Confirmation */}
            <AlertDialog
                open={!!reviewToApprove}
                onOpenChange={() => setReviewToApprove(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Aprobar Reseña</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de aprobar esta reseña de{' '}
                            <strong>
                                {reviewToApprove?.user.first_name}{' '}
                                {reviewToApprove?.user.last_name}
                            </strong>
                            ? Una vez aprobada, será visible para todos los
                            clientes en la tienda.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Aprobando...
                                </>
                            ) : (
                                'Aprobar'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
