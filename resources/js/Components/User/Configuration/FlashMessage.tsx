import { Check } from 'lucide-react';
import type { FlashMessageProps } from './types/settings';

export function FlashMessage({ message }: FlashMessageProps) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
            <Check className="h-4 w-4 shrink-0" />
            {message}
        </div>
    );
}
