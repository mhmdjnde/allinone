import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { fetchProducts } from "@/lib/products";

type UseProductsState = {
    products: Product[];
    isLoading: boolean;
    error: string | null;
};

export function useProducts() {
    const [state, setState] = useState<UseProductsState>({
        products: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        let active = true;

        fetchProducts()
            .then((products) => {
                if (!active) return;
                setState({ products, isLoading: false, error: null });
            })
            .catch((err: unknown) => {
                if (!active) return;
                setState({
                    products: [],
                    isLoading: false,
                    error: err instanceof Error ? err.message : "Unknown error",
                });
            });

        return () => {
            active = false;
        };
    }, []);

    return state;
}
