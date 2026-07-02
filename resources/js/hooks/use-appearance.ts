import { useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

export type ResolvedAppearance = 'light' | 'dark';

function resolveAppearance(appearance: Appearance): ResolvedAppearance {
    if (appearance === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }
    return appearance;
}

function getStoredAppearance(): Appearance {
    if (typeof window === 'undefined') return 'system';
    return (
        (localStorage.getItem('appearance') as Appearance | null) ?? 'system'
    );
}

export function useAppearance() {
    const [appearance, setAppearance] =
        useState<Appearance>(getStoredAppearance);
    const [resolvedAppearance, setResolvedAppearance] =
        useState<ResolvedAppearance>(() =>
            resolveAppearance(getStoredAppearance()),
        );

    const updateAppearance = (value: Appearance) => {
        setAppearance(value);
        setResolvedAppearance(resolveAppearance(value));
        localStorage.setItem('appearance', value);
        document.documentElement.classList.remove('light', 'dark');
        if (value !== 'system') {
            document.documentElement.classList.add(value);
        }
    };

    return { appearance, resolvedAppearance, updateAppearance };
}
