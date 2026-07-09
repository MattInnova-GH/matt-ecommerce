import { Link } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertTriangle,
    BarChart2,
    Bot,
    Clock,
    ClipboardList,
    CreditCard,
    FileText,
    Heart,
    HelpCircle,
    LayoutGrid,
    Landmark,
    Lock,
    LogIn,
    MapPin,
    MessageCircle,
    Package,
    Phone,
    RotateCcw,
    Search,
    Send,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Tag,
    Truck,
    UserCog,
    UserPlus,
    X,
    XCircle,
    ChevronDown,
    CircleCheck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Map icon names returned by PHP to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
    'alert-triangle': AlertTriangle,
    'bar-chart-2': BarChart2,
    bot: Bot,
    'circle-check': CircleCheck,
    'clipboard-list': ClipboardList,
    clock: Clock,
    'credit-card': CreditCard,
    'file-text': FileText,
    heart: Heart,
    'help-circle': HelpCircle,
    landmark: Landmark,
    'layout-grid': LayoutGrid,
    lock: Lock,
    'log-in': LogIn,
    'map-pin': MapPin,
    'message-circle': MessageCircle,
    package: Package,
    phone: Phone,
    'rotate-ccw': RotateCcw,
    search: Search,
    'shield-check': ShieldCheck,
    'shopping-bag': ShoppingBag,
    'shopping-cart': ShoppingCart,
    smartphone: Smartphone,
    sparkles: Sparkles,
    tag: Tag,
    truck: Truck,
    'user-cog': UserCog,
    'user-plus': UserPlus,
    'x-circle': XCircle,
};

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    icon?: string;
    timestamp: Date;
}

const QUICK_QUESTIONS = [
    '¿Cómo puedo pagar?',
    '¿Cuánto demora el envío?',
    '¿Cómo devuelvo un producto?',
    '¿Cómo creo una cuenta?',
];

const WELCOME: Message = {
    id: 0,
    text: '¡Hola! Bienvenido a nuestra tienda. Estoy aquí para ayudarte con dudas sobre productos, envíos, pagos y más.\n\n¿En qué puedo ayudarte? También puedes escribirme el nombre de un producto, categoría o marca y te digo el precio y stock actual.',
    sender: 'bot',
    icon: 'sparkles',
    timestamp: new Date(),
};

function BotIcon({ name, size = 14 }: { name?: string; size?: number }) {
    const Icon = name && ICON_MAP[name] ? ICON_MAP[name] : HelpCircle;
    return <Icon size={size} />;
}

// Convierte una línea de texto en nodos React, soportando:
// - **negrita**
// - rutas internas /productos/... y /categorias/... (como Link de Inertia)
// - URLs externas http(s)://...
function renderLineWithLinksAndBold(line: string, keyPrefix: string) {
    const tokenRegex =
        /(\*\*[^*]+\*\*|https?:\/\/[^\s]+|\/productos\/[^\s]+|\/categorias\/[^\s]+)/g;
    const parts = line
        .split(tokenRegex)
        .filter((p) => p !== undefined && p !== '');

    return parts.map((part, i) => {
        const key = `${keyPrefix}-${i}`;

        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={key} className="font-semibold">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        if (part.startsWith('/productos/') || part.startsWith('/categorias/')) {
            return (
                <Link
                    key={key}
                    href={part}
                    className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                    Ver más
                </Link>
            );
        }

        if (part.startsWith('http://') || part.startsWith('https://')) {
            return (
                <a
                    key={key}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                    Ver más
                </a>
            );
        }

        return <span key={key}>{part}</span>;
    });
}

