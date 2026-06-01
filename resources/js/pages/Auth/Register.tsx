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

export default function Register() {
    const [registrationType, setRegistrationType] = useState('client');

    return (
        <>
            <Head title="Registro" />

            <div className="mx-auto max-w-7xl p-4">
                <div className="overflow-hidden rounded-3xl border bg-white shadow-2xl lg:grid lg:grid-cols-2">
                    {/* Lado izquierdo - Marketing / Información */}
                    <div className="flex flex-col justify-between bg-black p-8 text-white lg:p-10">
                        <div>
                            <div className="mb-8 flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-white" />
                                <h2 className="text-3xl font-bold">
                                    Matt-Ecommerce
                                </h2>
                            </div>

                            <h2 className="mb-4 text-4xl leading-tight font-bold lg:text-5xl">
                                El marketplace que impulsa tu negocio
                            </h2>

                            <p className="mb-10 text-zinc-400">
                                Únete a miles de compradores y vendedores que ya
                                confían en nuestra plataforma para crecer.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold">
                                        Compras 100% seguras
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        Pagos protegidos y garantía en cada
                                        transacción.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Envíos a todo el Perú
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        Cobertura nacional con seguimiento en
                                        tiempo real.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Haz crecer tu negocio
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        Herramientas de análisis y ventas para
                                        vendedores.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold">
                                        Soporte dedicado 24/7
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        Siempre hay alguien listo para ayudarte.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            {/* Testimonio */}
                            <div className="mb-6 rounded-2xl border border-zinc-800 p-5">
                                <p className="text-zinc-300 italic">
                                    "Desde que empecé a vender en
                                    Matt-Ecommerce, mis ventas crecieron un 300%
                                    en solo 3 meses. La plataforma es
                                    increíble."
                                </p>
                                <div className="mt-4">
                                    <p className="font-semibold">
                                        María Rodríguez
                                    </p>
                                    <p className="text-sm text-zinc-500">
                                        Vendedora — Lima, Perú
                                    </p>
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-xl border border-zinc-800 p-4 text-center">
                                    <div className="text-2xl font-bold">
                                        50K+
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Llevamos activos
                                    </div>
                                </div>
                                <div className="rounded-xl border border-zinc-800 p-4 text-center">
                                    <div className="text-2xl font-bold">
                                        8K+
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Vendedores
                                    </div>
                                </div>
                                <div className="rounded-xl border border-zinc-800 p-4 text-center">
                                    <div className="text-2xl font-bold">
                                        4.9★
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Calificación
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lado derecho - Formulario de registro */}
                    <div className="p-8 lg:p-10">
                        <div className="mb-6">
                            <p className="mb-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                                Marketplace
                            </p>
                            <h1 className="text-3xl font-bold">
                                Crear una cuenta
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Ingresa tus datos para comenzar
                            </p>
                        </div>

                        {/* Selector de tipo de usuario */}
                        <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border p-1">
                            <Button
                                type="button"
                                variant={
                                    registrationType === 'client'
                                        ? 'default'
                                        : 'ghost'
                                }
                                onClick={() => setRegistrationType('client')}
                                className="h-12 rounded-lg"
                            >
                                Soy Cliente
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    registrationType === 'seller'
                                        ? 'default'
                                        : 'ghost'
                                }
                                onClick={() => setRegistrationType('seller')}
                                className="h-12 rounded-lg"
                            >
                                Soy Vendedor
                            </Button>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={[
                                'password',
                                'password_confirmation',
                            ]}
                            disableWhileProcessing
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="registration_type"
                                        value={registrationType}
                                    />

                                    <div className="space-y-4">
                                        {/* Nombre */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Nombre
                                                {registrationType === 'seller'
                                                    ? ' del Contacto'
                                                    : ''}
                                            </Label>
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

                                        {/* Apellido - solo para clientes */}
                                        {registrationType === 'client' && (
                                            <div className="grid gap-2">
                                                <Label htmlFor="last_name">
                                                    Apellido
                                                </Label>
                                                <Input
                                                    id="last_name"
                                                    type="text"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="family-name"
                                                    name="last_name"
                                                    placeholder="Tu apellido"
                                                />
                                                <InputError
                                                    message={errors.last_name}
                                                />
                                            </div>
                                        )}

                                        {/* Correo electrónico */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">
                                                Correo electrónico
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={3}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="correo@ejemplo.com"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        {/* Celular */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">
                                                Celular
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                required
                                                tabIndex={4}
                                                autoComplete="tel"
                                                name="phone"
                                                placeholder="987654321"
                                            />
                                            <InputError
                                                message={errors.phone}
                                            />
                                        </div>

                                        {/* Campos adicionales para vendedor */}
                                        {registrationType === 'seller' && (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="business_name">
                                                        Nombre del Negocio
                                                    </Label>
                                                    <Input
                                                        id="business_name"
                                                        type="text"
                                                        required
                                                        name="business_name"
                                                        placeholder="Ej. Mi Tienda Tech"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.business_name
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="business_type">
                                                        Tipo de Negocio
                                                    </Label>
                                                    <Input
                                                        id="business_type"
                                                        type="text"
                                                        required
                                                        name="business_type"
                                                        placeholder="Tecnología, Moda, Ropa, etc."
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.business_type
                                                        }
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="document_type">
                                                            Tipo de Documento
                                                        </Label>
                                                        <select
                                                            id="document_type"
                                                            name="document_type"
                                                            required
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="DNI">
                                                                DNI
                                                            </option>
                                                            <option value="RUC">
                                                                RUC
                                                            </option>
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.document_type
                                                            }
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="document_number">
                                                            Número de Documento
                                                        </Label>
                                                        <Input
                                                            id="document_number"
                                                            type="text"
                                                            required
                                                            name="document_number"
                                                            placeholder="Número de DNI o RUC"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.document_number
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="address">
                                                        Dirección del Negocio
                                                    </Label>
                                                    <Input
                                                        id="address"
                                                        type="text"
                                                        required
                                                        name="address"
                                                        placeholder="Calle, Número, Distrito"
                                                    />
                                                    <InputError
                                                        message={errors.address}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="experience">
                                                        Cuéntanos tu experiencia
                                                    </Label>
                                                    <textarea
                                                        id="experience"
                                                        name="experience"
                                                        required
                                                        placeholder="¿Por qué quieres vender con nosotros?"
                                                        className="min-h-80px flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.experience
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Contraseña */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password">
                                                Contraseña
                                            </Label>
                                            <PasswordInput
                                                id="password"
                                                required
                                                tabIndex={5}
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Mínimo 8 caracteres"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        {/* Confirmar contraseña */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirmar contraseña
                                            </Label>
                                            <PasswordInput
                                                id="password_confirmation"
                                                required
                                                tabIndex={6}
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Repite tu contraseña"
                                            />
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>

                                        {/* Botón crear cuenta */}
                                        <Button
                                            type="submit"
                                            className="mt-2 w-full"
                                            tabIndex={7}
                                            data-test="register-user-button"
                                        >
                                            {processing && <Spinner />}
                                            Crear cuenta
                                        </Button>
                                    </div>

                                    {/* Link inicio de sesión */}
                                    <div className="text-center text-sm text-muted-foreground">
                                        ¿Ya tienes una cuenta?{' '}
                                        <TextLink href={login()} tabIndex={8}>
                                            Inicia sesión
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Crear una cuenta',
    description: 'Ingresa tus datos a continuación para crear tu cuenta',
};
