import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    CheckCircle,
    XCircle,
    Tag,
    Calendar,
    Percent,
    DollarSign,
    FolderTree,
    Loader2,
    X,
    AlertTriangle,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import { Form } from '@inertiajs/react';
import {
    store,
    update,
    destroy,
    toggleStatus,
} from '@/actions/App/Http/Controllers/Admin/PromotionController';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
    id: number;
    name: string;
}

interface Promotion {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    is_currently_active: boolean;
    category: Category | null;
}

interface PaginatedPromotions {
    data: Promotion[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

interface Props {
    promotions: PaginatedPromotions;
    categories: Category[];
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

function CreateModal({
    categories,
    onClose,
}: {
    categories: Category[];
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
                            <Tag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Nueva promoción
                            </h2>
                            <p className="text-xs text-gray-500">
                                Crea una campaña de descuento por categoría
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <Form
                    action={store.url()}
                    method="post"
                    className="space-y-5 p-6"
                >
                    {({ errors, processing, wasSuccessful }) => {
                        if (wasSuccessful) onClose();

                        return (
                            <>
                                {/* Nombre */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Nombre de la campaña{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Ej: Día del Padre, Navidad 2026..."
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={2}
                                        placeholder="Descripción opcional de la campaña..."
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    />
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Categoría{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category_id"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    >
                                        <option value="">
                                            Selecciona una categoría
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Tipo y valor de descuento */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Tipo de descuento{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name="discount_type"
                                            required
                                            defaultValue="percentage"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        >
                                            <option value="percentage">
                                                Porcentaje (%)
                                            </option>
                                            <option value="fixed">
                                                Monto fijo (S/)
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Valor{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            name="discount_value"
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="Ej: 20"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        />
                                        {errors.discount_value && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.discount_value}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Fechas */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Fecha inicio{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            name="starts_at"
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        />
                                        {errors.starts_at && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.starts_at}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Fecha fin{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            name="ends_at"
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        />
                                        {errors.ends_at && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.ends_at}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Estado
                                    </label>
                                    <div className="flex gap-6">
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="1"
                                                defaultChecked
                                                className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                                Activo
                                            </span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="0"
                                                className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <XCircle
                                                    size={14}
                                                    className="text-red-500"
                                                />
                                                Inactivo
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="mr-2 inline animate-spin"
                                                />
                                                Guardando...
                                            </>
                                        ) : (
                                            'Crear promoción'
                                        )}
                                    </button>
                                </div>
                            </>
                        );
                    }}
                </Form>
            </div>
        </div>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
    promotion,
    categories,
    onClose,
}: {
    promotion: Promotion;
    categories: Category[];
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                            <Edit className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Editar promoción
                            </h2>
                            <p className="text-xs text-gray-500">
                                {promotion.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <Form
                    action={update.url(promotion.id)}
                    method="put"
                    className="space-y-5 p-6"
                >
                    {({ errors, processing, wasSuccessful }) => {
                        if (wasSuccessful) onClose();

                        return (
                            <>
                                {/* Nombre */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Nombre de la campaña{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        defaultValue={promotion.name}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={2}
                                        defaultValue={
                                            promotion.description ?? ''
                                        }
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    />
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Categoría{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category_id"
                                        required
                                        defaultValue={
                                            promotion.category?.id ?? ''
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                    >
                                        <option value="">
                                            Selecciona una categoría
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Tipo y valor */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Tipo de descuento{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            name="discount_type"
                                            required
                                            defaultValue={
                                                promotion.discount_type
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        >
                                            <option value="percentage">
                                                Porcentaje (%)
                                            </option>
                                            <option value="fixed">
                                                Monto fijo (S/)
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Valor{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            name="discount_value"
                                            required
                                            min="0"
                                            step="0.01"
                                            defaultValue={
                                                promotion.discount_value
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        />
                                        {errors.discount_value && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.discount_value}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Fechas */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Fecha inicio{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            name="starts_at"
                                            required
                                            defaultValue={promotion.starts_at}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        />
                                        {errors.starts_at && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.starts_at}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Fecha fin{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            name="ends_at"
                                            required
                                            defaultValue={promotion.ends_at}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none"
                                        />
                                        {errors.ends_at && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.ends_at}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                        Estado
                                    </label>
                                    <div className="flex gap-6">
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="1"
                                                defaultChecked={
                                                    promotion.is_active
                                                }
                                                className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500"
                                                />
                                                Activo
                                            </span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2">
                                            <input
                                                type="radio"
                                                name="is_active"
                                                value="0"
                                                defaultChecked={
                                                    !promotion.is_active
                                                }
                                                className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                                            />
                                            <span className="flex items-center gap-1 text-sm text-gray-700">
                                                <XCircle
                                                    size={14}
                                                    className="text-red-500"
                                                />
                                                Inactivo
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2
                                                    size={16}
                                                    className="mr-2 inline animate-spin"
                                                />
                                                Guardando...
                                            </>
                                        ) : (
                                            'Guardar cambios'
                                        )}
                                    </button>
                                </div>
                            </>
                        );
                    }}
                </Form>
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

function DeleteModal({
    promotion,
    onClose,
}: {
    promotion: Promotion;
    onClose: () => void;
}) {
    const [processing, setProcessing] = useState(false);

    function handleDelete() {
        setProcessing(true);
        router.delete(destroy.url(promotion.id), {
            onFinish: () => {
                setProcessing(false);
                onClose();
            },
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Eliminar promoción
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            ¿Estás seguro de que deseas eliminar{' '}
                            <strong>{promotion.name}</strong>? Esta acción no se
                            puede deshacer.
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={processing}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                        {processing ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="mr-2 inline animate-spin"
                                />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ promotion }: { promotion: Promotion }) {
    if (!promotion.is_active) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                <XCircle size={12} /> Inactiva
            </span>
        );
    }

    if (promotion.is_currently_active) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircle size={12} /> En curso
            </span>
        );
    }

    const today = new Date().toISOString().split('T')[0];
    if (promotion.starts_at > today) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                <Calendar size={12} /> Programada
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
            <XCircle size={12} /> Vencida
        </span>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Promotions({ promotions, categories }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editPromotion, setEditPromotion] = useState<Promotion | null>(null);
    const [deletePromotion, setDeletePromotion] = useState<Promotion | null>(
        null,
    );

    const filtered = promotions.data.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category?.name ?? '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    function formatDate(dateStr: string) {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Promociones
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona campañas de descuento por categoría
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                    <Plus size={18} /> Nueva promoción
                </button>
            </div>

            {/* Filtros */}
            <div className="mb-6">
                <div className="relative max-w-sm">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-10 text-sm focus:outline-none"
                    />
                </div>
            </div>

            {/* Tabla (desktop) */}
            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            {[
                                'Campaña',
                                'Categoría',
                                'Descuento',
                                'Período',
                                'Estado',
                                'Acciones',
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map((promotion) => (
                            <tr key={promotion.id} className="hover:bg-gray-50">
                                {/* Campaña */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                                            <Tag
                                                size={18}
                                                className="text-purple-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {promotion.name}
                                            </p>
                                            {promotion.description && (
                                                <p className="max-w-[200px] truncate text-xs text-gray-400">
                                                    {promotion.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Categoría */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                        <FolderTree size={12} />
                                        {promotion.category?.name ?? '—'}
                                    </span>
                                </td>

                                {/* Descuento */}
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
                                        {promotion.discount_type ===
                                        'percentage' ? (
                                            <Percent size={14} />
                                        ) : (
                                            <DollarSign size={14} />
                                        )}
                                        {promotion.discount_type ===
                                        'percentage'
                                            ? `${promotion.discount_value}%`
                                            : `S/ ${promotion.discount_value}`}
                                    </span>
                                </td>

                                {/* Período */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <Calendar
                                            size={13}
                                            className="text-gray-400"
                                        />
                                        <span>
                                            {formatDate(promotion.starts_at)}
                                        </span>
                                        <span className="text-gray-300">→</span>
                                        <span>
                                            {formatDate(promotion.ends_at)}
                                        </span>
                                    </div>
                                </td>

                                {/* Estado */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() =>
                                            router.put(
                                                toggleStatus.url(promotion.id),
                                            )
                                        }
                                        title="Click para cambiar estado"
                                    >
                                        <StatusBadge promotion={promotion} />
                                    </button>
                                </td>

                                {/* Acciones */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() =>
                                                setEditPromotion(promotion)
                                            }
                                            className="rounded-lg p-2 text-blue-400 hover:bg-blue-50"
                                            title="Editar"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeletePromotion(promotion)
                                            }
                                            className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Cards (mobile) */}
            <div className="grid gap-3 lg:hidden">
                {filtered.map((promotion) => (
                    <div
                        key={promotion.id}
                        className="rounded-2xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                                <Tag size={18} className="text-purple-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900">
                                    {promotion.name}
                                </p>
                                {promotion.description && (
                                    <p className="truncate text-xs text-gray-400">
                                        {promotion.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    onClick={() =>
                                        setEditPromotion(promotion)
                                    }
                                    className="rounded-lg p-2 text-blue-400 hover:bg-blue-50"
                                    title="Editar"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() =>
                                        setDeletePromotion(promotion)
                                    }
                                    className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                <FolderTree size={12} />
                                {promotion.category?.name ?? '—'}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
                                {promotion.discount_type === 'percentage' ? (
                                    <Percent size={14} />
                                ) : (
                                    <DollarSign size={14} />
                                )}
                                {promotion.discount_type === 'percentage'
                                    ? `${promotion.discount_value}%`
                                    : `S/ ${promotion.discount_value}`}
                            </span>
                            <button
                                onClick={() =>
                                    router.put(toggleStatus.url(promotion.id))
                                }
                                title="Click para cambiar estado"
                            >
                                <StatusBadge promotion={promotion} />
                            </button>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600">
                            <Calendar size={13} className="text-gray-400" />
                            <span>{formatDate(promotion.starts_at)}</span>
                            <span className="text-gray-300">→</span>
                            <span>{formatDate(promotion.ends_at)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm lg:mt-0">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                            <Tag className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No hay promociones
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Crea tu primera campaña de descuento
                        </p>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                        >
                            <Plus size={16} /> Nueva promoción
                        </button>
                    </div>
                )}

                {/* Paginación */}
                {promotions.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row">
                        <span className="text-sm text-gray-500">
                            Mostrando {promotions.from}-{promotions.to} de{' '}
                            {promotions.total}
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {promotions.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`rounded-lg px-3 py-1 text-sm ${link.active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
            {showCreate && (
                <CreateModal
                    categories={categories}
                    onClose={() => setShowCreate(false)}
                />
            )}
            {editPromotion && (
                <EditModal
                    promotion={editPromotion}
                    categories={categories}
                    onClose={() => setEditPromotion(null)}
                />
            )}
            {deletePromotion && (
                <DeleteModal
                    promotion={deletePromotion}
                    onClose={() => setDeletePromotion(null)}
                />
            )}
        </div>
    );
}

Promotions.layout = (page: React.ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
