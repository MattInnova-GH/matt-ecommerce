import { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';

import { Check, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';

import { PublicProduct } from './types';

type Props = {
    product: PublicProduct;
};

export default function ProductDetailClient({ product }: Props) {
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const [quantity, setQuantity] = useState(1);

    const colors = useMemo(() => product.colors || [], [product.colors]);

    const sizes = useMemo(() => product.sizes || [], [product.sizes]);

    const isOutOfStock = product.stock === 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12 lg:flex-row">
                {/* Imagen */}
                <div className="lg:w-1/2">
                    <div className="overflow-hidden rounded-3xl bg-gray-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="aspect-[3/4] w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-[3/4] items-center justify-center text-gray-400">
                                Sin imagen
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="lg:w-1/2">
                    <Link
                        href="/productos"
                        className="text-xs tracking-wider text-gray-400 uppercase"
                    >
                        {product.category}
                    </Link>

                    <h1 className="mt-3 text-4xl font-light text-gray-900">
                        {product.name}
                    </h1>

                    <div className="mt-4">
                        <span className="text-3xl font-bold">
                            ${product.price}
                        </span>
                    </div>

                    {product.description && (
                        <p className="mt-6 border-b border-gray-100 pb-6 text-gray-600">
                            {product.description}
                        </p>
                    )}

                    {/* Colores */}
                    {colors.length > 0 && (
                        <div className="mt-8">
                            <h3 className="mb-3 text-sm font-medium">Color</h3>

                            <div className="flex gap-3">
                                {colors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedColor(color)}
                                        className={`relative h-10 w-10 rounded-full ring-2 ring-offset-2 ${
                                            selectedColor === color
                                                ? 'ring-black'
                                                : 'ring-gray-200'
                                        }`}
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    >
                                        {selectedColor === color && (
                                            <Check
                                                size={14}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tallas */}
                    {sizes.length > 0 && (
                        <div className="mt-8">
                            <h3 className="mb-3 text-sm font-medium">Talla</h3>

                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedSize(size)}
                                        className={`rounded-full border px-4 py-2 text-sm ${
                                            selectedSize === size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cantidad */}
                    <div className="mt-8">
                        <h3 className="mb-3 text-sm font-medium">Cantidad</h3>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-gray-300">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="p-3"
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="w-10 text-center">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock,
                                                quantity + 1,
                                            ),
                                        )
                                    }
                                    className="p-3"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button className="rounded-full border border-gray-300 p-3">
                                <Heart size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Botón */}
                    <div className="mt-8">
                        <button
                            disabled={isOutOfStock}
                            className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-medium transition ${
                                isOutOfStock
                                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            <ShoppingCart size={18} />

                            {isOutOfStock
                                ? 'Producto agotado'
                                : 'Agregar al carrito'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
