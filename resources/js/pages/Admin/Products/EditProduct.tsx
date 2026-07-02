import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Plus,
    Trash2,
    Upload,
    Save,
    Package,
    ImageIcon,
    Tags,
    Info,
    ArrowLeft,
    X,
    AlertCircle,
} from 'lucide-react';
import admin from '@/routes/admin';

interface VariantField {
    id: string;
    name: string;
    value: string;
    stock: number;
    price: number | '';
}

interface ProductImage {
    id: number;
    image_url: string;
}

interface ProductVariant {
    id: number;
    name: string;
    value: string;
    stock: number;
    price: number | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    category_id: number | null;
    brand_id: number | null;
    supplier_id: number | null;
    thumbnail: string | null;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    images?: ProductImage[];
    variants?: ProductVariant[];
}

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface EditProductProps {
    product: Product;
    categories: Category[];
    brands: Brand[];
    suppliers: Supplier[];
}

export default function EditProduct({
    product,
    categories,
    brands,
}: EditProductProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        product.thumbnail ? `/storage/${product.thumbnail}` : null,
    );
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>(
        product.images || [],
    );

    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category_id: product.category_id?.toString() || '',
        brand_id: product.brand_id?.toString() || '',
        supplier_id: product.supplier_id?.toString() || '',
        thumbnail: null as File | null,
        gallery: [] as File[],
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        variants: (product.variants && product.variants.length > 0)
            ? product.variants.map((v) => ({
                id: v.id.toString(),
                name: v.name,
                value: v.value,
                stock: v.stock,
                price: (v.price ?? '') as number | '',
            }))
            : [{ id: '1', name: '', value: '', stock: 0, price: '' as number | '' }] as VariantField[],
        deleted_images: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(admin.products.update(product.id).url, {
            preserveScroll: true,
            onSuccess: () => {},
        });
    };

    const addVariant = () => {
        setData('variants', [
            ...data.variants,
            { id: Date.now().toString(), name: '', value: '', stock: 0, price: '' },
        ]);
    };

    const removeVariant = (id: string) => {
        if (data.variants.length > 1) {
            setData('variants', data.variants.filter((v) => v.id !== id));
        }
    };

    const updateVariant = (id: string, field: keyof VariantField, value: string | number) => {
        setData('variants', data.variants.map((v) =>
            v.id === id ? { ...v, [field]: value } : v,
        ));
    };

    const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () =>
                setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setThumbnailPreview(null);
        setData('thumbnail', null);
    };

    const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('gallery', [...data.gallery, ...files]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryPreviews((prev) => [
                    ...prev,
                    reader.result as string,
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeExistingImage = (id: number) => {
        setData('deleted_images', [...data.deleted_images, id]);
        setExistingImages(existingImages.filter((img) => img.id !== id));
    };

    const removeNewGalleryImage = (index: number) => {
        setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
        const newGallery = [...data.gallery];
        newGallery.splice(index, 1);
        setData('gallery', newGallery);
    };

    const totalStock =
        parseInt(data.stock || '0') +
        data.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={admin.products.index()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div className="space-y-0.5">
                            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                                Editar Producto
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Actualizando:{' '}
                                <span className="font-medium text-foreground">
                                    {product.name}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={admin.products.index()}>
                            <Button variant="outline" size="default">
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="gap-2 shadow-sm"
                        >
                            <Save className="h-4 w-4" />
                            {processing
                                ? 'Actualizando...'
                                : 'Actualizar Producto'}
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Columna principal */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="overflow-hidden border shadow-sm">
                                <Tabs
                                    value={activeTab}
                                    onValueChange={setActiveTab}
                                    className="w-full"
                                >
                                    <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                                        <TabsTrigger
                                            value="basic"
                                            className="gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                                        >
                                            <Package className="h-4 w-4" />
                                            Información
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="images"
                                            className="gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                                        >
                                            <ImageIcon className="h-4 w-4" />
                                            Imágenes
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="variants"
                                            className="gap-2 rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                                        >
                                            <Tags className="h-4 w-4" />
                                            Variantes
                                        </TabsTrigger>
                                    </TabsList>

                                    <CardContent className="p-6">
                                        {/* Información Básica */}
                                        <TabsContent
                                            value="basic"
                                            className="mt-0 space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="name"
                                                        className="text-sm font-medium"
                                                    >
                                                        Nombre del producto{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Ej: Camiseta de algodón premium"
                                                        className={
                                                            errors.name
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                    />
                                                    {errors.name && (
                                                        <p className="flex items-center gap-1 text-xs text-destructive">
                                                            <AlertCircle className="h-3 w-3" />
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="description"
                                                        className="text-sm font-medium"
                                                    >
                                                        Descripción
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        value={data.description}
                                                        onChange={(e) =>
                                                            setData(
                                                                'description',
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows={6}
                                                        placeholder="Describe las características principales del producto..."
                                                        className="resize-none"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Una buena descripción
                                                        ayuda a los clientes a
                                                        entender mejor tu
                                                        producto.
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="price"
                                                        className="text-sm font-medium"
                                                    >
                                                        Precio{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                                                            S/
                                                        </span>
                                                        <Input
                                                            id="price"
                                                            type="number"
                                                            step="0.01"
                                                            value={data.price}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'price',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`pl-7 ${errors.price ? 'border-destructive' : ''}`}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    {errors.price && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.price}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="stock"
                                                        className="text-sm font-medium"
                                                    >
                                                        Stock base{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="stock"
                                                        type="number"
                                                        value={data.stock}
                                                        onChange={(e) =>
                                                            setData(
                                                                'stock',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={
                                                            errors.stock
                                                                ? 'border-destructive'
                                                                : ''
                                                        }
                                                        placeholder="0"
                                                    />
                                                    {errors.stock && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.stock}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        Categoría{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Select
                                                        value={data.category_id}
                                                        onValueChange={(val) =>
                                                            setData(
                                                                'category_id',
                                                                val,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className={
                                                                errors.category_id
                                                                    ? 'border-destructive'
                                                                    : ''
                                                            }
                                                        >
                                                            <SelectValue placeholder="Seleccionar categoría" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (cat) => (
                                                                    <SelectItem
                                                                        key={
                                                                            cat.id
                                                                        }
                                                                        value={cat.id.toString()}
                                                                    >
                                                                        {
                                                                            cat.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.category_id && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.category_id}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        Marca
                                                    </Label>
                                                    <Select
                                                        value={data.brand_id}
                                                        onValueChange={(val) =>
                                                            setData(
                                                                'brand_id',
                                                                val,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar marca" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {brands.map(
                                                                (brand) => (
                                                                    <SelectItem
                                                                        key={
                                                                            brand.id
                                                                        }
                                                                        value={brand.id.toString()}
                                                                    >
                                                                        {
                                                                            brand.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Imágenes */}
                                        <TabsContent
                                            value="images"
                                            className="mt-0 space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Imagen principal
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Esta imagen se mostrará
                                                        como portada del
                                                        producto
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    {thumbnailPreview ? (
                                                        <div className="group relative">
                                                            <div className="h-32 w-32 overflow-hidden rounded-lg border bg-muted/50">
                                                                <img
                                                                    src={
                                                                        thumbnailPreview
                                                                    }
                                                                    alt="Thumbnail preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                                onClick={
                                                                    removeThumbnail
                                                                }
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                                                            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            asChild
                                                            size="sm"
                                                        >
                                                            <label className="cursor-pointer gap-2">
                                                                <Upload className="h-4 w-4" />
                                                                {thumbnailPreview
                                                                    ? 'Cambiar imagen'
                                                                    : 'Subir imagen'}
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={
                                                                        handleThumbnail
                                                                    }
                                                                />
                                                            </label>
                                                        </Button>
                                                        <p className="mt-2 text-xs text-muted-foreground">
                                                            Recomendado:
                                                            500x500px, JPG, PNG
                                                            o WebP
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Galería de imágenes
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Imágenes adicionales
                                                        para mostrar el producto
                                                        desde diferentes ángulos
                                                    </p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    asChild
                                                    size="sm"
                                                >
                                                    <label className="cursor-pointer gap-2">
                                                        <Upload className="h-4 w-4" />
                                                        Agregar imágenes
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            onChange={
                                                                handleGallery
                                                            }
                                                        />
                                                    </label>
                                                </Button>

                                                {(existingImages.length > 0 ||
                                                    galleryPreviews.length >
                                                        0) && (
                                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                        {existingImages.map(
                                                            (img) => (
                                                                <div
                                                                    key={img.id}
                                                                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/50"
                                                                >
                                                                    <img
                                                                        src={`/storage/${img.image_url}`}
                                                                        alt="Gallery"
                                                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            className="h-7 w-7"
                                                                            onClick={() =>
                                                                                removeExistingImage(
                                                                                    img.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="absolute top-2 left-2 text-[10px]"
                                                                    >
                                                                        Actual
                                                                    </Badge>
                                                                </div>
                                                            ),
                                                        )}
                                                        {galleryPreviews.map(
                                                            (
                                                                preview,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={`new-${index}`}
                                                                    className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/50"
                                                                >
                                                                    <img
                                                                        src={
                                                                            preview
                                                                        }
                                                                        alt="New gallery"
                                                                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            className="h-7 w-7"
                                                                            onClick={() =>
                                                                                removeNewGalleryImage(
                                                                                    index,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                    <Badge className="absolute top-2 left-2 bg-primary/80 text-[10px]">
                                                                        Nueva
                                                                    </Badge>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                                {existingImages.length === 0 &&
                                                    galleryPreviews.length ===
                                                        0 && (
                                                        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                                                            <p className="text-sm text-muted-foreground">
                                                                No hay imágenes
                                                                en la galería
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        </TabsContent>

                                        {/* Variantes */}
                                        <TabsContent
                                            value="variants"
                                            className="mt-0 space-y-6"
                                        >
                                            <Alert className="border-muted bg-muted/30">
                                                <Info className="h-4 w-4 text-muted-foreground" />
                                                <AlertDescription className="text-xs text-muted-foreground">
                                                    Las variantes te permiten
                                                    ofrecer diferentes opciones
                                                    como tallas, colores o
                                                    materiales. El stock de las
                                                    variantes se suma
                                                    automáticamente al stock
                                                    total.
                                                </AlertDescription>
                                            </Alert>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-sm font-medium">
                                                        Lista de variantes
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Configura las opciones
                                                        disponibles para este
                                                        producto
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={addVariant}
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Agregar variante
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {data.variants.map((variant) => (
                                                    <div
                                                        key={variant.id}
                                                        className="flex flex-col gap-3 rounded-lg border bg-card p-4 transition-all sm:flex-row sm:items-end"
                                                    >
                                                        <div className="flex-1 space-y-1.5">
                                                            <Label className="text-xs font-medium">
                                                                Nombre
                                                            </Label>
                                                            <Input
                                                                placeholder="Ej: Talla"
                                                                value={variant.name}
                                                                onChange={(e) =>
                                                                    updateVariant(variant.id, 'name', e.target.value)
                                                                }
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="flex-1 space-y-1.5">
                                                            <Label className="text-xs font-medium">
                                                                Valor
                                                            </Label>
                                                            <Input
                                                                placeholder="Ej: XL"
                                                                value={variant.value}
                                                                onChange={(e) =>
                                                                    updateVariant(variant.id, 'value', e.target.value)
                                                                }
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="w-28 space-y-1.5">
                                                            <Label className="text-xs font-medium">
                                                                Stock
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                value={variant.stock}
                                                                onChange={(e) =>
                                                                    updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)
                                                                }
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="w-28 space-y-1.5">
                                                            <Label className="text-xs font-medium">
                                                                Precio (S/)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                value={variant.price}
                                                                onChange={(e) =>
                                                                    updateVariant(variant.id, 'price', e.target.value === '' ? '' : parseFloat(e.target.value) || '')
                                                                }
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeVariant(variant.id)}
                                                            disabled={data.variants.length === 1}
                                                            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>

                                            {data.variants.some(
                                                (v) => v.name && v.value,
                                            ) && (
                                                <div className="rounded-lg bg-muted/30 p-3">
                                                    <p className="text-center text-xs text-muted-foreground">
                                                        Stock total incluyendo
                                                        variantes:{' '}
                                                        <span className="font-semibold text-foreground">
                                                            {totalStock}
                                                        </span>{' '}
                                                        unidades
                                                    </p>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </CardContent>
                                </Tabs>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card className="border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">
                                        Estado del producto
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Configura la visibilidad y promoción
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">
                                                Producto activo
                                            </Label>
                                            <p className="text-[10px] text-muted-foreground">
                                                Visible en la tienda
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_active}
                                            onCheckedChange={(checked) =>
                                                setData('is_active', checked)
                                            }
                                        />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">
                                                Producto destacado
                                            </Label>
                                            <p className="text-[10px] text-muted-foreground">
                                                Aparece en secciones especiales
                                            </p>
                                        </div>
                                        <Switch
                                            checked={data.is_featured}
                                            onCheckedChange={(checked) =>
                                                setData('is_featured', checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">
                                        Resumen
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Precio:
                                        </span>
                                        <span className="font-semibold">
                                            S/{' '}
                                            {parseFloat(
                                                data.price || '0',
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Stock base:
                                        </span>
                                        <span className="font-medium">
                                            {parseInt(data.stock || '0')} unid.
                                        </span>
                                    </div>
                                    {data.variants.some(
                                        (v) => v.name && v.value,
                                    ) && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Stock variantes:
                                            </span>
                                            <span className="font-medium">
                                                {data.variants.reduce(
                                                    (s, v) =>
                                                        s + (v.stock || 0),
                                                    0,
                                                )}{' '}
                                                unid.
                                            </span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Stock total:
                                        </span>
                                        <span className="font-bold">
                                            {totalStock} unid.
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Variantes:
                                        </span>
                                        <span className="font-medium">
                                            {
                                                data.variants.filter(
                                                    (v) => v.name && v.value,
                                                ).length
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Imágenes:
                                        </span>
                                        <span className="font-medium">
                                            {(product.thumbnail ? 1 : 0) +
                                                (product.images?.length || 0)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold">
                                        Información del sistema
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            ID:
                                        </span>
                                        <span className="font-mono">
                                            {product.id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Slug:
                                        </span>
                                        <span className="max-w-[180px] truncate font-mono">
                                            {product.slug}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Creado:
                                        </span>
                                        <span>
                                            {new Date(
                                                product.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-3">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="flex-1 gap-2 shadow-sm"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing
                                        ? 'Guardando...'
                                        : 'Guardar cambios'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
