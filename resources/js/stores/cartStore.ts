import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItemType } from '@/types/cart';

export type { CartItemType };

interface CartState {
    isOpen: boolean;
    items: CartItemType[];
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (item: CartItemType) => void;
    removeItem: (id: number) => void;
    updateQty: (id: number, qty: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            isOpen: false,
            items: [],

            openCart: () =>
                set({
                    isOpen: true,
                }),

            closeCart: () =>
                set({
                    isOpen: false,
                }),

            toggleCart: () => set({ isOpen: !get().isOpen }),

            addItem: (item: CartItemType) => {
                const existingItem = get().items.find((i) => i.id === item.id);

                if (existingItem) {
                    set({
                        items: get().items.map((i) =>
                            i.id === item.id
                                ? {
                                      ...i,
                                      quantity: i.quantity + item.quantity,
                                  }
                                : i,
                        ),
                    });
                    return;
                }

                set({
                    items: [...get().items, item],
                });
            },

            removeItem: (id: number) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                });
            },

            updateQty: (id: number, qty: number) => {
                if (qty <= 0) {
                    set({
                        items: get().items.filter((item) => item.id !== id),
                    });
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  quantity: qty,
                              }
                            : item,
                    ),
                });
            },

            clearCart: () =>
                set({
                    items: [],
                }),

            totalItems: () =>
                get().items.reduce((total, item) => total + item.quantity, 0),

            totalPrice: () =>
                get().items.reduce(
                    (total, item) =>
                        total +
                        (typeof item.price === 'string'
                            ? parseFloat(item.price)
                            : item.price) *
                            item.quantity,
                    0,
                ),
        }),
        {
            name: 'cart-storage',
            // isOpen no debe persistir: si no, el carrito reaparece abierto
            // solo con recargar la pagina despues de haberlo abierto una vez.
            partialize: (state) => ({ items: state.items }),
        },
    ),
);
