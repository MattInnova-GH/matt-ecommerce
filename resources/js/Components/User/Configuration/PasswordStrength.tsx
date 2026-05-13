import { PasswordStrengthProps } from './types/settings';

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    const colors = [
        '',
        'bg-red-500',
        'bg-amber-500',
        'bg-blue-500',
        'bg-emerald-500',
    ];

    return (
        <div className="space-y-1.5">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= score ? colors[score] : 'bg-muted'
                        }`}
                    />
                ))}
            </div>
            {score > 0 && (
                <p
                    className={`text-xs font-medium ${
                        score === 1
                            ? 'text-red-500'
                            : score === 2
                              ? 'text-amber-500'
                              : score === 3
                                ? 'text-blue-500'
                                : 'text-emerald-500'
                    }`}
                >
                    Contraseña {labels[score]}
                </p>
            )}
        </div>
    );
}
