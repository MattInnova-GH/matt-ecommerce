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
    ImageIcon,
    Building2,
    Share2,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Pill step indicator shown in the page header */
function SectionStep({
    number,
    label,
    active,
}: {
    number: number;
    label: string;
    active?: boolean;
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-2 text-sm',
                active ? 'text-foreground' : 'text-muted-foreground',
            )}
        >
            <span
                className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                    active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                )}
            >
                {number}
            </span>
            <span className="hidden sm:block">{label}</span>
        </div>
    );
}

/** Reusable image uploader card */
function ImageUploadField({
    id,
    label,
    hint,
    preview,
    fallbackIcon: FallbackIcon,
    avatarClass,
    onFileChange,
    onClear,
}: {
    id: string;
    label: string;
    hint: string;
    preview: string | null;
    fallbackIcon: React.ElementType;
    avatarClass?: string;
    onFileChange: (file: File) => void;
    onClear: () => void;
}) {
    return (
        <div className="flex items-start gap-5">
            {/* Preview */}
            <div className="relative shrink-0">
                <Avatar
                    className={cn(
                        'border-2 border-dashed border-border',
                        avatarClass,
                    )}
                >
                    <AvatarImage
                        src={preview ?? undefined}
                        className="object-contain p-1"
                    />
                    <AvatarFallback className="bg-muted/60">
                        <FallbackIcon className="h-6 w-6 text-muted-foreground/50" />
                    </AvatarFallback>
                </Avatar>
                {preview && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-colors hover:bg-destructive/80"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {/* Info + button */}
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
                <Label
                    htmlFor={id}
                    className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
                >
                    <Upload className="h-3 w-3" />
                    Subir archivo
                    <input
                        id={id}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                                onFileChange(file);
                            }
                        }}
                    />
                </Label>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Settings({ settings }: Props) {
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const [previewFavicon, setPreviewFavicon] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);

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

    // ── Logic (unchanged) ──────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('site_name', data.site_name);

        if (data.logo) {
            formData.append('logo', data.logo);
        }

        if (data.favicon) {
            formData.append('favicon', data.favicon);
        }

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
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error('Error al guardar');
                setIsSubmitting(false);
            },
        });
    };

    const readPreview = (file: File, setter: (v: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result as string);
        reader.readAsDataURL(file);
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="mx-auto space-y-8 pb-16">
            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className="text-[10px] font-medium tracking-wider uppercase"
                        >
                            Tienda
                        </Badge>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Configuración
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Gestiona la información general de tu tienda
                    </p>
                </div>

                {/* Steps overview */}
                <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-2.5">
                    <SectionStep number={1} label="General" active />
                    <div className="h-px w-3 bg-border" />
                    <SectionStep number={2} label="Branding" active />
                    <div className="h-px w-3 bg-border" />
                    <SectionStep number={3} label="Contacto" active />
                    <div className="h-px w-3 bg-border" />
                    <SectionStep number={4} label="Redes" active />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── SECTION 1 · Información General ─────────────────────── */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-semibold">
                                    Información general
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Nombre público de tu tienda
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 py-5">
                        <div className="max-w-sm space-y-1.5">
                            <Label
                                htmlFor="site_name"
                                className="text-sm font-medium"
                            >
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
                                className="h-9"
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

                {/* ── SECTION 2 · Branding ────────────────────────────────── */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <ImageIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-semibold">
                                    Branding
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Logo y favicon de tu tienda
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="divide-y px-6">
                        {/* Logo */}
                        <div className="py-5">
                            <ImageUploadField
                                id="logo"
                                label="Logo de la tienda"
                                hint="PNG, JPG, SVG · Recomendado 200×200 px"
                                preview={previewLogo || settings?.logo || null}
                                fallbackIcon={Store}
                                avatarClass="h-20 w-20 rounded-xl"
                                onFileChange={(file) => {
                                    setData('logo', file);
                                    readPreview(file, setPreviewLogo);
                                }}
                                onClear={() => {
                                    setPreviewLogo(null);
                                    setData('logo', null);
                                }}
                            />
                        </div>

                        {/* Favicon */}
                        <div className="py-5">
                            <ImageUploadField
                                id="favicon"
                                label="Favicon del sitio"
                                hint="PNG, ICO, SVG · Recomendado 32×32 px"
                                preview={
                                    previewFavicon || settings?.favicon || null
                                }
                                fallbackIcon={Globe}
                                avatarClass="h-14 w-14 rounded-lg"
                                onFileChange={(file) => {
                                    setData('favicon', file);
                                    readPreview(file, setPreviewFavicon);
                                }}
                                onClear={() => {
                                    setPreviewFavicon(null);
                                    setData('favicon', null);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── SECTION 3 · Contacto ────────────────────────────────── */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Phone className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-semibold">
                                    Contacto
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Datos visibles en la tienda
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="flex items-center gap-1.5 text-sm"
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
                                className="h-9"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="phone"
                                className="flex items-center gap-1.5 text-sm"
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
                                className="h-9"
                            />
                        </div>

                        {/* Address (full width) */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label
                                htmlFor="address"
                                className="flex items-center gap-1.5 text-sm"
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
                                rows={2}
                                className="resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── SECTION 4 · Redes Sociales ──────────────────────────── */}
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Share2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-semibold">
                                    Redes sociales
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Enlaces a tus perfiles sociales
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                        {/* Facebook */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="facebook"
                                className="flex items-center gap-1.5 text-sm"
                            >
                                <Facebook className="h-3.5 w-3.5 text-[#1877F2]" />
                                Facebook
                            </Label>
                            <Input
                                id="facebook"
                                value={data.facebook}
                                onChange={(e) =>
                                    setData('facebook', e.target.value)
                                }
                                placeholder="https://facebook.com/mitienda"
                                className="h-9"
                            />
                        </div>

                        {/* Instagram */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="instagram"
                                className="flex items-center gap-1.5 text-sm"
                            >
                                <Instagram className="h-3.5 w-3.5 text-[#E1306C]" />
                                Instagram
                            </Label>
                            <Input
                                id="instagram"
                                value={data.instagram}
                                onChange={(e) =>
                                    setData('instagram', e.target.value)
                                }
                                placeholder="https://instagram.com/mitienda"
                                className="h-9"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="whatsapp"
                                className="flex items-center gap-1.5 text-sm"
                            >
                                <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                                WhatsApp
                            </Label>
                            <Input
                                id="whatsapp"
                                value={data.whatsapp}
                                onChange={(e) =>
                                    setData('whatsapp', e.target.value)
                                }
                                placeholder="https://wa.me/51999999999"
                                className="h-9"
                            />
                        </div>

                        {/* TikTok */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="tiktok"
                                className="flex items-center gap-1.5 text-sm"
                            >
                                <Music className="h-3.5 w-3.5 text-foreground" />
                                TikTok
                            </Label>
                            <Input
                                id="tiktok"
                                value={data.tiktok}
                                onChange={(e) =>
                                    setData('tiktok', e.target.value)
                                }
                                placeholder="https://tiktok.com/@mitienda"
                                className="h-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Save Bar ─────────────────────────────────────────────── */}
                <div className="sticky bottom-4 flex justify-end">
                    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg shadow-black/5">
                        {saved && (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Cambios guardados
                            </span>
                        )}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            size="sm"
                            className="min-w-36 gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-3.5 w-3.5" />
                                    Guardar cambios
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
