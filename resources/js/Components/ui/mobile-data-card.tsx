import { cn } from '@/lib/utils';

export interface MobileDataCardRow {
    label: string;
    value: React.ReactNode;
}

interface MobileDataCardProps {
    /** Contenido libre arriba de las filas (ej. imagen + nombre del producto). */
    header?: React.ReactNode;
    /** Cada fila de la tabla original: nombre de columna a la izquierda, dato a la derecha. */
    rows: MobileDataCardRow[];
    /** Contenido libre abajo de las filas (ej. botones de accion). */
    footer?: React.ReactNode;
    className?: string;
}

/**
 * Version movil de una fila de tabla: convierte cada columna en una fila
 * "etiqueta: valor" dentro de una tarjeta con bordes redondeados. Pensado
 * para reemplazar tablas de admin (Productos, etc.) en pantallas chicas,
 * donde recortar columnas o forzar scroll horizontal es mala UX.
 */
export function MobileDataCard({
    header,
    rows,
    footer,
    className,
}: MobileDataCardProps) {
    return (
        <div
            className={cn(
                'overflow-hidden rounded-xl border bg-white shadow-sm',
                className,
            )}
        >
            {header && (
                <div className="border-b bg-muted/20 p-4">{header}</div>
            )}

            <dl className="divide-y divide-border">
                {rows.map((row, index) => (
                    <div
                        key={index}
                        className="flex items-start justify-between gap-3 px-4 py-2.5 text-sm"
                    >
                        <dt className="shrink-0 text-muted-foreground">
                            {row.label}
                        </dt>
                        <dd className="min-w-0 text-right font-medium text-foreground">
                            {row.value}
                        </dd>
                    </div>
                ))}
            </dl>

            {footer && (
                <div className="border-t bg-muted/10 p-3">{footer}</div>
            )}
        </div>
    );
}
