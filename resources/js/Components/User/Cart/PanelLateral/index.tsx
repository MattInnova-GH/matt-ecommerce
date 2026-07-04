import { CartActions } from './CartActions';
import { CartHeader } from './CartHeader';
import CartItemsList from './CartItemsList';
import CartSummary from './CartSummary';

interface PanelProps {
    isOpen: boolean;
}

export default function Panel({ isOpen }: PanelProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            className={`fixed top-0 right-0 z-1020 flex h-full w-105 max-w-full transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <CartHeader />
            <CartItemsList />
            <CartSummary />
            <CartActions />
        </div>
    );
}
