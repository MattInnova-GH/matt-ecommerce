import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
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
import { FlashMessage } from './FlashMessage';
import { InputError } from './InputError';
import type { Address } from './types/settings';

interface AddressesSectionProps {
    addresses: Address[];
    flash?: string;
}

const emptyAddress = {
    country: '',
    city: '',
    district: '',
    address: '',
    reference: '',
    postal_code: '',
};

export function AddressesSection({ addresses, flash }: AddressesSectionProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

    const { data, setData, post, put, processing, errors, reset } =
        useForm(emptyAddress);

    const openCreate = () => {
        setEditingAddress(null);
        reset();
        setDialogOpen(true);
    };

    const openEdit = (addr: Address) => {
        setEditingAddress(addr);
        setData({
            country: addr.country,
            city: addr.city,
            district: addr.district,
            address: addr.address,
            reference: addr.reference ?? '',
            postal_code: addr.postal_code ?? '',
        });
        setDialogOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            put(`/profile/addresses/${editingAddress.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                },
            });
        } else {
            post('/profile/addresses', {
                preserveScroll: true,
                onSuccess: () => {
                    setDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/profile/addresses/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    };

    return (
        <div className="space-y-6">
            {flash && <FlashMessage message={flash} />}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Direcciones</h2>
                    <p className="text-sm text-muted-foreground">
                        Gestiona tus direcciones de envío.
                    </p>
                </div>
                <Button size="sm" className="gap-2" onClick={openCreate}>
                    <Plus className="h-4 w-4" /> Agregar
                </Button>
            </div>
            <Separator />

            {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
                    <MapPin className="h-10 w-10 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium">
                        Sin direcciones guardadas
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Agrega una dirección para agilizar tus compras
                    </p>
                    <Button
                        size="sm"
                        className="mt-4 gap-2"
                        onClick={openCreate}
                    >
                        <Plus className="h-4 w-4" /> Agregar dirección
                    </Button>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className="group relative rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm"
                        >
                            <div className="mb-1 flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <span className="text-sm font-medium">
                                        {addr.city}, {addr.district}
                                    </span>
                                </div>
                                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => openEdit(addr)}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                        onClick={() => setDeleteTarget(addr)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                            <p className="ml-6 text-sm text-muted-foreground">
                                {addr.address}
                            </p>
                            {addr.reference && (
                                <p className="mt-0.5 ml-6 text-xs text-muted-foreground">
                                    Ref: {addr.reference}
                                </p>
                            )}
                            <div className="mt-1.5 ml-6 flex flex-wrap gap-1.5">
                                <Badge variant="secondary" className="text-xs">
                                    {addr.country}
                                </Badge>
                                {addr.postal_code && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {addr.postal_code}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress
                                ? 'Editar dirección'
                                : 'Nueva dirección'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label>País</Label>
                                <Input
                                    value={data.country}
                                    onChange={(e) =>
                                        setData('country', e.target.value)
                                    }
                                    placeholder="Perú"
                                />
                                <InputError message={errors.country} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Ciudad</Label>
                                <Input
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    placeholder="Lima"
                                />
                                <InputError message={errors.city} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Distrito</Label>
                            <Input
                                value={data.district}
                                onChange={(e) =>
                                    setData('district', e.target.value)
                                }
                                placeholder="Miraflores"
                            />
                            <InputError message={errors.district} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Dirección</Label>
                            <Input
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder="Av. Larco 123"
                            />
                            <InputError message={errors.address} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label>
                                    Referencia{' '}
                                    <span className="text-muted-foreground">
                                        (opcional)
                                    </span>
                                </Label>
                                <Input
                                    value={data.reference}
                                    onChange={(e) =>
                                        setData('reference', e.target.value)
                                    }
                                    placeholder="Frente al parque"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>
                                    Código postal{' '}
                                    <span className="text-muted-foreground">
                                        (opcional)
                                    </span>
                                </Label>
                                <Input
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData('postal_code', e.target.value)
                                    }
                                    placeholder="15074"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Guardando…'
                                    : editingAddress
                                      ? 'Guardar cambios'
                                      : 'Agregar dirección'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar dirección?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará{' '}
                            <strong>{deleteTarget?.full_address}</strong>. Esta
                            acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
