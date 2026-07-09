import { Head } from '@inertiajs/react';
import { Lock, ChevronRight } from 'lucide-react';

const sections = [
    {
        id: 'introduccion',
        title: '1. Introducción',
        content:
            'Nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos tu información cuando visitas nuestro sitio web o realizas una compra. Lee esta política detenidamente. Si no estás de acuerdo con sus términos, por favor abstente de acceder al sitio.',
    },
    {
        id: 'recopilacion',
        title: '2. Información que recopilamos',
        content:
            'Podemos recopilar información sobre ti de diversas formas. La información que podemos recopilar en el sitio incluye: (a) Datos personales: nombre, dirección de correo electrónico, número de teléfono y dirección que proporcionas voluntariamente al registrarte o realizar una compra. (b) Datos de uso: información sobre cómo usas el sitio, como páginas visitadas, tiempo de permanencia y enlaces en los que haces clic. (c) Datos del dispositivo: información sobre tu dispositivo, dirección IP, tipo de navegador y sistema operativo.',
    },
    {
        id: 'uso',
        title: '3. Uso de tu información',
        content:
            'Utilizamos la información que recopilamos para: procesar tus pedidos y gestionar tu cuenta; enviarte correos electrónicos relacionados con tu compra, incluyendo confirmaciones y actualizaciones de estado; responderte a tus consultas y solucionar cualquier problema que puedas tener; enviarte información promocional y de marketing (con tu consentimiento previo); cumplir con obligaciones legales y proteger nuestros derechos legales; mejorar nuestro sitio web, productos y servicios.',
    },
    {
        id: 'compartir',
        title: '4. Divulgación de tu información',
        content:
            'Podemos compartir tu información en las siguientes situaciones: con proveedores de servicios que nos asisten en la operación de nuestro sitio y la prestación de servicios (quienes están obligados a mantener la confidencialidad de tu información); con autoridades gubernamentales cuando lo exija la ley; en caso de fusión, adquisición o venta de activos, en cuyo caso te notificaremos antes de que tu información personal sea transferida. No vendemos, arrendamos ni cedemos tu información personal a terceros con fines comerciales.',
    },
    {
        id: 'cookies',
        title: '5. Cookies y tecnologías de seguimiento',
        content:
            'Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio. Las cookies son pequeños archivos de datos que se almacenan en tu dispositivo. Puedes controlar el uso de cookies a través de la configuración de tu navegador. Sin embargo, si bloqueas las cookies, es posible que algunas funciones del sitio no funcionen correctamente. Utilizamos cookies propias y de terceros para analizar el tráfico, personalizar el contenido y gestionar tu sesión de usuario.',
    },
    {
        id: 'seguridad',
        title: '6. Seguridad de tu información',
        content:
            'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por utilizar medios comercialmente aceptables para proteger tu información personal, no podemos garantizar su seguridad absoluta.',
    },
    {
        id: 'derechos',
        title: '7. Tus derechos (ARCO)',
        content:
            'De conformidad con la Ley N° 29733 – Ley de Protección de Datos Personales del Perú, tienes los siguientes derechos sobre tus datos personales: Acceso: conocer qué datos personales tuyos tenemos almacenados. Rectificación: corregir datos inexactos o incompletos. Cancelación: solicitar la eliminación de tus datos cuando ya no sean necesarios. Oposición: oponerte al tratamiento de tus datos en determinadas circunstancias. Para ejercer estos derechos, envíanos un correo a contacto@makitoolsperu.com.',
    },
    {
        id: 'menores',
        title: '8. Privacidad de menores de edad',
        content:
            'Nuestro sitio no está dirigido a personas menores de 18 años. No recopilamos conscientemente información personal de menores de edad. Si eres padre, madre o tutor y crees que tu hijo nos ha proporcionado información personal, contáctanos para que podamos eliminarla de nuestros registros.',
    },
    {
        id: 'terceros',
        title: '9. Enlaces a sitios de terceros',
        content:
            'Nuestro sitio puede contener enlaces a otros sitios web que no son operados por nosotros. Si haces clic en un enlace de terceros, serás dirigido al sitio de ese tercero. Te recomendamos encarecidamente que revises la Política de Privacidad de cada sitio que visites. No tenemos control ni asumimos responsabilidad por el contenido, las políticas de privacidad o las prácticas de sitios o servicios de terceros.',
    },
    {
        id: 'cambios',
        title: '10. Cambios a esta política',
        content:
            'Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos cualquier cambio publicando la nueva política en esta página con una fecha de actualización revisada. Te recomendamos revisar esta política periódicamente para estar informado de cómo protegemos tu información. Los cambios a esta Política de Privacidad entran en vigencia cuando se publican en esta página.',
    },
    {
        id: 'contacto',
        title: '11. Contacto',
        content:
            'Si tienes preguntas o comentarios sobre esta Política de Privacidad, o si deseas ejercer tus derechos ARCO, puedes contactarnos a través de: correo electrónico: contacto@makitoolsperu.com | teléfono: +51 XXX XXX XXX | dirección postal: [Dirección de la empresa], Lima – Perú. Atenderemos tu solicitud en un plazo máximo de 20 días hábiles.',
    },
];

export default function PoliticaPrivacidad() {
    return (
        <>
            <Head title="Política de Privacidad" />

            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                                <Lock className="h-7 w-7 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Política de Privacidad
                                </h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Última actualización: Mayo 2026 · Ley N°
                                    29733 – Protección de Datos Personales
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
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700"
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
                            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                                <p className="text-sm text-emerald-800">
                                    Tu privacidad es importante para nosotros.
                                    Esta política describe cómo tratamos tu
                                    información personal y los derechos que
                                    tienes sobre ella conforme a la legislación
                                    peruana vigente.
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
                                    ¿Deseas ejercer tus derechos o tienes dudas?{' '}
                                    <a
                                        href="mailto:contacto@makitoolsperu.com"
                                        className="font-medium text-emerald-600 hover:underline"
                                    >
                                        Escríbenos
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
