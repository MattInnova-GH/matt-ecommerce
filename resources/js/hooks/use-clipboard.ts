import { useState } from 'react';

export function useClipboard(
    timeout = 2000,
): [string | null, (text: string) => void] {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedText(text);
            setTimeout(() => setCopiedText(null), timeout);
        });
    };

    return [copiedText, copy];
}
