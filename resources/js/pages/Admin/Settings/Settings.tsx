import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Store,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    MessageCircle,
    Music,
    Globe,
    Upload,
    Loader2,
    X,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';

interface SettingsData {
    id?: number;
    site_name: string;
    logo: string | null;
    favicon: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    facebook: string | null;
    instagram: string | null;
    whatsapp: string | null;
    tiktok: string | null;
}

interface Props {
    settings: SettingsData;
}

export default function Settings({ settings }: Props) {
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [previewFavicon, setPreviewFavicon] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors } = useForm({
        site_name: settings?.site_name || '',
        logo: null as File | null,
        favicon: null as File | null,
        email: settings?.email || '',
        phone: settings?.phone || '',
        address: settings?.address || '',
        facebook: settings?.facebook || '',
        instagram: settings?.instagram || '',
        whatsapp: settings?.whatsapp || '',
        tiktok: settings?.tiktok || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('site_name', data.site_name);
        if (data.logo) formData.append('logo', data.logo);
        if (data.favicon) formData.append('favicon', data.favicon);
        formData.append('email', data.email || '');
        formData.append('phone', data.phone || '');
        formData.append('address', data.address || '');
        formData.append('facebook', data.facebook || '');
        formData.append('instagram', data.instagram || '');
        formData.append('whatsapp', data.whatsapp || '');
        formData.append('tiktok', data.tiktok || '');
        formData.append('_method', 'PUT');

        router.post('/admin/settings', formData, {
            onSuccess: () => {
                toast.success('Configuración guardada');
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error('Error al guardar');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Configuración
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Gestiona la información general de tu tienda
                </p>
            </div>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ── Sección 1: Información General ── */}
                <section className="grid gap-6 md:grid-cols-[240px_1fr]">
                    <div>
                        <h2 className="text-sm font-medium">
                            Información general
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Nombre público de tu tienda.
                        </p>
                    </div>
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="site_name">
                                    Nombre de la tienda{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={(e) =>
                                        setData('site_name', e.target.value)
                                    }
                                    placeholder="Mi Tienda Online"
                                    required
                                />
                                {errors.site_name && (
                                    <p className="text-xs text-destructive">
                                        {errors.site_name}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* ── Sección 2: Branding ── */}
                <section className="grid gap-6 md:grid-cols-[240px_1fr]">
                    <div>
                        <h2 className="text-sm font-medium">Branding</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Logo y favicon de tu tienda.
                        </p>
                    </div>
                    <Card>
                        <CardContent className="space-y-6 pt-6">
                            {/* Logo */}
                            <div className="space-y-3">
                                <Label>Logo</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20 rounded-xl border">
                                        <AvatarImage
                                            src={
                                                previewLogo ||
                                                settings?.logo ||
                                                undefined
                                            }
                                            className="object-contain"
                                        />
                                        <AvatarFallback className="rounded-xl bg-muted">
                                            <Store className="h-7 w-7 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="logo"
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                                        >
                                            <Upload className="h-3.5 w-3.5" />
                                            Subir logo
                                            <input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];

                                                    if (file) {
                                                        setData('logo', file);
                                                        const reader =
                                                            new FileReader();
                                                        reader.onloadend = () =>
                                                            setPreviewLogo(
                                                                reader.result as string,
                                                            );
                                                        reader.readAsDataURL(
                                                            file,
                                                        );
                                                    }
                                                }}
                                            />
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, SVG · Recomendado
                                            200×200px
                                        </p>
                                    </div>
                                    {previewLogo && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setPreviewLogo(null);
                                                setData('logo', null);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Favicon */}
                            <div className="space-y-3">
                                <Label>Favicon</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 rounded-lg border">
                                        <AvatarImage
                                            src={
                                                previewFavicon ||
                                                settings?.favicon ||
                                                undefined
                                            }
                                            className="object-contain"
                                        />
                                        <AvatarFallback className="rounded-lg bg-muted">
                                            <Globe className="h-5 w-5 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="favicon"
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                                        >
                                            <Upload className="h-3.5 w-3.5" />
                                            Subir favicon
                                            <input
                                                id="favicon"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];

                                                    if (file) {
                                                        setData(
                                                            'favicon',
                                                            file,
                                                        );
                                                        const reader =
                                                            new FileReader();
                                                        reader.onloadend = () =>
                                                            setPreviewFavicon(
                                                                reader.result as string,
                                                            );
                                                        reader.readAsDataURL(
                                                            file,
                                                        );
                                                    }
                                                }}
                                            />
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, ICO, SVG · Recomendado 32×32px
                                        </p>
                                    </div>
                                    {previewFavicon && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setPreviewFavicon(null);
                                                setData('favicon', null);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* ── Sección 3: Contacto ── */}
                <section className="grid gap-6 md:grid-cols-[240px_1fr]">
                    <div>
                        <h2 className="text-sm font-medium">Contacto</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Datos de contacto visibles en la tienda.
                        </p>
                    </div>
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center gap-2"
                                >
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="tienda@ejemplo.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="phone"
                                    className="flex items-center gap-2"
                                >
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    Teléfono
                                </Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    placeholder="+51 123 456 789"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="address"
                                    className="flex items-center gap-2"
                                >
                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                    Dirección
                                </Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Av. Principal 123, Ciudad"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* ── Sección 4: Redes Sociales ── */}
                <section className="grid gap-6 md:grid-cols-[240px_1fr]">
                    <div>
                        <h2 className="text-sm font-medium">Redes sociales</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Enlaces a tus perfiles sociales.
                        </p>
                    </div>
                    <Card>
                        <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="facebook"
                                    className="flex items-center gap-2"
                                >
                                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                                    Facebook
                                </Label>
                                <Input
                                    id="facebook"
                                    value={data.facebook}
                                    onChange={(e) =>
                                        setData('facebook', e.target.value)
                                    }
                                    placeholder="https://facebook.com/mitienda"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="instagram"
                                    className="flex items-center gap-2"
                                >
                                    <Instagram className="h-3.5 w-3.5 text-pink-600" />
                                    Instagram
                                </Label>
                                <Input
                                    id="instagram"
                                    value={data.instagram}
                                    onChange={(e) =>
                                        setData('instagram', e.target.value)
                                    }
                                    placeholder="https://instagram.com/mitienda"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="whatsapp"
                                    className="flex items-center gap-2"
                                >
                                    <MessageCircle className="h-3.5 w-3.5 text-green-600" />
                                    WhatsApp
                                </Label>
                                <Input
                                    id="whatsapp"
                                    value={data.whatsapp}
                                    onChange={(e) =>
                                        setData('whatsapp', e.target.value)
                                    }
                                    placeholder="https://wa.me/51999999999"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="tiktok"
                                    className="flex items-center gap-2"
                                >
                                    <Music className="h-3.5 w-3.5" />
                                    TikTok
                                </Label>
                                <Input
                                    id="tiktok"
                                    value={data.tiktok}
                                    onChange={(e) =>
                                        setData('tiktok', e.target.value)
                                    }
                                    placeholder="https://tiktok.com/@mitienda"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Separator />

                {/* ── Botón guardar ── */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-36 gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Guardar cambios
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
