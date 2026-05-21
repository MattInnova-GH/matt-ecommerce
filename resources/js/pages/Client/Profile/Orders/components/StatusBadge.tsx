import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG } from '../data';
import type { OrderStatus } from '../types';

export default function StatusBadge({ status }: { status: OrderStatus }) {
    const { icon: Icon, label, badgeClass } = STATUS_CONFIG[status];

    return (
        <Badge variant="outline" className={`gap-1.5 font-medium ${badgeClass}`}>
            <Icon className="h-3 w-3" />
            {label}
        </Badge>
    );
}
