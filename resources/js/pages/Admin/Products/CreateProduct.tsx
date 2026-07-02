import { useState } from 'react';
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
    Package,
    ImageIcon,
    Tags,
    Info,
} from 'lucide-react';
import admin from '@/routes/admin';

interface Variant {
    name: string;
    value: string;
    stock: number;
    price: number | '';
}

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface CreateProductProps {
    categories: Category[];
    brands: Brand[];
}

export default function CreateProduct({
    categories,
    brands,
}: CreateProductProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null,
    );
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        brand_id: '',
        supplier_id: '',
        thumbnail: null as File | null,
        gallery: [] as File[],
        is_active: true,
        is_featured: false,
        variants: [{ name: '', value: '', stock: 0, price: '' as number | '' }] as Variant[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(admin.products.store().url, {
            onSuccess: () => {},
            preserveScroll: true,
        });
    };

    const addVariant = () => {
        setData('variants', [...data.variants, { name: '', value: '', stock: 0, price: '' }]);
    };

    const removeVariant = (index: number) => {
        if (data.variants.length > 1) {
            setData('variants', data.variants.filter((_, i) => i !== index));
        }
    };

    const updateVariant = (index: number, field: keyof Variant, value: string) => {
        const updated = [...data.variants];
        if (field === 'stock') {
            updated[index][field] = parseInt(value) || 0;
        } else if (field === 'price') {
            updated[index][field] = value === '' ? '' : parseFloat(value) || '';
        } else {
            updated[index][field] = value as never;
        }
        setData('variants', updated);
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
        const currentGallery = data.gallery || [];
        setData('gallery', [...currentGallery, ...files]);

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

    const removeGalleryImage = (index: number) => {
        setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
        const newGallery = [...(data.gallery || [])];
        newGallery.splice(index, 1);
        setData('gallery', newGallery);
    };

    const totalStock =
        parseInt(data.stock || '0') +
        data.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            Crear nuevo producto
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Completa todos los campos para agregar un nuevo
                            producto a tu tienda
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(admin.products.index())}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Guardando...' : 'Publicar producto'}
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
                                                        onChange={(e) =>
                                                            setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
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

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="price">
                                                        Precio{' '}
                                                        <span className="text-red-500">
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
                                                            className="pl-7"
                                                            placeholder="0.00"
                                                            required
                                                        />
                                                    </div>
                                                    {errors.price && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.price}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="stock">
                                                        Stock base{' '}
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
                                                    {errors.stock && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.stock}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>
                                                        Categoría{' '}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'category_id',
                                                                value,
                                                            )
                                                        }
                                                        value={data.category_id}
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
                                                    {errors.category_id && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.category_id}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Marca</Label>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setData(
                                                                'brand_id',
                                                                value,
                                                            )
                                                        }
                                                        value={data.brand_id}
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
                                                            Subir imagen
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
                                                        Subir imágenes
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
                                                {galleryPreviews.length > 0 && (
                                                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                        {galleryPreviews.map(
                                                            (
                                                                preview,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="group relative"
                                                                >
                                                                    <img
                                                                        src={
                                                                            preview
                                                                        }
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
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ),
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
                                                    El stock de cada variante se
                                                    suma al stock base.
                                                </AlertDescription>
                                            </Alert>

                                            {data.variants.map((variant, index) => (
                                                <Card key={index}>
                                                    <CardContent className="p-4">
                                                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
                                                            <Input
                                                                placeholder="Tipo (Ej: Talla)"
                                                                value={variant.name}
                                                                onChange={(e) =>
                                                                    updateVariant(index, 'name', e.target.value)
                                                                }
                                                            />
                                                            <Input
                                                                placeholder="Valor (Ej: M)"
                                                                value={variant.value}
                                                                onChange={(e) =>
                                                                    updateVariant(index, 'value', e.target.value)
                                                                }
                                                            />
                                                            <Input
                                                                type="number"
                                                                placeholder="Stock"
                                                                value={variant.stock}
                                                                onChange={(e) =>
                                                                    updateVariant(index, 'stock', e.target.value)
                                                                }
                                                            />
                                                            <div className="relative">
                                                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-muted-foreground">
                                                                    S/
                                                                </span>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    placeholder="Precio"
                                                                    value={variant.price}
                                                                    className="pl-8"
                                                                    onChange={(e) =>
                                                                        updateVariant(index, 'price', e.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removeVariant(index)}
                                                                disabled={data.variants.length === 1}
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
                                            S/{' '}
                                            {parseFloat(
                                                data.price || '0',
                                            ).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">
                                            Stock total
                                        </div>
                                        <div className="text-base font-semibold">
                                            {totalStock} unidades
                                        </div>
                                        {parseInt(data.stock || '0') > 0 && (
                                            <div className="text-xs text-muted-foreground">
                                                Base: {data.stock} | Variantes:{' '}
                                                {data.variants.reduce(
                                                    (s, v) => s + v.stock,
                                                    0,
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {data.variants.some(
                                        (v) => v.name && v.value,
                                    ) && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">
                                                    Variantes
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {
                                                        data.variants.filter(
                                                            (v) =>
                                                                v.name &&
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
                                            Publicar producto
                                        </Button>
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
