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
       <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-white dark:bg-gray-900 transition-colors duration-300">
    {/* Products */}
    <Card className="md:col-span-2 rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-gray-800 dark:text-gray-100" />
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
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
                                className="p-4 cursor-pointer hover:shadow-lg transition bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                onClick={() => addToCart(product)}
                            >
                                <CardTitle className="text-lg text-gray-800 dark:text-gray-100">
                                    {product.name}
                                </CardTitle>
                                <p className="text-gray-600 dark:text-gray-300">
                                    ${product.price.toFixed(2)}
                                </p>
                            </Card>
                        ))}
                </div>
            </ScrollArea>
        </CardContent>
    </Card>

    {/* Cart */}
    <Card className="rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70 backdrop-blur-sm h-full">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                🛒 Cart
            </CardTitle>
        </CardHeader>

        <CardContent className="">
            <ScrollArea className="h-[330px] overflow-y-auto">
                {cart.length === 0 ? (
                    <p className="text-gray-400 dark:text-gray-500 text-center mt-10 text-lg">
                        No items in cart
                    </p>
                ) : (
                    cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all px-2"
                        >
                            {/* Product Info */}
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                    {item.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    ${item.price.toFixed(2)}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 rounded-full border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                                    onClick={() => updateQty(item.id, -1)}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>

                                <span className="text-gray-700 dark:text-gray-200 font-medium w-5 text-center">
                                    {item.qty}
                                </span>

                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8 rounded-full border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                                    onClick={() => updateQty(item.id, 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </ScrollArea>

            {/* Total & Checkout */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>

            <Button
                className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-medium py-2 rounded-lg"
                disabled={cart.length === 0}
            >
                Checkout
            </Button>
        </CardContent>
    </Card>
</div>

    );
}
