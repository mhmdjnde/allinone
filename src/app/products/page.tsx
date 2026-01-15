"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import { ProductDetailsDialog } from "@/components/product-details-dialog";
import { SlidersHorizontal } from "lucide-react";

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
];

type Filters = {
    minPrice: string;
    maxPrice: string;
    sortOrder: string;
};

export default function ProductsPage() {
    const { addItem } = useCart();
    const { products, isLoading, error } = useProducts();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("q") ?? ""
    );
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filters, setFilters] = useState<Filters>({
        minPrice: "",
        maxPrice: "",
        sortOrder: "featured",
    });
    const [draftFilters, setDraftFilters] = useState<Filters>(filters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setSearchQuery(searchParams.get("q") ?? "");
    }, [searchParams]);

    useEffect(() => {
        if (isFilterOpen) {
            setDraftFilters(filters);
        }
    }, [isFilterOpen, filters]);

    useEffect(() => {
        if (!selectedProduct && products[0]) {
            setSelectedProduct(products[0]);
        }
    }, [products, selectedProduct]);

    const openDetails = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    const categories = useMemo(() => {
        const unique = new Set<string>();
        products.forEach((product) => unique.add(product.category));
        return ["All", ...Array.from(unique)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const min = Number(filters.minPrice);
        const max = Number(filters.maxPrice);

        let list = products.filter((product) => {
            if (
                selectedCategory !== "All" &&
                product.category !== selectedCategory
            ) {
                return false;
            }

            if (query && !product.title.toLowerCase().includes(query)) {
                return false;
            }

            if (filters.minPrice && product.price < min) {
                return false;
            }

            if (filters.maxPrice && product.price > max) {
                return false;
            }

            return true;
        });

        if (filters.sortOrder === "price-asc") {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (filters.sortOrder === "price-desc") {
            list = [...list].sort((a, b) => b.price - a.price);
        } else if (filters.sortOrder === "newest") {
            list = [...list].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
        }

        return list;
    }, [filters, searchQuery, selectedCategory, products]);

    return (
        <div className="space-y-10">
            <section className="rounded-3xl border bg-gradient-to-br from-card/80 via-background to-muted/20 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.55)] md:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                            Products
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                            Everything in one place.
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                            Curated essentials and small-batch drops for daily
                            use.
                        </p>
                    </div>
                    <div className="w-full max-w-md">
                        <div className="relative">
                            <Input
                                placeholder="Search the catalog"
                                className="h-11 rounded-2xl bg-muted/50 border-muted/60"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className="h-10 rounded-2xl px-4"
                                >
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="w-[340px] bg-card/95 backdrop-blur-xl p-6 pt-5"
                            >
                                <SheetHeader className="p-0">
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-5">
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">
                                            Price range
                                        </p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Min"
                                                value={draftFilters.minPrice}
                                                onChange={(event) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        minPrice:
                                                            event.target.value,
                                                    })
                                                }
                                                className="h-10 rounded-2xl bg-muted/50 border-muted/60"
                                            />
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Max"
                                                value={draftFilters.maxPrice}
                                                onChange={(event) =>
                                                    setDraftFilters({
                                                        ...draftFilters,
                                                        maxPrice:
                                                            event.target.value,
                                                    })
                                                }
                                                className="h-10 rounded-2xl bg-muted/50 border-muted/60"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground">
                                            Sort order
                                        </p>
                                        <select
                                            value={draftFilters.sortOrder}
                                            onChange={(event) =>
                                                setDraftFilters({
                                                    ...draftFilters,
                                                    sortOrder:
                                                        event.target.value,
                                                })
                                            }
                                            className="mt-3 h-10 w-full rounded-2xl border border-muted/60 bg-muted/50 px-3 text-sm text-foreground outline-none focus:border-emerald-400/60"
                                        >
                                            {sortOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button
                                        className="h-11 w-full rounded-2xl"
                                        onClick={() => {
                                            setFilters(draftFilters);
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        Save filters
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                        {categories.map((category) => {
                            const isActive = selectedCategory === category;
                            return (
                                <Button
                                    key={category}
                                    variant={isActive ? "default" : "secondary"}
                                    className="h-10 rounded-2xl px-4"
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                >
                                    {category}
                                </Button>
                            );
                        })}
                    </div>
                </div>
                <Separator />
            </div>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {error ? (
                    <p className="text-sm text-muted-foreground">{error}</p>
                ) : isLoading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <Card
                            key={`loading-${index}`}
                            className="group rounded-3xl overflow-hidden border bg-muted/20"
                        >
                            <div className="relative aspect-[4/5] bg-muted/30 animate-pulse" />
                            <CardContent className="p-4 space-y-3">
                                <div className="h-4 w-2/3 rounded bg-muted/30 animate-pulse" />
                                <div className="h-4 w-1/3 rounded bg-muted/30 animate-pulse" />
                                <div className="h-10 w-full rounded-2xl bg-muted/30 animate-pulse" />
                                <div className="h-10 w-full rounded-2xl bg-muted/30 animate-pulse" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    filteredProducts.map((product) => (
                        <Card
                            key={product.id}
                            className="group rounded-3xl overflow-hidden border bg-muted/20"
                        >
                            <div className="relative aspect-[4/5] bg-muted/30 overflow-hidden">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={
                                            product.imageAlt ?? product.title
                                        }
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                                {product.tag ? (
                                    <div className="absolute left-4 top-4">
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full"
                                        >
                                            {product.tag}
                                        </Badge>
                                    </div>
                                ) : null}
                                <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
                                    {product.category}
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-medium">
                                            {product.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ${product.price}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    className="mt-4 w-full rounded-2xl"
                                    onClick={() => openDetails(product)}
                                >
                                    View details
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="mt-2 w-full rounded-2xl"
                                    onClick={() => addItem(product)}
                                >
                                    Add to cart
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </section>
            <ProductDetailsDialog
                product={selectedProduct}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onAddToCart={addItem}
            />
        </div>
    );
}
