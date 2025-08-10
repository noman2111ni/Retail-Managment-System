import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Trash2, Plus, Minus } from "lucide-react";

const sampleProducts = [
    { id: 1, name: "Apple", price: 1.5 },
    { id: 2, name: "Banana", price: 1.2 },
    { id: 3, name: "Milk", price: 2.5 },
    { id: 4, name: "Bread", price: 2.0 },
];

export default function POS() {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQty = (id, delta) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, qty: Math.max(1, item.qty + delta) }
                    : item
            )
        );
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {/* Products */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        <Input
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[500px]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {sampleProducts
                                .filter((p) =>
                                    p.name.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((product) => (
                                    <Card
                                        key={product.id}
                                        className="p-4 cursor-pointer hover:shadow-lg transition"
                                        onClick={() => addToCart(product)}
                                    >
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                                    </Card>
                                ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Cart */}
            <Card>
                <CardHeader>
                    <CardTitle>Cart</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[350px]">
                        {cart.length === 0 ? (
                            <p className="text-gray-500 text-center">No items in cart</p>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border-b py-2"
                                >
                                    <span>{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateQty(item.id, -1)}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span>{item.qty}</span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateQty(item.id, 1)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                    {/* Total */}
                    <div className="mt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-4" disabled={cart.length === 0}>
                        Checkout
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
