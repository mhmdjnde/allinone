"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filters, setFilters] = useState<Filters>({
        minPrice: "",
        maxPrice: "",
        sortOrder: "featured",
    });
    const [draftFilters, setDraftFilters] = useState<Filters>(filters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        setSearchQuery(searchParams.get("q") ?? "");
    }, [searchParams]);

    useEffect(() => {
        if (isFilterOpen) setDraftFilters(filters);
    }, [isFilterOpen, filters]);

    const categories = useMemo(() => {
        const unique = new Set<string>();
        products.forEach((p) => unique.add(p.category));
        return ["All", ...Array.from(unique)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const min = Number(filters.minPrice);
        const max = Number(filters.maxPrice);

        let list = products.filter((product) => {
            if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
            if (query && !product.title.toLowerCase().includes(query)) return false;
            if (filters.minPrice && product.price < min) return false;
            if (filters.maxPrice && product.price > max) return false;
            return true;
        });

        if (filters.sortOrder === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
        else if (filters.sortOrder === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
        else if (filters.sortOrder === "newest") list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return list;
    }, [filters, searchQuery, selectedCategory, products]);

    const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.sortOrder !== "featured";

    return (
        <div className="space-y-8">

            {/* ── PAGE HEADER ──────────────────────────────────── */}
            <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card mt-6 px-7 py-9 md:px-12 md:py-11">
                <div className="absolute right-0 top-0 w-48 h-48 opacity-[0.025] pointer-events-none">
                    <svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="192" cy="0" r="140" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="192" cy="0" r="90" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60">
                            — Catalog
                        </p>
                        <h1 className="mt-3 font-serif font-bold italic leading-tight tracking-tight text-foreground"
                            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
                            Everything in<br />one place.
                        </h1>
                    </div>
                    <div className="w-full max-w-xs shrink-0">
                        <Input
                            placeholder="Search the catalog…"
                            className="h-10 rounded-full bg-muted/50 border-transparent text-sm focus-visible:border-primary/30 focus-visible:ring-1 focus-visible:ring-primary/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </section>

            {/* ── FILTERS BAR ──────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant={hasActiveFilters ? "default" : "outline"}
                                size="sm"
                                className="h-8 rounded-full px-4 text-xs font-medium border-border/60"
                            >
                                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                                Filters
                                {hasActiveFilters && <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[320px] bg-card border-r border-border/80 p-0">
                            <SheetHeader className="px-6 pt-6 pb-4">
                                <SheetTitle className="font-serif italic text-base font-bold">Filters</SheetTitle>
                            </SheetHeader>
                            <div className="px-6 space-y-6">
                                <Separator />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Price range</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Min $"
                                            value={draftFilters.minPrice}
                                            onChange={(e) => setDraftFilters({ ...draftFilters, minPrice: e.target.value })}
                                            className="h-9 rounded-xl bg-muted/50 border-border/60 text-sm"
                                        />
                                        <span className="text-muted-foreground/40 text-xs">—</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="Max $"
                                            value={draftFilters.maxPrice}
                                            onChange={(e) => setDraftFilters({ ...draftFilters, maxPrice: e.target.value })}
                                            className="h-9 rounded-xl bg-muted/50 border-border/60 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sort by</p>
                                    <select
                                        value={draftFilters.sortOrder}
                                        onChange={(e) => setDraftFilters({ ...draftFilters, sortOrder: e.target.value })}
                                        className="mt-3 h-9 w-full rounded-xl border border-border/60 bg-muted/50 px-3 text-sm text-foreground outline-none focus:border-primary/40"
                                    >
                                        {sortOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 rounded-full text-xs"
                                        onClick={() => {
                                            const reset: Filters = { minPrice: "", maxPrice: "", sortOrder: "featured" };
                                            setDraftFilters(reset);
                                            setFilters(reset);
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1 rounded-full text-xs"
                                        onClick={() => {
                                            setFilters(draftFilters);
                                            setIsFilterOpen(false);
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {categories.map((category) => {
                        const isActive = selectedCategory === category;
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`h-8 rounded-full px-4 text-xs font-medium transition-all border ${
                                    isActive
                                        ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                        : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border bg-transparent"
                                }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {!isLoading && (
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {filteredProducts.length === 0
                                ? "No products found"
                                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Clear search ×
                            </button>
                        )}
                    </div>
                )}

                <Separator className="opacity-40" />
            </div>

            {/* ── GRID ─────────────────────────────────────────── */}
            <section>
                {error ? (
                    <p className="text-sm text-muted-foreground">{error}</p>
                ) : isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={`skel-${i}`} className="overflow-hidden rounded-2xl border border-border/50 bg-card">
                                <div className="aspect-[3/4] animate-pulse bg-muted/40" />
                                <div className="p-4 space-y-2.5">
                                    <div className="h-3.5 w-2/3 rounded-full bg-muted/40 animate-pulse" />
                                    <div className="h-3 w-1/3 rounded-full bg-muted/40 animate-pulse" />
                                    <div className="mt-3 h-9 w-full rounded-full bg-muted/30 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="font-serif italic text-2xl font-bold text-muted-foreground/30">Nothing here.</p>
                        <p className="text-xs text-muted-foreground/50 mt-2">Try adjusting your filters or search query.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-5 rounded-full"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                                setFilters({ minPrice: "", maxPrice: "", sortOrder: "featured" });
                            }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} onAddToCart={addItem} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function ProductCard({
    product,
    onAddToCart,
}: {
    product: Product;
    onAddToCart: (p: Product) => void;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-black/25">
            <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt={product.imageAlt ?? product.title}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                            loading="lazy"
                        />
                    )}
                    {product.tag && (
                        <div className="absolute left-3 top-3">
                            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-bold text-primary-foreground uppercase tracking-wider shadow-sm">
                                {product.tag}
                            </span>
                        </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                        <span className="rounded-full bg-background/70 backdrop-blur-sm px-2.5 py-1 text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
                            {product.category}
                        </span>
                    </div>
                </div>
                <div className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug line-clamp-2">{product.title}</p>
                        <span className="text-sm font-bold text-primary tabular-nums whitespace-nowrap shrink-0">${product.price}</span>
                    </div>
                    {product.rating != null && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                            <div className="flex">
                                {[1,2,3,4,5].map((s) => (
                                    <svg key={s} viewBox="0 0 12 12" className={`h-3 w-3 ${product.rating! >= s - 0.25 ? "text-primary fill-primary" : "text-muted-foreground/20 fill-muted-foreground/20"}`}>
                                        <path d="M6 1l1.39 2.82L10.5 4.24l-2.25 2.19.53 3.09L6 8l-2.78 1.52.53-3.09L1.5 4.24l3.11-.42z"/>
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{product.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </Link>
            <div className="px-4 pb-4 pt-2">
                {product.hasOptions ? (
                    <Link href={`/products/${product.slug}`} tabIndex={-1}>
                        <Button
                            variant="ghost"
                            className="w-full h-9 rounded-full text-[13px] border border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60"
                        >
                            View Details
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="ghost"
                        className="w-full h-9 rounded-full text-[13px] border border-border/60 hover:bg-muted/50 hover:border-border"
                        onClick={() => onAddToCart(product)}
                    >
                        Add to Cart
                    </Button>
                )}
            </div>
        </div>
    );
}
