"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { ShoppingBag } from "lucide-react";

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
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-border/60 bg-card gap-0">

                {/* Product image — edge-to-edge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.imageAlt ?? product.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/20" />
                        </div>
                    )}
                    {/* Category badge */}
                    <div className="absolute bottom-3 left-4">
                        <span className="rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {product.category}
                        </span>
                    </div>
                    {/* Tag */}
                    {product.tag && (
                        <div className="absolute right-4 top-4">
                            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold text-primary-foreground uppercase tracking-wider">
                                {product.tag}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-6 pt-5 pb-6 space-y-5">
                    <DialogHeader className="p-0 space-y-0">
                        <DialogTitle className="font-serif text-xl font-bold italic leading-tight tracking-tight text-left">
                            {product.title}
                        </DialogTitle>
                    </DialogHeader>

                    {product.description && (
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/60 mb-2">
                                About
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Price</p>
                            <p className="text-2xl font-bold text-primary tabular-nums mt-0.5">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>
                        <Button
                            className="h-11 rounded-full px-7 text-sm font-semibold shadow-lg shadow-primary/20"
                            onClick={() => {
                                onAddToCart(product);
                                onOpenChange(false);
                            }}
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
