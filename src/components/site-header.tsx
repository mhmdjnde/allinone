"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-provider";
import { useProducts } from "@/lib/use-products";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    ShoppingBag,
    Search,
    Menu,
    ArrowRight,
    Minus,
    Plus,
    X,
} from "lucide-react";

export function SiteHeader() {
    const { items, totalCount, subtotal, addItem, updateQuantity, removeItem } = useCart();
    const { products } = useProducts();
    const shippingFee = 3.99;
    const total = subtotal + shippingFee;
    const isCheckoutDisabled = subtotal < 10;
    const pathname = usePathname();
    const isCheckoutPage = pathname === "/checkout";
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);
    const mobileSearchRef = useRef<HTMLDivElement | null>(null);

    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];
        return products
            .filter((p) => p.title.toLowerCase().includes(query))
            .slice(0, 5);
    }, [searchQuery, products]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!(event.target instanceof Node)) return;
            const hitDesktop = searchRef.current?.contains(event.target) ?? false;
            const hitMobile = mobileSearchRef.current?.contains(event.target) ?? false;
            if (!hitDesktop && !hitMobile) setIsSearchOpen(false);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    return (
        <header className="sticky top-0 z-50">
            <div className="border-b border-border/80 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="flex h-[60px] items-center justify-between gap-4">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                            <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                                    <rect x="2" y="2" width="24" height="24" rx="7" className="fill-primary/15" />
                                    <path
                                        d="M14 5L16.5 11.5L23 14L16.5 16.5L14 23L11.5 16.5L5 14L11.5 11.5Z"
                                        className="fill-primary"
                                    />
                                </svg>
                            </div>
                            <span className="font-serif text-base font-bold italic tracking-tight leading-none">
                                One For All
                            </span>
                        </Link>

                        {/* Desktop search */}
                        <div className="hidden flex-1 items-center justify-center md:flex max-w-sm mx-auto">
                            <div className="relative w-full" ref={searchRef}>
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products…"
                                    className="h-9 w-full rounded-full bg-muted/50 pl-9 text-sm border-transparent focus-visible:border-primary/30 focus-visible:ring-1 focus-visible:ring-primary/30"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && searchQuery.trim()) {
                                            router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
                                            closeSearch();
                                        }
                                    }}
                                />

                                {isSearchOpen && searchResults.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
                                        <div className="p-1.5 space-y-0.5">
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.slug}`}
                                                    onClick={closeSearch}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="h-9 w-9 flex-none overflow-hidden rounded-lg bg-muted">
                                                        {product.imageUrl && (
                                                            <img src={product.imageUrl} alt={product.imageAlt ?? product.title} className="h-full w-full object-cover" loading="lazy" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium leading-tight truncate">{product.title}</p>
                                                        <p className="text-xs text-primary font-medium mt-0.5">${product.price}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="border-t border-border/60">
                                            <Link
                                                href={`/products?q=${encodeURIComponent(searchQuery)}`}
                                                onClick={closeSearch}
                                                className="flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                All results for &ldquo;{searchQuery}&rdquo;
                                                <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-1">
                            <Link href="/products" className="hidden md:block">
                                <Button variant="ghost" size="sm" className="rounded-full text-sm h-8 px-4 font-medium text-muted-foreground hover:text-foreground">
                                    Shop
                                </Button>
                            </Link>

                            {/* Mobile hamburger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden rounded-full h-9 w-9"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] bg-card border-r border-border/80 p-0">
                                    <SheetHeader className="px-6 pt-6 pb-4">
                                        <SheetTitle className="font-serif italic text-base font-bold">One For All</SheetTitle>
                                    </SheetHeader>
                                    <div className="px-6 space-y-4">
                                        <div className="relative" ref={mobileSearchRef}>
                                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Search…"
                                                className="pl-9 h-10 rounded-full bg-muted/50 text-sm"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setIsSearchOpen(true)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && searchQuery.trim()) {
                                                        router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
                                                        closeSearch();
                                                    }
                                                }}
                                            />
                                            {isSearchOpen && searchResults.length > 0 && (
                                                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                                                    <div className="p-1.5 space-y-0.5">
                                                        {searchResults.map((product) => (
                                                            <Link
                                                                key={product.id}
                                                                href={`/products/${product.slug}`}
                                                                onClick={closeSearch}
                                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted/50 transition-colors"
                                                            >
                                                                <div className="h-8 w-8 flex-none overflow-hidden rounded-lg bg-muted">
                                                                    {product.imageUrl && (
                                                                        <img src={product.imageUrl} alt={product.imageAlt ?? product.title} className="h-full w-full object-cover" loading="lazy" />
                                                                    )}
                                                                </div>
                                                                <span className="text-sm font-medium truncate">{product.title}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Separator />
                                        <Link href="/products">
                                            <Button variant="ghost" className="w-full justify-between rounded-xl h-11 font-medium">
                                                Browse products
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Cart */}
                            {!isCheckoutPage && (
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="relative rounded-full h-9 w-9"
                                            aria-label="Open cart"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            {totalCount > 0 && (
                                                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground leading-none">
                                                    {totalCount > 9 ? "9+" : totalCount}
                                                </span>
                                            )}
                                        </Button>
                                    </SheetTrigger>

                                    <SheetContent
                                        side="right"
                                        className="w-[360px] sm:w-[400px] bg-card border-l border-border/80 p-0 flex flex-col"
                                    >
                                        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60">
                                            <div className="flex items-center justify-between">
                                                <SheetTitle className="font-serif italic text-base font-bold">Your Cart</SheetTitle>
                                                {totalCount > 0 && (
                                                    <span className="text-xs text-muted-foreground">{totalCount} item{totalCount !== 1 ? "s" : ""}</span>
                                                )}
                                            </div>
                                        </SheetHeader>

                                        <div className="flex flex-1 flex-col overflow-hidden">
                                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                                {items.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                                        <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                                            <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                                                        </div>
                                                        <p className="font-medium text-sm">Cart is empty</p>
                                                        <p className="mt-1 text-xs text-muted-foreground max-w-[180px]">Add items from the shop to get started.</p>
                                                        <Link href="/products" className="mt-5">
                                                            <Button size="sm" className="rounded-full px-5">Browse Shop</Button>
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-5">
                                                        {items.map((item) => (
                                                            <div key={item.cartKey} className="flex gap-3.5">
                                                                <div className="h-[72px] w-[72px] flex-none overflow-hidden rounded-xl bg-muted">
                                                                    {item.imageUrl && (
                                                                        <img src={item.imageUrl} alt={item.imageAlt ?? item.title} className="h-full w-full object-cover" loading="lazy" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="min-w-0">
                                                                            <p className="text-sm font-medium leading-snug line-clamp-2">{item.title}</p>
                                                                            {item.selectedOption && (
                                                                                <span className="inline-block mt-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                                                    {item.selectedOption.name}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <button
                                                                            onClick={() => removeItem(item.cartKey)}
                                                                            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                                                                            aria-label="Remove item"
                                                                        >
                                                                            <X className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-xs text-primary font-semibold mt-0.5 tabular-nums">${(item.price * item.quantity).toFixed(2)}</p>
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                                                                            className="h-6 w-6 rounded-full border border-border/80 flex items-center justify-center hover:border-primary/50 transition-colors"
                                                                            aria-label="Decrease quantity"
                                                                        >
                                                                            <Minus className="h-2.5 w-2.5" />
                                                                        </button>
                                                                        <span className="text-xs font-semibold w-5 text-center tabular-nums">{item.quantity}</span>
                                                                        <button
                                                                            onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                                                            className="h-6 w-6 rounded-full border border-border/80 flex items-center justify-center hover:border-primary/50 transition-colors"
                                                                            aria-label="Increase quantity"
                                                                        >
                                                                            <Plus className="h-2.5 w-2.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {items.length > 0 && (
                                                <div className="px-6 pb-6 pt-4 border-t border-border/60 space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Subtotal</span>
                                                            <span className="font-medium tabular-nums">${subtotal.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Shipping</span>
                                                            <span className="font-medium tabular-nums">${shippingFee.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-border/60">
                                                            <span>Total</span>
                                                            <span className="text-primary tabular-nums">${total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    {isCheckoutDisabled && (
                                                        <p className="text-[11px] text-muted-foreground">Minimum order of $10.00 required.</p>
                                                    )}
                                                    {isCheckoutDisabled ? (
                                                        <Button className="w-full rounded-full h-11 text-sm font-semibold" disabled>
                                                            Checkout
                                                        </Button>
                                                    ) : (
                                                        <Link href="/checkout">
                                                            <Button className="w-full rounded-full h-11 text-sm font-semibold">
                                                                Proceed to Checkout
                                                                <ArrowRight className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            )}
                        </div>
                    </div>

                    {/* Mobile search bar */}
                    <div className="pb-3 md:hidden">
                        <div className="relative" ref={mobileSearchRef}>
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products…"
                                className="h-9 w-full rounded-full bg-muted/50 pl-9 text-sm border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && searchQuery.trim()) {
                                        router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
                                        closeSearch();
                                    }
                                }}
                            />
                            {isSearchOpen && searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
                                    <div className="p-1.5 space-y-0.5">
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug}`}
                                                onClick={closeSearch}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="h-9 w-9 flex-none overflow-hidden rounded-lg bg-muted">
                                                    {product.imageUrl && (
                                                        <img src={product.imageUrl} alt={product.imageAlt ?? product.title} className="h-full w-full object-cover" loading="lazy" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium leading-tight truncate">{product.title}</p>
                                                    <p className="text-xs text-primary font-medium mt-0.5">${product.price}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="border-t border-border/60">
                                        <Link
                                            href={`/products?q=${encodeURIComponent(searchQuery)}`}
                                            onClick={closeSearch}
                                            className="flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            All results for &ldquo;{searchQuery}&rdquo;
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
