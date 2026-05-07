import { create } from 'zustand';

export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'card' | 'yape' | 'cash';

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

    cardData: CardData | null;
    yapePhone: string | null;

    isCardModalOpen: boolean;
    isYapeModalOpen: boolean;

    setDeliveryMethod: (method: DeliveryMethod) => void;
    setPaymentMethod: (method: PaymentMethod) => void;

    setDeliveryAddress: (address: DeliveryAddress) => void;
    setSelectedStore: (store: SelectedStore) => void;

    setCardData: (data: CardData) => void;
    setYapePhone: (phone: string) => void;

    openCardModal: () => void;
    closeCardModal: () => void;

    openYapeModal: () => void;
    closeYapeModal: () => void;
}

export const DELIVERY_COST = 15;

export const useCheckoutStore = create<CheckoutState>((set) => ({
    deliveryMethod: 'delivery',
    paymentMethod: 'card',

    deliveryAddress: null,
    selectedStore: null,

    cardData: null,
    yapePhone: null,

    isCardModalOpen: false,
    isYapeModalOpen: false,

    setDeliveryMethod: (method) =>
        set({
            deliveryMethod: method,
        }),

    setPaymentMethod: (method) =>
        set({
            paymentMethod: method,
        }),

    setDeliveryAddress: (address) =>
        set({
            deliveryAddress: address,
        }),

    setSelectedStore: (store) =>
        set({
            selectedStore: store,
        }),

    setCardData: (data) =>
        set({
            cardData: data,
        }),

    setYapePhone: (phone) =>
        set({
            yapePhone: phone,
        }),

    openCardModal: () =>
        set({
            isCardModalOpen: true,
        }),

    closeCardModal: () =>
        set({
            isCardModalOpen: false,
        }),

    openYapeModal: () =>
        set({
            isYapeModalOpen: true,
        }),

    closeYapeModal: () =>
        set({
            isYapeModalOpen: false,
        }),
}));
