import { useCartStore } from '@/stores/cartStore';

import Overlay from './overlay';

import Panel from './PanelLateral';

export default function CartDrawer() {
    const { isOpen, closeCart } = useCartStore();

    return (
        <>
            <Overlay isOpen={isOpen} onClose={closeCart} />

            <Panel isOpen={isOpen} />
        </>
    );
}
