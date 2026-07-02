import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Truck,
    CreditCard,
    RotateCcw,
    UserCircle,
} from 'lucide-react';

type FaqItem = { id: string; question: string; answer: string };
type FaqCategory = {
    id: string;
    title: string;
    icon: React.ElementType;
    color: string;
    items: FaqItem[];
};

const categories: FaqCategory[] = [
    {
        id: 'envios',
        title: 'Envíos y entregas',
        icon: Truck,
        color: 'text-blue-600',
        items: [
            {
                id: 'envios-1',
                question: '¿Cuánto tiempo tarda en llegar mi pedido?',
                answer: 'Los pedidos dentro de Lima se entregan en 1 a 3 días hábiles. Para provincias, el plazo es de 3 a 7 días hábiles dependiendo de la ubicación. Una vez confirmado el pago, recibirás una notificación con el seguimiento de tu pedido.',
            },
            {
                id: 'envios-2',
                question: '¿Realizan envíos a todo el Perú?',
                answer: 'Sí, realizamos envíos a nivel nacional. El costo de envío se calcula automáticamente según tu ubicación al momento de finalizar la compra.',
            },
            {
                id: 'envios-3',
                question: '¿Cómo hago seguimiento de mi pedido?',
                answer: 'Una vez despachado tu pedido, recibirás un correo electrónico con el código de seguimiento y el enlace para rastrearlo en tiempo real. También puedes consultarlo desde la sección "Mis pedidos" en tu cuenta.',
            },
            {
                id: 'envios-4',
                question: '¿Qué hago si mi pedido llega dañado?',
                answer: 'Si recibes un producto dañado, toma fotos del empaque y el producto antes de abrirlo y contáctanos dentro de las 24 horas siguientes a la recepción. Gestionaremos el reemplazo o reembolso sin costo adicional para ti.',
            },
        ],
    },
    {
        id: 'pagos',
        title: 'Pagos',
        icon: CreditCard,
        color: 'text-violet-600',
        items: [
            {
                id: 'pagos-1',
                question: '¿Qué métodos de pago aceptan?',
                answer: 'Aceptamos transferencia bancaria (BCP) y Yape. Puedes pagar con Yape usando tu código de aprobación o escaneando nuestro QR. En ambos métodos deberás adjuntar tu comprobante de pago para confirmar la compra.',
            },
            {
                id: 'pagos-2',
                question: '¿Es seguro pagar en su sitio?',
                answer: 'Sí. Nuestro sitio web utiliza protocolo HTTPS con cifrado SSL. No almacenamos datos de tarjetas ni información financiera sensible. Todos los comprobantes de pago son revisados por nuestro equipo antes de procesar el pedido.',
            },
            {
                id: 'pagos-3',
                question: '¿Cuándo se confirma mi pago?',
                answer: 'Una vez que subas tu comprobante, nuestro equipo lo verificará en un plazo máximo de 2 horas en horario laboral (lunes a sábado de 9 a.m. a 6 p.m.). Recibirás una confirmación por correo electrónico.',
            },
            {
                id: 'pagos-4',
                question: '¿Los precios incluyen IGV?',
                answer: 'Sí, todos los precios mostrados en nuestra tienda incluyen el Impuesto General a las Ventas (IGV) del 18%. El precio que ves es el precio final que pagarás.',
            },
        ],
    },
    {
        id: 'devoluciones',
        title: 'Devoluciones y reembolsos',
        icon: RotateCcw,
        color: 'text-amber-600',
        items: [
            {
                id: 'dev-1',
                question: '¿Cuál es la política de devoluciones?',
                answer: 'Aceptamos devoluciones dentro de los 15 días calendario desde la fecha de entrega, siempre que el producto esté en su estado original, sin uso y con su empaque original. No se aceptan devoluciones de productos personalizados o con descuento especial.',
            },
            {
                id: 'dev-2',
                question: '¿Cómo solicito una devolución?',
                answer: 'Escríbenos a través de nuestro formulario de contacto o al correo indicado en la sección "Contacto", indicando tu número de pedido y el motivo de la devolución. Nuestro equipo te responderá en máximo 24 horas hábiles con las instrucciones para proceder.',
            },
            {
                id: 'dev-3',
                question: '¿Cuándo recibiré mi reembolso?',
                answer: 'Una vez recibido y verificado el producto devuelto, procesaremos tu reembolso en un plazo de 7 a 10 días hábiles. El monto será transferido al mismo método con el que realizaste el pago original.',
            },
            {
                id: 'dev-4',
                question: '¿Quién cubre los gastos de devolución?',
                answer: 'Los gastos de envío por devolución corren por cuenta del cliente, salvo en casos donde el producto presente defecto de fábrica o haya habido un error en el despacho, en cuyo caso nosotros asumimos el costo.',
            },
        ],
    },
    {
        id: 'cuenta',
        title: 'Cuenta y registro',
        icon: UserCircle,
        color: 'text-emerald-600',
        items: [
            {
                id: 'cuenta-1',
                question: '¿Es obligatorio registrarme para comprar?',
                answer: 'Sí, para realizar una compra necesitas tener una cuenta registrada. Esto nos permite gestionar tus pedidos, enviarte confirmaciones y que puedas hacer seguimiento de tus compras desde "Mis pedidos".',
            },
            {
                id: 'cuenta-2',
                question: '¿Olvidé mi contraseña, qué hago?',
                answer: 'En la pantalla de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla. Revisa también tu carpeta de spam si no lo recibes en unos minutos.',
            },
            {
                id: 'cuenta-3',
                question: '¿Puedo cambiar mi dirección de entrega?',
                answer: 'Sí, puedes actualizar tu dirección de entrega desde la sección "Configuración" en tu cuenta. Si ya tienes un pedido en proceso, contáctanos lo antes posible para coordinar el cambio antes del despacho.',
            },
            {
                id: 'cuenta-4',
                question: '¿Cómo puedo cancelar un pedido?',
                answer: 'Puedes cancelar tu pedido siempre que no haya sido despachado. Para hacerlo, escríbenos indicando tu número de pedido. Una vez despachado, no es posible cancelarlo, pero puedes solicitar una devolución al recibirlo.',
            },
        ],
    },
];

