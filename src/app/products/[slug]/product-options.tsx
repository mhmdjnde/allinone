"use client";

import { useState } from "react";
import { AddToCartButton } from "./add-to-cart-button";
import type { Product } from "@/lib/products";

type ProductOption = { id: string; name: string; imageUrl: string; imageAlt: string };

type Props = {
    product: Product;
    options: ProductOption[];
    optionLabel: string | null;
};

export function ProductOptions({ product, options, optionLabel }: Props) {
    const [selectedOption, setSelectedOption] = useState<ProductOption>(options[0]);

    return (
        <div className="space-y-7">
            {/* Option selector */}
            <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 mb-3">
                    {optionLabel ?? "Options"}
                    {selectedOption && (
                        <span className="ml-2 text-primary font-semibold normal-case tracking-normal">
                            — {selectedOption.name}
                        </span>
                    )}
                </p>
                <div className="flex flex-wrap gap-2">
                    {options.map((opt) => {
                        const isSelected = selectedOption?.id === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedOption(opt)}
                                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 border-2 ${
                                    isSelected
                                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                        : "border-border/60 bg-transparent text-foreground hover:border-primary/40 hover:bg-muted/30"
                                }`}
                            >
                                {opt.imageUrl && (
                                    <div className={`h-6 w-6 overflow-hidden rounded-md shrink-0 ${isSelected ? "ring-2 ring-primary-foreground/30" : "bg-muted"}`}>
                                        <img src={opt.imageUrl} alt={opt.imageAlt} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                {opt.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CTA */}
            <AddToCartButton
                product={product}
                selectedOption={selectedOption ? { id: selectedOption.id, name: selectedOption.name } : undefined}
            />
        </div>
    );
}
