import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Register() {
    const [registrationType, setRegistrationType] = useState('client');

    return (
        <>
            <Head title="Registro" />
            <div className="flex flex-col gap-6">
                <div className="flex justify-center gap-4 mb-2">
                    <Button 
                        type="button" 
                        variant={registrationType === 'client' ? 'default' : 'outline'}
                        onClick={() => setRegistrationType('client')}
                        className="flex-1"
                    >
                        Soy Cliente
                    </Button>
                    <Button 
                        type="button" 
                        variant={registrationType === 'seller' ? 'default' : 'outline'}
                        onClick={() => setRegistrationType('seller')}
                        className="flex-1"
                    >
                        Soy Vendedor
                    </Button>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="registration_type" value={registrationType} />
                            
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre{registrationType === 'seller' ? ' del Contacto' : ''}</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Tu nombre"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {registrationType === 'client' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">Apellido</Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            required
                                            tabIndex={1.5}
                                            autoComplete="family-name"
                                            name="last_name"
                                            placeholder="Tu apellido"
                                        />
                                        <InputError message={errors.last_name} />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="correo@ejemplo.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Celular</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        required
                                        tabIndex={2.5}
                                        autoComplete="tel"
                                        name="phone"
                                        placeholder="987654321"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                {registrationType === 'seller' && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="business_name">Nombre del Negocio</Label>
                                            <Input
                                                id="business_name"
                                                type="text"
                                                required
                                                name="business_name"
                                                placeholder="Ej. Mi Tienda Tech"
                                            />
                                            <InputError message={errors.business_name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="business_type">Tipo de Negocio</Label>
                                            <Input
                                                id="business_type"
                                                type="text"
                                                required
                                                name="business_type"
                                                placeholder="Tecnología, Moda, Ropa, etc."
                                            />
                                            <InputError message={errors.business_type} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="document_type">Tipo de Documento</Label>
                                                <select 
                                                    id="document_type" 
                                                    name="document_type"
                                                    required
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="DNI">DNI</option>
                                                    <option value="RUC">RUC</option>
                                                </select>
                                                <InputError message={errors.document_type} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="document_number">Número de Documento</Label>
                                                <Input
                                                    id="document_number"
                                                    type="text"
                                                    required
                                                    name="document_number"
                                                    placeholder="Número de DNI o RUC"
                                                />
                                                <InputError message={errors.document_number} />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="address">Dirección del Negocio</Label>
                                            <Input
                                                id="address"
                                                type="text"
                                                required
                                                name="address"
                                                placeholder="Calle, Número, Distrito"
                                            />
                                            <InputError message={errors.address} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="experience">Cuéntanos tu experiencia</Label>
                                            <textarea
                                                id="experience"
                                                name="experience"
                                                required
                                                placeholder="¿Por qué quieres vender con nosotros?"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                            <InputError message={errors.experience} />
                                        </div>
                                    </>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Contraseña"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirmar contraseña"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full"
                                    tabIndex={5}
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    Crear cuenta
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                ¿Ya tienes una cuenta?{' '}
                                <TextLink href={login()} tabIndex={6}>
                                    Inicia sesión
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Crear una cuenta',
    description: 'Ingresa tus datos a continuación para crear tu cuenta',
};
