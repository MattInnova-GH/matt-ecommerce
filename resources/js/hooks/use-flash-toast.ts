import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export function useFlashToast(): void {
    const { props } = usePage();

    useEffect(() => {
        const flash = (props as Record<string, unknown>).flash as
            | { success?: string; error?: string; message?: string }
            | undefined;

        if (!flash) return;

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.message) {
            toast(flash.message);
        }
    }, [props]);
}
