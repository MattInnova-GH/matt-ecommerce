import { usePage } from '@inertiajs/react';

export function useCurrentUrl() {
    const { url } = usePage();

    const isCurrentUrl = (href: string) => url === href;

    const whenCurrentUrl = (href: string, active: string, inactive = '') =>
        isCurrentUrl(href) ? active : inactive;

    return { url, isCurrentUrl, whenCurrentUrl };
}
