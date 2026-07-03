import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import notifications from '@/routes/client/notifications';

interface AppNotification {
    id: number;
    title: string;
    message: string;
    action: string | null;
    order_id: number | null;
    created_at: string;
}

export default function NotificationBell() {
    const { props } = usePage();
    const items = ((props as any).notifications ?? []) as AppNotification[];
    const [yapePrompt, setYapePrompt] = useState<AppNotification | null>(null);
    const [yapePhone, setYapePhone] = useState('');
    const [processing, setProcessing] = useState(false);

    const openNotification = (notification: AppNotification) => {
        if (notification.action === 'refund_yape_phone') {
            setYapePhone('');
            setYapePrompt(notification);
            return;
        }

        router.put(notifications.read(notification.id), {}, {
            preserveScroll: true,
        });
    };

    const confirmYapePhone = () => {
        if (!yapePrompt || !/^9[0-9]{8}$/.test(yapePhone)) {
            toast.error('Ingresa un número de Yape válido (9 dígitos).');
            return;
        }

        setProcessing(true);
        router.put(
            notifications.refundYape(yapePrompt.id),
            { yape_phone: yapePhone },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Número de Yape registrado correctamente.');
                    setYapePrompt(null);
                    setYapePhone('');
                },
                onError: () => toast.error('No se pudo registrar tu número.'),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="relative transition hover:opacity-60">
                        <Bell size={20} />
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-2 min-w-4 rounded-full bg-black px-1.5 text-center text-[10px] text-white">
                                {items.length}
                            </span>
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {items.length === 0 && (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                            No tienes notificaciones nuevas.
                        </div>
                    )}
                    {items.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className="cursor-pointer flex-col items-start gap-0.5 whitespace-normal py-2"
                            onClick={() => openNotification(notification)}
                        >
                            <span className="text-sm font-medium">
                                {notification.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {notification.message}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={yapePrompt !== null}
                onOpenChange={(open) => !open && setYapePrompt(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reembolso por Yape</DialogTitle>
                        <DialogDescription>
                            {yapePrompt?.message}
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={yapePhone}
                        onChange={(e) =>
                            setYapePhone(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="Ej: 987654321"
                        maxLength={9}
                        inputMode="numeric"
                        autoFocus
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setYapePrompt(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={confirmYapePhone}
                            disabled={processing || yapePhone.length !== 9}
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
