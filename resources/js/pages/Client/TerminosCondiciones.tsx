import { Head } from '@inertiajs/react';
import { Scale, ChevronRight } from 'lucide-react';

const sections = [
    {
        id: 'aceptacion',
        title: '1. Aceptación de los términos',
        content:
            'Al acceder y utilizar este sitio web, aceptas quedar vinculado por estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de las leyes locales aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas comerciales aplicables.',
    },
    {
        id: 'uso',
        title: '2. Uso del sitio',
        content:
            'Se te otorga una licencia limitada para descargar temporalmente una copia de los materiales (información o software) en el sitio web de la empresa, solo para visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia no puedes: modificar o copiar los materiales; usar los materiales para ningún propósito comercial; intentar descompilar o realizar ingeniería inversa de cualquier software contenido en el sitio web; eliminar los derechos de autor u otras notaciones de propiedad de los materiales; o transferir los materiales a otra persona.',
    },
    {
        id: 'compras',
        title: '3. Proceso de compra',
        content:
            'Al realizar una compra en nuestra tienda, garantizas que la información que proporcionas es verídica y completa. Nos reservamos el derecho de rechazar o cancelar cualquier pedido por cualquier motivo, incluyendo pero no limitado a: disponibilidad del producto, errores en la descripción o precio del producto, o problemas identificados por nuestro equipo de seguridad. El precio de los productos puede cambiar sin previo aviso. Nos reservamos el derecho de modificar o discontinuar el servicio sin previo aviso.',
    },
    {
        id: 'pagos',
        title: '4. Pagos y facturación',
        content:
            'Aceptamos pagos mediante transferencia bancaria y Yape. Al realizar un pago, confirmas que estás autorizado a utilizar el método de pago seleccionado. Todos los precios se muestran en soles peruanos (S/) e incluyen los impuestos aplicables. El pago debe ser confirmado por nuestro equipo antes de procesar el pedido. En caso de error en el cobro, nos comprometemos a resolver la situación en el menor tiempo posible.',
    },
    {
        id: 'envio',
        title: '5. Envíos y entregas',
        content:
            'Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad. No nos hacemos responsables de retrasos causados por factores fuera de nuestro control. El riesgo de pérdida y el título de los artículos comprados pasan a ti al momento de la entrega al transportista. Es tu responsabilidad inspeccionar los productos al recibirlos y reportar cualquier daño en un plazo de 24 horas.',
    },
    {
        id: 'devolucion',
        title: '6. Devoluciones y reembolsos',
        content:
            'Aceptamos devoluciones dentro de los 15 días calendario posteriores a la fecha de entrega, siempre que el producto se encuentre en su estado original, sin uso y en su empaque original. Los gastos de envío para devoluciones corren por cuenta del cliente, salvo en casos de productos defectuosos o envíos incorrectos. Los reembolsos se procesarán en un plazo de 7 a 10 días hábiles una vez que recibamos y verifiquemos el producto devuelto.',
    },
    {
        id: 'responsabilidad',
        title: '7. Limitación de responsabilidad',
        content:
            'En ningún caso la empresa será responsable de daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar los materiales en el sitio web, incluso si se ha notificado a la empresa de la posibilidad de tales daños. Dado que algunas jurisdicciones no permiten limitaciones a las garantías implícitas o limitaciones de responsabilidad por daños incidentales o consecuentes, estas limitaciones pueden no aplicarse a ti.',
    },
    {
        id: 'propiedad',
        title: '8. Propiedad intelectual',
        content:
            'Todo el contenido incluido en este sitio, como texto, gráficos, logotipos, iconos de botones, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de la empresa o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual. Queda prohibida la reproducción total o parcial de los contenidos sin previa autorización escrita.',
    },
    {
        id: 'modificaciones',
        title: '9. Modificaciones',
        content:
            'La empresa puede revisar estos Términos y Condiciones en cualquier momento sin previo aviso. Al usar este sitio web, aceptas estar vinculado por la versión actual de estos Términos y Condiciones. Te recomendamos revisar periódicamente esta página para conocer cualquier cambio. El uso continuado del sitio después de la publicación de cambios constituye tu aceptación de dichos cambios.',
    },
    {
        id: 'ley',
        title: '10. Ley aplicable',
        content:
            'Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de la República del Perú, y te sometes irrevocablemente a la jurisdicción exclusiva de los tribunales de Lima, Perú. Cualquier disputa que surja en relación con estos términos será resuelta conforme a la legislación peruana vigente.',
    },
];

export default function TerminosCondiciones() {
    return (
        <>
            <Head title="Términos y Condiciones" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
                                <Scale className="h-7 w-7 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Términos y Condiciones
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Última actualización: Mayo 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl lg:flex lg:gap-10">
                        {/* Índice lateral */}
                        <aside className="mb-8 lg:mb-0 lg:w-64 lg:shrink-0">
                            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="mb-3 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                                    Contenido
                                </p>
                                <nav className="space-y-1">
                                    {sections.map((s) => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                                        >
                                            <ChevronRight className="h-3 w-3 shrink-0" />
                                            <span className="truncate">
                                                {s.title}
                                            </span>
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Contenido */}
                        <div className="flex-1 space-y-6">
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                                <p className="text-sm text-indigo-800">
                                    Por favor, lee detenidamente estos Términos y
                                    Condiciones antes de utilizar nuestra
                                    plataforma. Al acceder o usar nuestros
                                    servicios, confirmas que has leído,
                                    comprendido y aceptado estos términos.
                                </p>
                            </div>

                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                                >
                                    <h2 className="mb-3 text-base font-semibold text-gray-900">
                                        {section.title}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-gray-600">
                                        {section.content}
                                    </p>
                                </div>
                            ))}

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <p className="text-sm text-gray-500">
                                    ¿Tienes preguntas sobre nuestros Términos y
                                    Condiciones?{' '}
                                    <a
                                        href="mailto:legal@empresa.com"
                                        className="font-medium text-indigo-600 hover:underline"
                                    >
                                        Contáctanos
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
