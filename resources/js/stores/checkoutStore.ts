import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'transfer' | 'yape' | 'card';

export interface DeliveryAddress {
    lat: number;
    lng: number;
    address: string;
    district: string;
    postalCode: string;
    reference?: string;
    phone: string;
    recipientName: string;
}

export interface SelectedStore {
    id: number;
    name: string;
    address: string;
}

export interface CardData {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
}

interface CheckoutState {
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;

    deliveryAddress: DeliveryAddress | null;
    selectedStore: SelectedStore | null;

    // Transferencia bancaria
    transferConfirmed: boolean;

    // Yape (el cliente solo confirma que pagó al QR/numero de la tienda)
    yapeConfirmed: boolean;

    // Comprobante (no persistido — File no es serializable)
    voucherFile: File | null;

    // Card
    cardData: CardData | null;
    isCardModalOpen: boolean;

    // Modales
    isTransferModalOpen: boolean;
    isYapeModalOpen: boolean;

    setDeliveryMethod: (method: DeliveryMethod) => void;
    setPaymentMethod: (method: PaymentMethod) => void;

    setDeliveryAddress: (address: DeliveryAddress) => void;
    setSelectedStore: (store: SelectedStore) => void;

    setTransferConfirmed: (value: boolean) => void;

    setYapeConfirmed: (value: boolean) => void;

    setVoucherFile: (file: File | null) => void;

    openTransferModal: () => void;
    closeTransferModal: () => void;

    openYapeModal: () => void;
    closeYapeModal: () => void;

    setCardData: (data: CardData) => void;
    openCardModal: () => void;
    closeCardModal: () => void;
}

export const DELIVERY_COST = 15;

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set) => ({
            deliveryMethod: 'delivery',
            paymentMethod: 'transfer',

            deliveryAddress: null,
            selectedStore: null,

            transferConfirmed: false,

            yapeConfirmed: false,

            voucherFile: null,

            cardData: null,
            isCardModalOpen: false,

            isTransferModalOpen: false,
            isYapeModalOpen: false,

            setDeliveryMethod: (method) => set({ deliveryMethod: method }),
            setPaymentMethod: (method) => set({ paymentMethod: method }),
            setDeliveryAddress: (address) => set({ deliveryAddress: address }),
            setSelectedStore: (store) => set({ selectedStore: store }),

            setTransferConfirmed: (value) => set({ transferConfirmed: value }),

            setYapeConfirmed: (value) => set({ yapeConfirmed: value }),

            setVoucherFile: (file) => set({ voucherFile: file }),

            openTransferModal: () => set({ isTransferModalOpen: true }),
            closeTransferModal: () => set({ isTransferModalOpen: false }),

            openYapeModal: () => set({ isYapeModalOpen: true }),
            closeYapeModal: () => set({ isYapeModalOpen: false }),

            setCardData: (data) => set({ cardData: data }),
            openCardModal: () => set({ isCardModalOpen: true }),
            closeCardModal: () => set({ isCardModalOpen: false }),
        }),
        {
            name: 'checkout-storage',
            partialize: (state) => {
                const {
                    voucherFile,
                    isTransferModalOpen,
                    isYapeModalOpen,
                    isCardModalOpen,
                    ...rest
                } = state;
                return rest;
            },
        },
    ),
);
