import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Search, FolderTree, Package, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    products_count: number;
}

interface CategoryProps {
    categories: CategoryItem[];
}

export default function Category({ categories }: CategoryProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="space-y-3 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Categorías
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Explora nuestros productos por categoría
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar categoría..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Categories Grid */}
                {filteredCategories.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCategories.map((category) => (
                            <Card
                                key={category.id}
                                className="group overflow-hidden border shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="relative h-40 overflow-hidden bg-muted/50">
                                    {category.image ? (
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <div className="rounded-full bg-muted/80 p-4">
                                                <FolderTree className="h-12 w-12 text-muted-foreground/50" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute right-3 bottom-3 left-3">
                                        <h2 className="text-xl font-bold text-white">
                                            {category.name}
                                        </h2>
                                    </div>
                                </div>

                                <CardContent className="p-5">
                                    <div className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Package className="h-4 w-4" />
                                        <span>
                                            {category.products_count} productos
                                        </span>
                                    </div>

                                    <Link href={`/categorias/${category.slug}`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full gap-2 py-5"
                                        >
                                            Ver productos
                                            <ChevronRight className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border bg-muted/30">
                        <FolderTree className="h-16 w-16 text-muted-foreground/30" />
                        <p className="text-center text-muted-foreground">
                            {searchTerm
                                ? 'No se encontraron categorías'
                                : 'No hay categorías disponibles'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
