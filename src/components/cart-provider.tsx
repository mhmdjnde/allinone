"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type SelectedOption = { id: string; name: string };

export type CartItem = Product & {
    quantity: number;
    selectedOption?: SelectedOption;
    cartKey: string;
};

type CartContextValue = {
    items: CartItem[];
    totalCount: number;
    subtotal: number;
    addItem: (product: Product, selectedOption?: SelectedOption) => void;
    removeItem: (cartKey: string) => void;
    updateQuantity: (cartKey: string, quantity: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function makeCartKey(productId: string, optionId?: string) {
    return `${productId}:${optionId ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product, selectedOption?: SelectedOption) => {
        const cartKey = makeCartKey(product.id, selectedOption?.id);
        setItems((current) => {
            const existing = current.find((item) => item.cartKey === cartKey);
            if (existing) {
                return current.map((item) =>
                    item.cartKey === cartKey
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...product, quantity: 1, selectedOption, cartKey }];
        });
    };

    const removeItem = (cartKey: string) => {
        setItems((current) => current.filter((item) => item.cartKey !== cartKey));
    };

    const updateQuantity = (cartKey: string, quantity: number) => {
        setItems((current) =>
            current
                .map((item) =>
                    item.cartKey === cartKey ? { ...item, quantity } : item
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
