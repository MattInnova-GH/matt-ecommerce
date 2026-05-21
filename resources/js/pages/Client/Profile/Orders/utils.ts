export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(amount);
}

export function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
