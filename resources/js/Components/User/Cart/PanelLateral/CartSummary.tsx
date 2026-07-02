import { useCartStore } from '@/stores/cartStore';

const IGV = 0.18;

export default function CartSummary() {
    const { totalPrice, items } = useCartStore();

    if (items.length === 0) return null;

    const subtotal = totalPrice();
    const tax = subtotal * IGV;
    const total = subtotal + tax;

    return (
        <div className="space-y-2 border-t border-gray-100 px-6 py-4 text-sm">
            <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span className="text-green-500">Gratis</span>
            </div>

            <div className="flex justify-between text-gray-500">
                <span>IGV (18%)</span>
                <span>S/ {tax.toFixed(2)}</span>
            </div>

            <div className="mt-1 flex justify-between border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
            </div>
        </div>
    );
}
