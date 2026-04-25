"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import type { SelectedOption } from "@/components/cart-provider";
import type { Product } from "@/lib/products";

type Props = {
    product: Product;
    selectedOption?: SelectedOption;
};

export function AddToCartButton({ product, selectedOption }: Props) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem(product, selectedOption);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <Button
            onClick={handleAdd}
            className="h-12 w-full rounded-full text-sm font-semibold shadow-lg shadow-primary/20 transition-all"
        >
            {added ? (
                <>
                    <Check className="mr-2 h-4 w-4" />
                    Added to Cart
                </>
            ) : (
                <>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart — ${product.price.toFixed(2)}
                </>
            )}
        </Button>
    );
}
