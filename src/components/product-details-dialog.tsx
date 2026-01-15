"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";

type ProductDetailsDialogProps = {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddToCart: (product: Product) => void;
};

export function ProductDetailsDialog({
    product,
    open,
    onOpenChange,
    onAddToCart,
}: ProductDetailsDialogProps) {
    if (!product) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{product.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/30">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.imageAlt ?? product.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : null}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground">
                            Description
                        </p>
                        <p className="mt-2 text-sm text-foreground/90">
                            {product.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                            ${product.price}
                        </span>
                        <Button
                            className="h-10 rounded-2xl px-5"
                            onClick={() => onAddToCart(product)}
                        >
                            Add to cart
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
