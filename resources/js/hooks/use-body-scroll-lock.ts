import { useEffect } from 'react';

/**
 * Bloquea el scroll del body mientras `locked` sea true (usado por
 * drawers/paneles a pantalla completa en móvil, como el carrito o el
 * menú hamburguesa), y lo restaura al desmontar o al desbloquear.
 */
export function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) {
            return;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [locked]);
}
