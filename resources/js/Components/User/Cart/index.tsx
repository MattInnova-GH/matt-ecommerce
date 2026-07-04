import { useCartStore } from '@/stores/cartStore';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

import Overlay from './overlay';

import Panel from './PanelLateral';

export default function CartDrawer() {
    const { isOpen, closeCart } = useCartStore();

    useBodyScrollLock(isOpen);

    return (
        <>
            <Overlay isOpen={isOpen} onClose={closeCart} />

            <Panel isOpen={isOpen} />
        </>
    );
}
