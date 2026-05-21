import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'transfer' | 'yape' | 'card';
export type YapeMode = 'code' | 'qr';

export interface DeliveryAddress {
    lat: number;
    lng: number;
    address: string;
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

    // Yape
    yapePhone: string | null;
    yapeCode: string | null;
    yapeMode: YapeMode;

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

    setYapePhone: (phone: string) => void;
    setYapeCode: (code: string) => void;
    setYapeMode: (mode: YapeMode) => void;

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

            yapePhone: null,
            yapeCode: null,
            yapeMode: 'code',

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

            setYapePhone: (phone) => set({ yapePhone: phone }),
            setYapeCode: (code) => set({ yapeCode: code }),
            setYapeMode: (mode) => set({ yapeMode: mode }),

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { voucherFile, isTransferModalOpen, isYapeModalOpen, isCardModalOpen, ...rest } = state;
                return rest;
            },
        },
    ),
);
