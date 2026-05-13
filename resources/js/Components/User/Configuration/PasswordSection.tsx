import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { FlashMessage } from './FlashMessage';
import { InputError } from './InputError';
import { PasswordStrength } from './PasswordStrength';

interface PasswordSectionProps {
    flash?: string;
}

export function PasswordSection({ flash }: PasswordSectionProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/profile/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const toggle = (field: keyof typeof show) =>
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));

    return (
        <div className="space-y-6">
            {flash && <FlashMessage message={flash} />}
            <div>
                <h2 className="text-lg font-semibold">Cambiar Contraseña</h2>
                <p className="text-sm text-muted-foreground">
                    Usa una contraseña segura de al menos 8 caracteres.
                </p>
            </div>
            <Separator />
            <form onSubmit={submit} className="max-w-md space-y-5">
                <div className="space-y-1.5">
                    <Label htmlFor="current_password">Contraseña actual</Label>
                    <div className="relative">
                        <Input
                            id="current_password"
                            type={show.current ? 'text' : 'password'}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            className="pr-10"
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => toggle('current')}
                        >
                            {show.current ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.current_password} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password">Nueva contraseña</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={show.new ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="pr-10"
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => toggle('new')}
                        >
                            {show.new ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {data.password && (
                        <PasswordStrength password={data.password} />
                    )}
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password_confirmation">
                        Confirmar contraseña
                    </Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={show.confirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            className="pr-10"
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => toggle('confirm')}
                        >
                            {show.confirm ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {data.password_confirmation &&
                        data.password !== data.password_confirmation && (
                            <p className="text-xs text-destructive">
                                Las contraseñas no coinciden.
                            </p>
                        )}
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Actualizando…' : 'Actualizar contraseña'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
