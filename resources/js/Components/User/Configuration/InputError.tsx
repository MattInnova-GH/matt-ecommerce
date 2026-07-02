import type { InputErrorProps } from './types/settings';

export function InputError({ message }: InputErrorProps) {
    if (!message) {
        return null;
    }

    return <p className="mt-1 text-xs text-destructive">{message}</p>;
}
