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
    'alert-triangle':  AlertTriangle,
    'bar-chart-2':     BarChart2,
    'bot':             Bot,
    'circle-check':    CircleCheck,
    'clipboard-list':  ClipboardList,
    'clock':           Clock,
    'credit-card':     CreditCard,
    'file-text':       FileText,
    'heart':           Heart,
    'help-circle':     HelpCircle,
    'landmark':        Landmark,
    'layout-grid':     LayoutGrid,
    'lock':            Lock,
    'log-in':          LogIn,
    'map-pin':         MapPin,
    'message-circle':  MessageCircle,
    'package':         Package,
    'phone':           Phone,
    'rotate-ccw':      RotateCcw,
    'search':          Search,
    'shield-check':    ShieldCheck,
    'shopping-bag':    ShoppingBag,
    'shopping-cart':   ShoppingCart,
    'smartphone':      Smartphone,
    'sparkles':        Sparkles,
    'tag':             Tag,
    'truck':           Truck,
    'user-cog':        UserCog,
    'user-plus':       UserPlus,
    'x-circle':        XCircle,
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
    text: '¡Hola! Bienvenido a nuestra tienda. Estoy aquí para ayudarte con dudas sobre productos, envíos, pagos y más.\n\n¿En qué puedo ayudarte?',
    sender: 'bot',
    icon: 'sparkles',
    timestamp: new Date(),
};

function BotIcon({ name, size = 14 }: { name?: string; size?: number }) {
    const Icon = (name && ICON_MAP[name]) ? ICON_MAP[name] : HelpCircle;
    return <Icon size={size} />;
}

function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.sender === 'user';

    const renderContent = (text: string) =>
        text.split('\n').map((line, lineIdx) => {
            if (line === '') return <span key={lineIdx} className="block h-1.5" />;

            const parts = line.split(/(\*\*[^*]+\*\*)/g);
            return (
                <span key={lineIdx} className="block">
                    {parts.map((part, i) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={i} className="font-semibold">
                                {part.slice(2, -2)}
                            </strong>
                        ) : (
                            <span key={i}>{part}</span>
                        ),
                    )}
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
                    <span className="px-1 text-[10px] text-gray-400">{time}</span>
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
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            Asistente
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
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        Asistente
                    </span>
                </div>
                <div className="px-4 py-3">
                    <div className="flex gap-1.5">
                        {[0, 150, 300].map((delay) => (
                            <span
                                key={delay}
                                className="h-1.5 w-1.5 rounded-full bg-gray-400"
                                style={{ animation: `chatbounce 1s infinite ${delay}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Chatbot() {
    const [isOpen, setIsOpen]       = useState(false);
    const [messages, setMessages]   = useState<Message[]>([WELCOME]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef       = useRef<HTMLInputElement>(null);
    const nextId         = useRef(1);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => inputRef.current?.focus(), 120);
            setHasUnread(false);
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

        try {
            const { data } = await axios.post<{ response: string; icon: string }>(
                '/chatbot',
                { message: trimmed },
            );
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

    const showQuickQuestions = messages.length <= 2 && !isLoading;

    return (
        <>
            {/* Panel del chat */}
            <div
                className={`fixed bottom-24 right-4 z-1100 flex w-85 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 sm:right-6 sm:w-90 ${
                    isOpen
                        ? 'translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none translate-y-3 scale-95 opacity-0'
                }`}
            >
                {/* Cabecera */}
                <div className="flex items-center justify-between rounded-t-2xl bg-gray-900 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Asistente Virtual
                            </p>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                                <span className="text-[11px] text-gray-400">En línea</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                        aria-label="Minimizar chat"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </div>

                {/* Mensajes */}
                <div
                    className="flex flex-col gap-4 overflow-y-auto px-4 py-4"
                    style={{ minHeight: '280px', maxHeight: '360px' }}
                >
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Preguntas rápidas */}
                {showQuickQuestions && (
                    <div className="border-t border-gray-100 px-4 py-3">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            Preguntas frecuentes
                        </p>
                        <div className="flex flex-col gap-1.5">
                            {QUICK_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50 px-3 py-2.5"
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

            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-5 right-4 z-1100 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95 sm:right-6"
                aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
            >
                <span className={`absolute transition-all duration-200 ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                    <X className="h-5 w-5 text-white" />
                </span>
                <span className={`absolute transition-all duration-200 ${!isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                    <MessageCircle className="h-5 w-5 text-white" />
                </span>
                {!isOpen && hasUnread && (
                    <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white" />
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
