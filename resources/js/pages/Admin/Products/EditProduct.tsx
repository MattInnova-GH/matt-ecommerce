import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
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
    Eye,
    Package,
    Image as ImageIcon,
    Tags,
    Info,
    ArrowLeft,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface VariantField {
    id: string;
    type: string;
    value: string;
    price_adjustment: number;
    stock: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    price: number;
    stock: number;
    category_id: number | null;
    brand_id: number | null;
    supplier_id: number | null;
    thumbnail: string | null;
    gallery: string[] | null;
    is_active: boolean;
    is_featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    variants?: any[];
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

export default function EditProduct({
    product,
    categories,
    brands,
    suppliers,
}: {
    product: Product;
    categories: Category[];
    brands: Brand[];
    suppliers: Supplier[];
}) {
    const [activeTab, setActiveTab] = useState('basic');
    const [variants, setVariants] = useState<VariantField[]>([]);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        product.thumbnail ? `/storage/${product.thumbnail}` : null,
    );
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
        product.gallery ? product.gallery.map((img) => `/storage/${img}`) : [],
    );
    const [existingGallery, setExistingGallery] = useState<string[]>(
        product.gallery || [],
    );

    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category_id: product.category_id?.toString() || '',
        brand_id: product.brand_id?.toString() || '',
        supplier_id: product.supplier_id?.toString() || '',
        thumbnail: null as File | null,
        gallery: [] as File[],
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        variants: [] as any[],
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        deleted_gallery: [] as string[],
    });

    // Inicializar variantes desde el producto
    useEffect(() => {
        if (product.variants && product.variants.length > 0) {
            setVariants(
                product.variants.map((variant, index) => ({
                    id: variant.id?.toString() || index.toString(),
                    type: variant.type || '',
                    value: variant.value || '',
                    price_adjustment: variant.price_adjustment || 0,
                    stock: variant.stock || 0,
                })),
            );
        } else {
            setVariants([
                { id: '1', type: '', value: '', price_adjustment: 0, stock: 0 },
            ]);
        }
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validVariants = variants.filter((v) => v.type && v.value);
        setData('variants', validVariants);
        put(`/admin/products/${product.id}`, {
            onSuccess: () => {
                router.visit('/admin/products');
            },
        });
    };

    const addVariant = () => {
        setVariants([
            ...variants,
            {
                id: Date.now().toString(),
                type: '',
                value: '',
                price_adjustment: 0,
                stock: 0,
            },
        ]);
    };

    const removeVariant = (id: string) => {
        if (variants.length > 1) {
            setVariants(variants.filter((v) => v.id !== id));
        }
    };

    const updateVariant = (id: string, field: string, value: any) => {
        setVariants(
            variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
        );
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

    const removeGalleryImage = (
        index: number,
        isExisting: boolean = false,
        imagePath?: string,
    ) => {
        if (isExisting && imagePath) {
            setData('deleted_gallery', [...data.deleted_gallery, imagePath]);
            setExistingGallery(existingGallery.filter((_, i) => i !== index));
        } else {
            const newIndex = index - existingGallery.length;

            if (newIndex >= 0) {
                setGalleryPreviews(
                    galleryPreviews.filter((_, i) => i !== index),
                );
                const newGallery = [...data.gallery];
                newGallery.splice(newIndex, 1);
                setData('gallery', newGallery);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                                Editar producto
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Modifica los campos que deseas actualizar
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/admin/products')}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing
                                ? 'Actualizando...'
                                : 'Actualizar producto'}
                        </Button>
                    </div>
                </div>

                {/* Formulario principal */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Columna principal */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardContent className="p-4 md:p-6">
                                    <Tabs
                                        value={activeTab}
                                        onValueChange={setActiveTab}
                                        className="space-y-6"
                                    >
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger
                                                value="basic"
                                                className="gap-2"
                                            >
                                                <Package className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    Información
                                                </span>
                                                <span className="sm:hidden">
                                                    Info
                                                </span>
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="images"
                                                className="gap-2"
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    Imágenes
                                                </span>
                                                <span className="sm:hidden">
                                                    Fotos
                                                </span>
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="variants"
                                                className="gap-2"
                                            >
                                                <Tags className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    Variantes
                                                </span>
                                                <span className="sm:hidden">
                                                    Var.
                                                </span>
                                            </TabsTrigger>
                                        </TabsList>

                                        {/* Información básica */}
                                        <TabsContent
                                            value="basic"
                                            className="space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">
                                                        Nombre del producto{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={data.name}
                                                        onChange={(e) => {
                                                            setData(
                                                                'name',
                                                                e.target.value,
                                                            );
                                                        }}
                                                        placeholder="Ej: Camiseta de algodón"
                                                        className="w-full"
                                                        required
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="description">
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
                                                        rows={5}
                                                        placeholder="Describe tu producto en detalle..."
                                                        className="resize-none"
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="sku">
                                                        SKU{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="sku"
                                                        value={data.sku}
                                                        onChange={(e) =>
                                                            setData(
                                                                'sku',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="SKU-001"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="price">
                                                        Precio{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <div className="relative">
                                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                                                            $
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
                                                            className="pl-7"
                                                            placeholder="0.00"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="stock">
                                                        Stock{' '}
                                                        <span className="text-red-500">
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
                                                        placeholder="0"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label>Categoría</Label>
                                                    <Select
                                                        value={data.category_id}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'category_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
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
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Marca</Label>
                                                    <Select
                                                        value={data.brand_id}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'brand_id',
                                                                value,
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
                                                <div className="space-y-2">
                                                    <Label>Proveedor</Label>
                                                    <Select
                                                        value={data.supplier_id}
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'supplier_id',
                                                                value,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar proveedor" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {suppliers.map(
                                                                (supplier) => (
                                                                    <SelectItem
                                                                        key={
                                                                            supplier.id
                                                                        }
                                                                        value={supplier.id.toString()}
                                                                    >
                                                                        {
                                                                            supplier.name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="is_active"
                                                        checked={data.is_active}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setData(
                                                                'is_active',
                                                                checked,
                                                            )
                                                        }
                                                    />
                                                    <Label htmlFor="is_active">
                                                        Producto activo
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="is_featured"
                                                        checked={
                                                            data.is_featured
                                                        }
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            setData(
                                                                'is_featured',
                                                                checked,
                                                            )
                                                        }
                                                    />
                                                    <Label htmlFor="is_featured">
                                                        Producto destacado
                                                    </Label>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Imágenes */}
                                        <TabsContent
                                            value="images"
                                            className="space-y-6"
                                        >
                                            <div className="space-y-3">
                                                <Label>
                                                    Imagen principal (Thumbnail)
                                                </Label>
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <label className="cursor-pointer">
                                                            <Upload className="mr-2 h-4 w-4" />
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
                                                    {thumbnailPreview && (
                                                        <div className="relative">
                                                            <img
                                                                src={
                                                                    thumbnailPreview
                                                                }
                                                                alt="Preview"
                                                                className="h-20 w-20 rounded-lg border object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Recomendado: imagen cuadrada
                                                    de al menos 500x500px
                                                </p>
                                            </div>

                                            <Separator />

                                            <div className="space-y-3">
                                                <Label>
                                                    Galería de imágenes
                                                </Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <label className="cursor-pointer">
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Subir más imágenes
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

                                                {(existingGallery.length > 0 ||
                                                    galleryPreviews.length >
                                                        0) && (
                                                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                        {/* Imágenes existentes */}
                                                        {existingGallery.map(
                                                            (image, index) => (
                                                                <div
                                                                    key={`existing-${index}`}
                                                                    className="group relative"
                                                                >
                                                                    <img
                                                                        src={`/storage/${image}`}
                                                                        alt={`Gallery ${index}`}
                                                                        className="h-24 w-full rounded-lg border object-cover"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                                        onClick={() =>
                                                                            removeGalleryImage(
                                                                                index,
                                                                                true,
                                                                                image,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ),
                                                        )}

                                                        {/* Imágenes nuevas */}
                                                        {galleryPreviews.map(
                                                            (
                                                                preview,
                                                                index,
                                                            ) => {
                                                                const globalIndex =
                                                                    existingGallery.length +
                                                                    index;

                                                                return (
                                                                    <div
                                                                        key={`new-${index}`}
                                                                        className="group relative"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                preview
                                                                            }
                                                                            alt={`New Gallery ${index}`}
                                                                            className="h-24 w-full rounded-lg border object-cover"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="destructive"
                                                                            size="icon"
                                                                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                                            onClick={() =>
                                                                                removeGalleryImage(
                                                                                    globalIndex,
                                                                                    false,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        {/* Variantes */}
                                        <TabsContent
                                            value="variants"
                                            className="space-y-4"
                                        >
                                            <Alert>
                                                <Info className="h-4 w-4" />
                                                <AlertDescription>
                                                    Las variantes permiten
                                                    ofrecer diferentes opciones
                                                    como tallas, colores, etc.
                                                </AlertDescription>
                                            </Alert>

                                            {variants.map((variant) => (
                                                <Card key={variant.id}>
                                                    <CardContent className="p-4">
                                                        <div className="grid gap-3 md:grid-cols-5">
                                                            <Input
                                                                placeholder="Tipo (Ej: Talla)"
                                                                value={
                                                                    variant.type
                                                                }
                                                                onChange={(e) =>
                                                                    updateVariant(
                                                                        variant.id,
                                                                        'type',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <Input
                                                                placeholder="Valor (Ej: M)"
                                                                value={
                                                                    variant.value
                                                                }
                                                                onChange={(e) =>
                                                                    updateVariant(
                                                                        variant.id,
                                                                        'value',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <div className="relative">
                                                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                                                                    $
                                                                </span>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Ajuste precio"
                                                                    value={
                                                                        variant.price_adjustment
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateVariant(
                                                                            variant.id,
                                                                            'price_adjustment',
                                                                            parseFloat(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ),
                                                                        )
                                                                    }
                                                                    className="pl-7"
                                                                />
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                placeholder="Stock"
                                                                value={
                                                                    variant.stock
                                                                }
                                                                onChange={(e) =>
                                                                    updateVariant(
                                                                        variant.id,
                                                                        'stock',
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    removeVariant(
                                                                        variant.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    variants.length ===
                                                                    1
                                                                }
                                                                className="text-red-500 hover:text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addVariant}
                                                className="w-full sm:w-auto"
                                            >
                                                <Plus className="mr-2 h-4 w-4" />{' '}
                                                Agregar variante
                                            </Button>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Resumen y acciones */}
                        <div className="space-y-6">
                            <Card className="sticky top-6">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Resumen del producto
                                    </CardTitle>
                                    <CardDescription>
                                        Vista previa de la información
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Estado
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {data.is_active ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Activo
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Inactivo
                                                </Badge>
                                            )}
                                            {data.is_featured && (
                                                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                                                    Destacado
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">
                                            Precio
                                        </div>
                                        <div className="text-2xl font-bold">
                                            $
                                            {data.price
                                                ? parseFloat(
                                                      data.price,
                                                  ).toFixed(2)
                                                : '0.00'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">
                                            Stock
                                        </div>
                                        <div className="text-base font-semibold">
                                            {data.stock || 0} unidades
                                        </div>
                                    </div>
                                    {variants.some(
                                        (v) => v.type && v.value,
                                    ) && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">
                                                    Variantes
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {
                                                        variants.filter(
                                                            (v) =>
                                                                v.type &&
                                                                v.value,
                                                        ).length
                                                    }{' '}
                                                    variante(s) configurada(s)
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <Separator />
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">
                                            Acciones rápidas
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Actualizar producto
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Vista previa
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Consejos */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Consejos útiles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex gap-2">
                                        <Badge
                                            variant="outline"
                                            className="shrink-0"
                                        >
                                            1
                                        </Badge>
                                        <span>
                                            Usa imágenes de alta calidad para
                                            destacar tu producto
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge
                                            variant="outline"
                                            className="shrink-0"
                                        >
                                            2
                                        </Badge>
                                        <span>
                                            Completa todos los campos para
                                            mejorar el SEO
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge
                                            variant="outline"
                                            className="shrink-0"
                                        >
                                            3
                                        </Badge>
                                        <span>
                                            Las variantes ayudan a organizar
                                            diferentes versiones
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge
                                            variant="outline"
                                            className="shrink-0"
                                        >
                                            4
                                        </Badge>
                                        <span>
                                            Mantén el stock actualizado para
                                            evitar problemas
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
