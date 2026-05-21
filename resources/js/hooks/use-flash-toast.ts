import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export function useFlashToast(): void {
    const { props } = usePage();

    useEffect(() => {
        const flash = (props as Record<string, unknown>).flash as
            | { success?: string; error?: string; message?: string }
            | undefined;

        if (!flash) return;

        // Integration point: display flash messages via your toast library
        if (flash.success) {
            console.info('[Flash]', flash.success);
        }
        if (flash.error) {
            console.error('[Flash]', flash.error);
        }
        if (flash.message) {
            console.info('[Flash]', flash.message);
        }
    }, [props]);
}
