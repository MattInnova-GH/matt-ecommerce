import { create } from 'zustand';

export type AuthModalTab = 'login' | 'register';

interface AuthModalState {
    isOpen: boolean;
    tab: AuthModalTab;
    onSuccess: (() => void) | null;
    open: (options?: { tab?: AuthModalTab; onSuccess?: () => void }) => void;
    close: () => void;
    setTab: (tab: AuthModalTab) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
    isOpen: false,
    tab: 'login',
    onSuccess: null,

    open: (options) =>
        set({
            isOpen: true,
            tab: options?.tab ?? 'login',
            onSuccess: options?.onSuccess ?? null,
        }),

    close: () => set({ isOpen: false, onSuccess: null }),

    setTab: (tab) => set({ tab }),
}));
