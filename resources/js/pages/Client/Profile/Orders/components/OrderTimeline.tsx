import React from 'react';
import { XCircle } from 'lucide-react';
import { STATUS_CONFIG, TIMELINE_STEPS } from '../data';
import { formatDate } from '../utils';
import type { Order } from '../types';

export default function OrderTimeline({ order }: { order: Order }) {
    if (order.status === 'cancelled') {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                <div>
                    <p className="text-sm font-medium text-red-700">
                        Pedido cancelado
                    </p>
                    <p className="text-xs text-red-500">
                        Cancelado el {formatDate(order.updated_at)}
                    </p>
                </div>
            </div>
        );
    }

    const currentStep = STATUS_CONFIG[order.status].step;

    return (
        <div className="relative">
            <div className="flex items-start justify-between gap-2">
                {TIMELINE_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const done = idx <= currentStep;
                    const active = idx === currentStep;

                    return (
                        <React.Fragment key={step.status}>
                            <div className="flex flex-1 flex-col items-center gap-2">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                                        done
                                            ? active
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-primary/40 bg-primary/10 text-primary'
                                            : 'border-muted bg-muted text-muted-foreground'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <span
                                    className={`text-center text-xs leading-tight ${
                                        done
                                            ? active
                                                ? 'font-semibold text-foreground'
                                                : 'text-muted-foreground'
                                            : 'text-muted-foreground/50'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {idx < TIMELINE_STEPS.length - 1 && (
                                <div
                                    className={`mt-4 h-0.5 flex-1 transition-colors ${
                                        idx < currentStep
                                            ? 'bg-primary/40'
                                            : 'bg-muted'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
