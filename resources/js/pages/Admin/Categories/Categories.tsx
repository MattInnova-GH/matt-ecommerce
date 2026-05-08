import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    CheckCircle,
    XCircle,
    Package,
    FolderTree,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import CreateModal from './CreateModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import admin from '@/routes/admin';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    is_active: boolean;
    products_count: number;
}

interface PaginatedCategories {
    data: Category[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

export default function Categories({
    categories,
}: {
    categories: PaginatedCategories;
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    const filtered = categories.data.filter((c) => {
        const matchSearch =
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && c.is_active) ||
            (statusFilter === 'inactive' && !c.is_active);
        return matchSearch && matchStatus;
    });

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Categorías
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona las categorías de tu tienda
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                    <Plus size={18} /> Nueva categoría
                </button>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-10 text-sm focus:outline-none"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            {[
                                'Imagen',
                                'Nombre',
                                'Slug',
                                'Estado',
                                'Productos',
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
                        {filtered.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {category.image ? (
                                        <img
                                            src={'/storage/' + category.image}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                            <FolderTree className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4">
                                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                                        {category.slug}
                                    </code>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() =>
                                            router.put(
                                                admin.categories.toggleStatus(
                                                    category.id,
                                                ),
                                            )
                                        }
                                    >
                                        {category.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                <CheckCircle size={12} /> Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                                <XCircle size={12} /> Inactivo
                                            </span>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                                        <Package size={12} />{' '}
                                        {category.products_count} productos
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() =>
                                                setEditCategory(category)
                                            }
                                            className="rounded-lg p-2 text-blue-400 hover:bg-blue-50"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeleteCategory(category)
                                            }
                                            className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <FolderTree className="h-16 w-16 text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No hay categorías
                        </h3>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                        >
                            <Plus size={16} /> Crear categoría
                        </button>
                    </div>
                )}

                {/* Paginación */}
                {categories.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                        <span className="text-sm text-gray-500">
                            Mostrando {categories.from}-{categories.to} de{' '}
                            {categories.total}
                        </span>
                        <div className="flex gap-2">
                            {categories.links.map((link, i) => (
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
            {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
            {editCategory && (
                <EditModal
                    category={editCategory}
                    onClose={() => setEditCategory(null)}
                />
            )}
            {deleteCategory && (
                <DeleteModal
                    category={deleteCategory}
                    onClose={() => setDeleteCategory(null)}
                />
            )}
        </div>
    );
}