function AccordionItem({ item }: { item: FaqItem }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between py-4 text-left transition hover:text-gray-900"
            >
                <span className="pr-4 text-sm font-medium text-gray-800">
                    {item.question}
                </span>
                {open ? (
                    <ChevronUp size={16} className="shrink-0 text-gray-400" />
                ) : (
                    <ChevronDown size={16} className="shrink-0 text-gray-400" />
                )}
            </button>
            {open && (
                <p className="pb-4 text-sm leading-relaxed text-gray-500">
                    {item.answer}
                </p>
            )}
        </div>
    );
}

export default function PreguntasFrecuentes() {
    return (
        <>
            <Head title="Preguntas Frecuentes" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
                                <HelpCircle className="h-7 w-7 text-sky-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Preguntas Frecuentes
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Encuentra respuestas rápidas a las dudas más
                                    comunes
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
                                    Categorías
                                </p>
                                <nav className="space-y-1">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        return (
                                            <a
                                                key={cat.id}
                                                href={`#${cat.id}`}
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-sky-50 hover:text-sky-700"
                                            >
                                                <Icon
                                                    size={14}
                                                    className="shrink-0"
                                                />
                                                <span className="truncate">
                                                    {cat.title}
                                                </span>
                                            </a>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>

                        {/* Contenido */}
                        <div className="flex-1 space-y-6">
                            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
                                <p className="text-sm text-sky-800">
                                    ¿No encuentras lo que buscas? Escríbenos y
                                    te ayudamos a resolver tu duda lo antes
                                    posible.
                                </p>
                            </div>

                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <div
                                        key={cat.id}
                                        id={cat.id}
                                        className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                                    >
                                        <div className="mb-4 flex items-center gap-3">
                                            <Icon
                                                size={20}
                                                className={cat.color}
                                            />
                                            <h2 className="text-base font-semibold text-gray-900">
                                                {cat.title}
                                            </h2>
                                        </div>
                                        <div>
                                            {cat.items.map((item) => (
                                                <AccordionItem
                                                    key={item.id}
                                                    item={item}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                                <p className="text-sm text-gray-500">
                                    ¿Tienes otra consulta?{' '}
                                    <a
                                        href="/contacto"
                                        className="font-medium text-sky-600 hover:underline"
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