function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.sender === 'user';

    const renderContent = (text: string) =>
        text.split('\n').map((line, lineIdx) => {
            if (line === '')
                return <span key={lineIdx} className="block h-1.5" />;

            return (
                <span key={lineIdx} className="block">
                    {renderLineWithLinksAndBold(line, `l${lineIdx}`)}
                </span>
            );
        });

    const time = msg.timestamp.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
    });

    if (isUser) {
        return (
            <div className="flex items-end justify-end gap-2">
                <div className="flex max-w-[78%] flex-col items-end gap-1">
                    <div className="rounded-2xl rounded-br-sm bg-gray-900 px-3.5 py-2.5 text-sm leading-relaxed text-white">
                        {renderContent(msg.text)}
                    </div>
                    <span className="px-1 text-[10px] text-gray-400">
                        {time}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2">
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                <BotIcon name={msg.icon} size={13} />
            </div>

            <div className="flex max-w-[78%] flex-col items-start gap-1">
                <div className="overflow-hidden rounded-2xl rounded-bl-sm border border-gray-100 bg-white shadow-sm">
                    {/* Icon header strip */}
                    <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white">
                            <BotIcon name={msg.icon} size={11} />
                        </span>
                        <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                            Mia Bot
                        </span>
                    </div>
                    {/* Message body */}
                    <div className="px-3.5 py-2.5 text-sm leading-relaxed text-gray-700">
                        {renderContent(msg.text)}
                    </div>
                </div>
                <span className="px-1 text-[10px] text-gray-400">{time}</span>
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                <Bot size={13} />
            </div>
            <div className="overflow-hidden rounded-2xl rounded-bl-sm border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white">
                        <Bot size={11} />
                    </span>
                    <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                        Mia Bot
                    </span>
                </div>
                <div className="px-4 py-3">
                    <div className="flex gap-1.5">
                        {[0, 150, 300].map((delay) => (
                            <span
                                key={delay}
                                className="h-1.5 w-1.5 rounded-full bg-gray-400"
                                style={{
                                    animation: `chatbounce 1s infinite ${delay}ms`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    // Controla el panel de "preguntas frecuentes / menú principal".
    // Empieza visible y el usuario puede reabrirlo cuando quiera con el
    // botón "Menú principal" que está siempre disponible arriba del input.
    const [showQuickQuestions, setShowQuickQuestions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const nextId = useRef(1);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setHasUnread(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            const timer = setTimeout(() => inputRef.current?.focus(), 120);

            return () => clearTimeout(timer);
        }
    }, [messages, isOpen]);

    const addMessage = (text: string, sender: 'user' | 'bot', icon?: string) =>
        setMessages((prev) => [
            ...prev,
            { id: nextId.current++, text, sender, icon, timestamp: new Date() },
        ]);

    const sendMessage = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        addMessage(trimmed, 'user');
        setInputValue('');
        setIsLoading(true);
        // Al enviar cualquier mensaje (escrito o desde una pregunta rápida)
        // colapsamos el panel para dejar ver la conversación; el usuario
        // puede volver a abrirlo con el botón "Menú principal".
        setShowQuickQuestions(false);

        try {
            const { data } = await axios.post<{
                response: string;
                icon: string;
            }>('/chatbot', { message: trimmed });
            addMessage(data.response, 'bot', data.icon);
            if (!isOpen) setHasUnread(true);
        } catch {
            addMessage(
                'Ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.',
                'bot',
                'help-circle',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: { preventDefault(): void }) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    return (
        <>
            {/* Backdrop móvil — solo visible en pantallas pequeñas */}
            <div
                className={`fixed inset-0 z-1010 bg-black/50 transition-opacity duration-300 sm:hidden ${
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Panel del chat
                Móvil:     bottom sheet, ancho completo, sube desde abajo, máx 90vh
                Escritorio: panel flotante esquina inferior-derecha, ancho fijo
            */}
            <div
                className={`fixed inset-x-0 bottom-0 z-1020 flex max-h-[90vh] flex-col rounded-t-2xl border border-gray-200 bg-white transition-all duration-300 sm:inset-auto sm:right-6 sm:bottom-24 sm:max-h-none sm:w-90 sm:rounded-2xl sm:shadow-2xl ${
                    isOpen
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-full opacity-0 sm:translate-y-3 sm:scale-95'
                } `}
            >
                {/* Tirador visual para móvil */}
                <div className="flex justify-center pt-2 pb-1 sm:hidden">
                    <span className="h-1 w-10 rounded-full bg-gray-300" />
                </div>

                {/* Cabecera */}
                <div className="flex shrink-0 items-center justify-between rounded-t-2xl bg-gray-900 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Mia Bot
                            </p>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                                <span className="text-[11px] text-gray-400">
                                    En línea
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-gray-400 transition hover:bg-white/10 hover:text-white sm:p-1.5"
                        aria-label="Cerrar chat"
                    >
                        <span className="text-xs font-medium sm:hidden">
                            Cerrar
                        </span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </div>

                {/* Mensajes
                    Móvil:     flex-1 min-h-0 para que ocupe el espacio disponible y haga scroll
                    Escritorio: altura fija con min/max
                */}
                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:max-h-90 sm:min-h-70 sm:flex-none">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Preguntas rápidas / menú principal */}
                {showQuickQuestions && (
                    <div className="shrink-0 border-t border-gray-100 px-4 py-3">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                Preguntas frecuentes
                            </p>
                            <button
                                onClick={() => setShowQuickQuestions(false)}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Ocultar menú"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 sm:flex sm:flex-col">
                            {QUICK_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barra de acceso rápido: siempre visible para volver al menú principal */}
                {!showQuickQuestions && (
                    <div className="shrink-0 border-t border-gray-100 px-4 py-2">
                        <button
                            onClick={() => setShowQuickQuestions(true)}
                            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50"
                        >
                            <LayoutGrid className="h-3 w-3" />
                            Menú principal
                        </button>
                    </div>
                )}

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="flex shrink-0 items-center gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-3 py-2.5"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        maxLength={500}
                        disabled={isLoading}
                        className="flex-1 rounded-lg border-0 bg-transparent px-1 py-1 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white transition hover:bg-gray-700 disabled:opacity-30"
                        aria-label="Enviar mensaje"
                    >
                        <Send className="h-3.5 w-3.5" />
                    </button>
                </form>
            </div>

            {/* Botón flotante
                En móvil se oculta cuando el chat está abierto (el header y el backdrop ya cierran).
                En escritorio siempre visible para abrir/cerrar.
            */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`fixed right-4 bottom-5 z-30 h-14 w-14 items-center justify-center rounded-full bg-gray-900 shadow-lg shadow-black/20 transition-all hover:scale-105 active:scale-95 sm:right-6 sm:flex ${
                    isOpen ? 'hidden' : 'flex'
                }`}
                aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
            >
                <span
                    className={`absolute transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                >
                    <X className="h-5 w-5 text-white" />
                </span>
                <span
                    className={`absolute transition-all duration-200 ${!isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
                >
                    <MessageCircle className="h-5 w-5 text-white" />
                </span>
                {!isOpen && hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
            </button>

            <style>{`
                @keyframes chatbounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
                }
            `}</style>
        </>
    );
}
