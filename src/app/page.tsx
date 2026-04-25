"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";
import { useProducts } from "@/lib/use-products";

const MARQUEE_ITEMS = [
    "Free Delivery",
    "New Arrivals Weekly",
    "Curated Picks",
    "Secure Checkout",
    "Quality Guaranteed",
    "Handpicked Essentials",
    "Daily Drops",
];

export default function HomePage() {
    const { addItem } = useCart();
    const { products, isLoading, error } = useProducts();
    const featured = products.slice(0, 4);

    const marqueeText = MARQUEE_ITEMS.join(" · ") + " · ";
    const marqueeDouble = marqueeText + marqueeText;

    return (
        <div className="space-y-0">

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card mt-6">

                <div className="absolute right-6 top-5 text-[10px] tracking-[0.35em] text-muted-foreground/30 uppercase select-none hidden sm:block">
                    Est. 2024
                </div>

                <div className="absolute right-0 top-0 w-64 h-64 opacity-[0.03] pointer-events-none">
                    <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="256" cy="0" r="180" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="256" cy="0" r="120" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="256" cy="0" r="60" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>

                <div className="relative z-10 px-7 py-10 md:px-14 md:py-16">
                    <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60 font-medium">
                        — One For All Market
                    </p>

                    <h1 className="mt-5 font-serif font-bold italic leading-[0.88] tracking-tight text-foreground"
                        style={{ fontSize: "clamp(3.2rem, 9vw, 6.5rem)" }}>
                        Everything<br />
                        <span className="text-primary">You Need.</span>
                    </h1>

                    <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed md:text-[15px]">
                        A curated bazaar of daily essentials, handpicked drops, and the things you didn&apos;t know you needed.
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                        <Link href="/products">
                            <Button className="h-11 rounded-full px-7 text-sm font-semibold shadow-lg shadow-primary/20">
                                Browse Collection
                                <ArrowRight className="ml-2 h-3.5 w-3.5" />
                            </Button>
                        </Link>
                        <Link
                            href="/products"
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                        >
                            View all products
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </section>

            {/* ── MARQUEE ──────────────────────────────────────── */}
            <div className="overflow-hidden border-y border-border/40 py-3 my-8">
                <div
                    className="flex w-max"
                    style={{ animation: "marquee 35s linear infinite" }}
                >
                    <span className="flex items-center gap-5 pr-5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60 whitespace-nowrap">
                        {marqueeDouble.split(" · ").filter(Boolean).map((item, i) => (
                            <span key={i} className="flex items-center gap-5">
                                <span>{item}</span>
                                <span className="text-primary/50">·</span>
                            </span>
                        ))}
                    </span>
                </div>
            </div>

            {/* ── FEATURED ─────────────────────────────────────── */}
            <section className="space-y-7">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="font-serif text-2xl font-bold italic tracking-tight">Featured</h2>
                        <p className="text-xs text-muted-foreground mt-1">Selected this week</p>
                    </div>
                    <Link
                        href="/products"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 shrink-0"
                    >
                        View all
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {error ? (
                    <p className="text-sm text-muted-foreground">{error}</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div key={`skel-${i}`} className="overflow-hidden rounded-2xl border border-border/50 bg-card">
                                    <div className="aspect-[3/4] animate-pulse bg-muted/40" />
                                    <div className="p-4 space-y-2.5">
                                        <div className="h-3.5 w-2/3 rounded-full bg-muted/40 animate-pulse" />
                                        <div className="h-3 w-1/3 rounded-full bg-muted/40 animate-pulse" />
                                        <div className="mt-3 h-9 w-full rounded-full bg-muted/30 animate-pulse" />
                                    </div>
                                </div>
                            ))
                            : featured.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addItem}
                                />
                            ))}
                    </div>
                )}
            </section>

            {!isLoading && products.length > 4 && (
                <div className="flex justify-center pt-8 pb-2">
                    <Link href="/products">
                        <Button variant="outline" className="h-11 rounded-full px-8 text-sm font-medium border-border/60 hover:border-primary/40">
                            Explore all {products.length} products
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>
            )}
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
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-black/20">
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
                <Button
                    variant="ghost"
                    className="w-full h-9 rounded-full text-[13px] border border-border/60 hover:bg-muted/50 hover:border-border"
                    onClick={() => onAddToCart(product)}
                >
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}
