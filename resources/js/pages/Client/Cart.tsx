import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Trash2, 
    Plus, 
    Minus, 
    ShoppingCart, 
    ArrowLeft, 
    CreditCard,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/stores/cartStore';

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(amount);
}

export default function Cart() {
    const { items, removeItem, updateQty, clearCart, totalPrice, totalItems } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <Head title="Carrito de compras" />
                <div className="bg-muted/50 p-6 rounded-full mb-6">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
                <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Parece que aún no has añadido nada a tu carrito. 
                    ¡Explora nuestro catálogo y encuentra algo increíble!
                </p>
                <Button asChild size="lg">
                    <Link href="/productos">Ir al catálogo</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Carrito de compras" />
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Tu Carrito</h1>
                    <Button variant="ghost" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
                        Limpiar carrito
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package className="h-8 w-8 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <div className="flex justify-between text-base font-medium">
                                                <h3 className="line-clamp-1">
                                                    <Link href={`/productos/${item.id}`} className="hover:text-primary">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p className="ml-4 font-bold">{formatCurrency(item.price * item.quantity)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
                                            
                                            <div className="flex flex-1 items-end justify-between text-sm mt-4">
                                                <div className="flex items-center gap-2 border rounded-md">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8"
                                                        onClick={() => updateQty(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8"
                                                        onClick={() => updateQty(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="font-medium text-destructive hover:text-destructive/80 flex items-center gap-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="hidden sm:inline">Eliminar</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        
                        <Button variant="outline" asChild className="mt-4">
                            <Link href="/productos" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Seguir comprando
                            </Link>
                        </Button>
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Resumen del pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal ({totalItems()} productos)</span>
                                    <span>{formatCurrency(totalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Envío</span>
                                    <span className="text-emerald-600 font-medium">Gratis</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatCurrency(totalPrice())}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3">
                                <Button className="w-full gap-2" size="lg" asChild>
                                    <Link href="/checkout">
                                        <CreditCard className="h-4 w-4" />
                                        Finalizar compra
                                    </Link>
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Impuestos incluidos. Envío calculado al finalizar.
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
