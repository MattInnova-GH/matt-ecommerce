import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Eye,
    Search,
    FileWarning,
    ClipboardList,
    RefreshCw,
    Loader2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';

interface Complaint {
    id: number;
    code: string;
    first_name: string;
    last_name: string;
    document_number: string;
    phone: string | null;
    email: string;
    address: string | null;
    asset_type: 'Producto' | 'Servicio';
    asset_description: string;
    claimed_amount: string | number | null;
    complaint_type: 'Reclamo' | 'Queja';
    problem_description: string;
    consumer_request: string;
    status: 'pendiente' | 'en_proceso' | 'resuelto';
    created_at: string;
}

interface PaginatedComplaints {
    data: Complaint[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

interface Props {
    complaints: PaginatedComplaints;
}

function StatusBadge({ status }: { status: Complaint['status'] }) {
    const variants = {
        pendiente: {
            label: 'Pendiente',
            className: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        en_proceso: {
            label: 'En proceso',
            className: 'bg-sky-50 text-sky-700 border-sky-200',
        },
        resuelto: {
            label: 'Resuelto',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
    };

    const variant = variants[status] || variants.pendiente;

    return (
        <Badge variant="outline" className={variant.className}>
            {variant.label}
        </Badge>
    );
}

export default function Complaints({ complaints }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selected, setSelected] = useState<Complaint | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const filtered = complaints.data.filter((complaint) => {
        const term = searchTerm.toLowerCase();
        const matchSearch =
            complaint.code.toLowerCase().includes(term) ||
            `${complaint.first_name} ${complaint.last_name}`
                .toLowerCase()
                .includes(term) ||
            complaint.email.toLowerCase().includes(term) ||
            complaint.document_number.includes(searchTerm);

        const matchStatus =
            statusFilter === 'all' || complaint.status === statusFilter;
        const matchType =
            typeFilter === 'all' || complaint.complaint_type === typeFilter;

        return matchSearch && matchStatus && matchType;
    });

    const paginationLinks = complaints.links.filter(
        (_, i) => i !== 0 && i !== complaints.links.length - 1,
    );
    const prevLink = complaints.links[0];
    const nextLink = complaints.links[complaints.links.length - 1];

    const stats = {
        total: complaints.total,
        pendiente: complaints.data.filter((c) => c.status === 'pendiente')
            .length,
        en_proceso: complaints.data.filter((c) => c.status === 'en_proceso')
            .length,
        resuelto: complaints.data.filter((c) => c.status === 'resuelto')
            .length,
    };

    const handleStatusChange = (
        complaint: Complaint,
        status: Complaint['status'],
    ) => {
        setUpdatingId(complaint.id);

        router.put(
            `/admin/complaints/${complaint.id}`,
            { status },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            },
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatAmount = (amount: string | number | null) => {
        if (amount === null) {
            return null;
        }

        const value = typeof amount === 'string' ? parseFloat(amount) : amount;

        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(value);
    };

    return (
        <TooltipProvider>
            <div className="mx-auto max-w-350 p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Libro de Reclamaciones
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gestiona los reclamos y quejas registrados por tus
                            clientes. Tienes 30 días calendario para responder
                            cada uno (Ley N° 29571).
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-slate-500 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        Total
                                    </p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {stats.total}
                                    </p>
                                </div>
                                <FileWarning className="h-7 w-7 text-muted-foreground/50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        Pendientes
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-amber-600">
                                        {stats.pendiente}
                                    </p>
                                </div>
                                <RefreshCw className="h-7 w-7 text-amber-500/50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-sky-500 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        En proceso
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-sky-600">
                                        {stats.en_proceso}
                                    </p>
                                </div>
                                <ClipboardList className="h-7 w-7 text-sky-500/50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        Resueltos
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                                        {stats.resuelto}
                                    </p>
                                </div>
                                <CheckCircle className="h-7 w-7 text-emerald-500/50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por código, cliente, correo o documento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-45">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="pendiente">
                                    Pendiente
                                </SelectItem>
                                <SelectItem value="en_proceso">
                                    En proceso
                                </SelectItem>
                                <SelectItem value="resuelto">
                                    Resuelto
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-45">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Reclamo">
                                    Reclamo
                                </SelectItem>
                                <SelectItem value="Queja">Queja</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tabla (desktop) */}
                <Card className="overflow-hidden shadow-sm">
                    <div className="hidden overflow-x-auto lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b bg-muted/30">
                                    <TableHead>Código</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Bien contratado</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((complaint) => (
                                    <TableRow
                                        key={complaint.id}
                                        className="hover:bg-muted/20"
                                    >
                                        <TableCell className="font-medium">
                                            {complaint.code}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {complaint.first_name}{' '}
                                                    {complaint.last_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {complaint.email}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {complaint.complaint_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-56 truncate text-sm">
                                            {complaint.asset_description}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={complaint.status}
                                                    onValueChange={(value) =>
                                                        handleStatusChange(
                                                            complaint,
                                                            value as Complaint['status'],
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        complaint.id
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 w-36 border-none bg-transparent p-0 shadow-none [&>svg]:hidden">
                                                        <StatusBadge
                                                            status={
                                                                complaint.status
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pendiente">
                                                            Pendiente
                                                        </SelectItem>
                                                        <SelectItem value="en_proceso">
                                                            En proceso
                                                        </SelectItem>
                                                        <SelectItem value="resuelto">
                                                            Resuelto
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {updatingId ===
                                                    complaint.id && (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(complaint.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelected(complaint)
                                                }
                                                className="gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver detalle
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Cards (mobile) */}
                    <div className="grid gap-3 p-4 lg:hidden">
                        {filtered.map((complaint) => (
                            <Card key={complaint.id} className="shadow-none">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium">
                                                {complaint.code}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {complaint.first_name}{' '}
                                                {complaint.last_name} ·{' '}
                                                {complaint.email}
                                            </p>
                                        </div>
                                        <Badge variant="outline">
                                            {complaint.complaint_type}
                                        </Badge>
                                    </div>

                                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                        {complaint.asset_description}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between">
                                        <Select
                                            value={complaint.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(
                                                    complaint,
                                                    value as Complaint['status'],
                                                )
                                            }
                                            disabled={
                                                updatingId === complaint.id
                                            }
                                        >
                                            <SelectTrigger className="h-8 w-36 border-none bg-transparent p-0 shadow-none [&>svg]:hidden">
                                                <StatusBadge
                                                    status={complaint.status}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pendiente">
                                                    Pendiente
                                                </SelectItem>
                                                <SelectItem value="en_proceso">
                                                    En proceso
                                                </SelectItem>
                                                <SelectItem value="resuelto">
                                                    Resuelto
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setSelected(complaint)
                                            }
                                            className="h-auto gap-1.5 p-0 text-xs"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            Ver detalle
                                        </Button>
                                    </div>

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {formatDate(complaint.created_at)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="rounded-full bg-muted/50 p-4">
                                <FileWarning className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium">
                                No hay reclamos
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                No se encontraron reclamos con los filtros
                                aplicados.
                            </p>
                        </div>
                    )}

                    {/* Paginación */}
                    {complaints.links.length > 3 && (
                        <div className="flex items-center justify-between border-t px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                                Mostrando {complaints.from}-{complaints.to} de{' '}
                                {complaints.total}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!prevLink.url}
                                    asChild={!!prevLink.url}
                                    className="gap-1"
                                >
                                    {prevLink.url ? (
                                        <a href={prevLink.url}>
                                            <ChevronLeft className="h-4 w-4" />
                                            Anterior
                                        </a>
                                    ) : (
                                        <>
                                            <ChevronLeft className="h-4 w-4" />
                                            Anterior
                                        </>
                                    )}
                                </Button>
                                {paginationLinks.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url && !link.active}
                                        className="min-w-9"
                                    >
                                        {link.url && !link.active ? (
                                            <a
                                                href={link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!nextLink.url}
                                    asChild={!!nextLink.url}
                                    className="gap-1"
                                >
                                    {nextLink.url ? (
                                        <a href={nextLink.url}>
                                            Siguiente
                                            <ChevronRight className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <>
                                            Siguiente
                                            <ChevronRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Detalle del reclamo */}
                <Dialog
                    open={selected !== null}
                    onOpenChange={(open) => !open && setSelected(null)}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {selected?.complaint_type} {selected?.code}
                            </DialogTitle>
                            <DialogDescription>
                                Registrado el{' '}
                                {selected && formatDate(selected.created_at)}
                            </DialogDescription>
                        </DialogHeader>

                        {selected && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/20 p-4 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Cliente
                                        </p>
                                        <p className="font-medium">
                                            {selected.first_name}{' '}
                                            {selected.last_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Documento
                                        </p>
                                        <p className="font-medium">
                                            {selected.document_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Correo
                                        </p>
                                        <p className="font-medium break-all">
                                            {selected.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Teléfono
                                        </p>
                                        <p className="font-medium">
                                            {selected.phone || 'No indicado'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground">
                                            Dirección
                                        </p>
                                        <p className="font-medium">
                                            {selected.address || 'No indicada'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Bien contratado
                                        </p>
                                        <p className="font-medium">
                                            {selected.asset_type} —{' '}
                                            {selected.asset_description}
                                        </p>
                                    </div>
                                    {selected.claimed_amount && (
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Monto reclamado
                                            </p>
                                            <p className="font-medium">
                                                {formatAmount(
                                                    selected.claimed_amount,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                                        Detalle del problema
                                    </p>
                                    <p className="rounded-lg border bg-muted/10 p-3 text-sm whitespace-pre-wrap">
                                        {selected.problem_description}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                                        Pedido del consumidor
                                    </p>
                                    <p className="rounded-lg border bg-muted/10 p-3 text-sm whitespace-pre-wrap">
                                        {selected.consumer_request}
                                    </p>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setSelected(null)}
                            >
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
