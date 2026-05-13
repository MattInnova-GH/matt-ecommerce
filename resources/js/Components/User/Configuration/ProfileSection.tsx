import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FlashMessage } from './FlashMessage';
import { InputError } from './InputError';
import { AvatarSubSection } from './AvatarSubSection';
import { User } from './types/settings';

interface ProfileSectionProps {
    user: User;
    flash?: string;
}

export function ProfileSection({ user, flash }: ProfileSectionProps) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone ?? '',
        dni: user.dni ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile', { preserveScroll: true });
    };

    return (
        <div className="space-y-6">
            {flash && <FlashMessage message={flash} />}
            <div>
                <h2 className="text-lg font-semibold">Información Personal</h2>
                <p className="text-sm text-muted-foreground">
                    Actualiza tu nombre, correo y datos de contacto.
                </p>
            </div>
            <Separator />
            <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="first_name">Nombres</Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) =>
                                setData('first_name', e.target.value)
                            }
                        />
                        <InputError message={errors.first_name} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="last_name">Apellidos</Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData('last_name', e.target.value)
                            }
                        />
                        <InputError message={errors.last_name} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Opcional"
                        />
                        <InputError message={errors.phone} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            value={data.dni}
                            onChange={(e) => setData('dni', e.target.value)}
                            placeholder="Opcional"
                        />
                        <InputError message={errors.dni} />
                    </div>
                </div>
                <Separator />
                <AvatarSubSection user={user} />
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Guardando…' : 'Actualizar información'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
