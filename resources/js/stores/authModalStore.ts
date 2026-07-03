import { create } from 'zustand';

interface AuthModalState {
    isOpen: boolean;
    onSuccess: (() => void) | null;
    open: (options?: { onSuccess?: () => void }) => void;
    close: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
    isOpen: false,
    onSuccess: null,

    open: (options) =>
        set({
            isOpen: true,
            onSuccess: options?.onSuccess ?? null,
        }),

    close: () => set({ isOpen: false, onSuccess: null }),
}));
