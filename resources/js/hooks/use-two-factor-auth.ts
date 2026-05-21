import { useState } from 'react';

export const OTP_MAX_LENGTH = 6;

export interface TwoFactorAuthState {
    enabled: boolean;
    confirming: boolean;
    qrCode: string | null;
    recoveryCodes: string[];
    enable: () => void;
    disable: () => void;
    confirm: (code: string) => void;
}

export function useTwoFactorAuth(): TwoFactorAuthState {
    const [enabled, setEnabled] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

    const enable = () => {
        setConfirming(true);
    };

    const disable = () => {
        setEnabled(false);
        setConfirming(false);
        setQrCode(null);
        setRecoveryCodes([]);
    };

    const confirm = (_code: string) => {
        setEnabled(true);
        setConfirming(false);
    };

    return { enabled, confirming, qrCode, recoveryCodes, enable, disable, confirm };
}
