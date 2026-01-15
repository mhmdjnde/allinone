"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartItem = Product & { quantity: number };

type CartContextValue = {
    items: CartItem[];
    totalCount: number;
    subtotal: number;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product) => {
        setItems((current) => {
            const existing = current.find((item) => item.id === product.id);
            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...product, quantity: 1 }];
        });
    };

    const removeItem = (productId: string) => {
        setItems((current) => current.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems((current) =>
            current
                .map((item) =>
                    item.id === productId ? { ...item, quantity } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const clear = () => setItems([]);

    const value = useMemo<CartContextValue>(() => {
        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
            items,
            subtotal,
            totalCount,
            addItem,
            removeItem,
            updateQuantity,
            clear,
        };
    }, [items]);

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
