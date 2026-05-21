import { useState, useEffect } from 'react';

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

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');
    const [resolvedAppearance, setResolvedAppearance] =
        useState<ResolvedAppearance>('light');

    useEffect(() => {
        const stored = localStorage.getItem('appearance') as Appearance | null;
        const initial = stored ?? 'system';
        setAppearance(initial);
        setResolvedAppearance(resolveAppearance(initial));
    }, []);

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
