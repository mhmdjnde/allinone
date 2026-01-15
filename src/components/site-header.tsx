"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import { ProductDetailsDialog } from "@/components/product-details-dialog";
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
    Trash2,
} from "lucide-react";

export function SiteHeader() {
    const { items, totalCount, subtotal, addItem, updateQuantity, removeItem } =
        useCart();
    const { products } = useProducts();
    const shippingFee = 3.99;
    const total = subtotal + shippingFee;
    const isCheckoutDisabled = subtotal < 10;
    const pathname = usePathname();
    const isCheckoutPage = pathname === "/checkout";
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);
    const mobileSearchRef = useRef<HTMLDivElement | null>(null);

    const searchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return [];
        }
        return products
            .filter((product) => product.title.toLowerCase().includes(query))
            .slice(0, 5);
    }, [searchQuery, products]);

    useEffect(() => {
        if (!selectedProduct && products[0]) {
            setSelectedProduct(products[0]);
        }
    }, [products, selectedProduct]);

    const openDetails = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!(event.target instanceof Node)) {
                return;
            }

            const clickedDesktop =
                searchRef.current?.contains(event.target) ?? false;
            const clickedMobile =
                mobileSearchRef.current?.contains(event.target) ?? false;

            if (!clickedDesktop && !clickedMobile) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

            <div className="supports-[backdrop-filter]:bg-background/60 bg-background/85 backdrop-blur-xl">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="flex h-16 items-center justify-between gap-3">
                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <span className="relative grid h-10 w-10 place-items-center rounded-2xl border bg-muted/40 shadow-sm overflow-hidden">
                                <Image
                                    src="/brand/logo.png"
                                    alt="AllInOne"
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 object-contain p-1"
                                    priority
                                />
                            </span>

                            <span className="flex h-10 items-center text-lg font-semibold tracking-tight text-foreground">
                                AllInOne
                            </span>
                        </Link>

                        <Link href="/products" className="hidden sm:block">
                            <Button
                                variant="secondary"
                                className="h-10 rounded-2xl px-4"
                            >
                                Shop
                            </Button>
                        </Link>

                        <div className="hidden flex-1 items-center justify-center md:flex">
                            <div
                                className="relative w-full max-w-xl"
                                ref={searchRef}
                            >
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search products"
                                    className="pl-9 h-11 rounded-2xl bg-muted/50 border-muted/60 focus-visible:ring-2 focus-visible:ring-emerald-400/40"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    onFocus={() => setIsSearchOpen(true)}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            searchQuery.trim()
                                        ) {
                                            router.push(
                                                `/products?q=${encodeURIComponent(
                                                    searchQuery
                                                )}`
                                            );
                                        }
                                    }}
                                />
                                {isSearchOpen && searchResults.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border bg-card/95 p-2 shadow-xl backdrop-blur">
                                        <div className="space-y-1">
                                            {searchResults.map((product) => (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() => {
                                                        openDetails(product);
                                                        setIsSearchOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted/40"
                                                >
                                                    <div className="h-10 w-10 overflow-hidden rounded-xl bg-muted/30">
                                                        {product.imageUrl ? (
                                                            <img
                                                                src={product.imageUrl}
                                                                alt={
                                                                    product.imageAlt ??
                                                                    product.title
                                                                }
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <span className="font-medium">
                                                        {product.title}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <Separator className="my-2" />
                                        <Link
                                            href={`/products?q=${encodeURIComponent(
                                                searchQuery
                                            )}`}
                                            onClick={() =>
                                                setIsSearchOpen(false)
                                            }
                                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            View all results
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="md:hidden rounded-xl"
                                        aria-label="Open menu"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[320px]">
                                    <SheetHeader>
                                        <SheetTitle>AllInOne</SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-4 space-y-3">
                                        <div className="relative">
                                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Search"
                                                className="pl-9 h-11 rounded-2xl"
                                            />
                                        </div>

                                        <Separator />

                                        <nav className="space-y-2">
                                            <Link
                                                href="/products"
                                                className="block"
                                            >
                                                <Button
                                                    variant="secondary"
                                                    className="w-full justify-between rounded-2xl"
                                                >
                                                    Browse products
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {!isCheckoutPage && (
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="secondary"
                                            className="rounded-2xl h-11 px-3 sm:px-4"
                                            aria-label="Open cart"
                                        >
                                            <ShoppingBag className="mr-2 h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                Cart
                                            </span>
                                            <span className="ml-2 grid h-6 min-w-6 place-items-center rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300 px-2 text-xs font-semibold text-black">
                                                {totalCount}
                                            </span>
                                        </Button>
                                    </SheetTrigger>

                                    <SheetContent
                                        side="right"
                                        className="w-[380px] sm:w-[420px] bg-card/95 backdrop-blur-xl border-l p-6 pt-5 gap-6"
                                    >
                                        <SheetHeader className="p-0">
                                            <SheetTitle>Your cart</SheetTitle>
                                        </SheetHeader>

                                        <div className="flex flex-1 flex-col gap-5 overflow-hidden">
                                            <div className="flex-1 overflow-y-auto pr-1">
                                                {items.length === 0 ? (
                                                    <div className="rounded-2xl border bg-muted/30 p-5">
                                                        <p className="font-medium">
                                                            Your cart is empty
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Add items to get started.
                                                        </p>
                                                        <Link
                                                            href="/products"
                                                            className="mt-4 inline-block"
                                                        >
                                                            <Button className="rounded-2xl">
                                                                Browse products
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {items.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="flex items-start gap-3 rounded-2xl border bg-muted/20 p-4"
                                                            >
                                                                <div className="h-16 w-16 flex-none overflow-hidden rounded-xl bg-muted/30">
                                                                    {item.imageUrl ? (
                                                                        <img
                                                                            src={item.imageUrl}
                                                                            alt={
                                                                                item.imageAlt ??
                                                                                item.title
                                                                            }
                                                                            className="h-full w-full object-cover"
                                                                            loading="lazy"
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {item.title}
                                                                            </p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                ${item.price.toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8"
                                                                            onClick={() =>
                                                                                removeItem(item.id)
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                    <div className="mt-3 flex items-center gap-2">
                                                                        <Button
                                                                            size="icon"
                                                                            variant="secondary"
                                                                            className="h-8 w-8 rounded-xl"
                                                                            onClick={() =>
                                                                                updateQuantity(
                                                                                    item.id,
                                                                                    item.quantity - 1
                                                                                )
                                                                            }
                                                                        >
                                                                            <Minus className="h-4 w-4" />
                                                                        </Button>
                                                                        <span className="min-w-8 text-center text-sm font-medium">
                                                                            {item.quantity}
                                                                        </span>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="secondary"
                                                                            className="h-8 w-8 rounded-xl"
                                                                            onClick={() =>
                                                                                addItem(item)
                                                                            }
                                                                        >
                                                                            <Plus className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="rounded-2xl border bg-muted/30 p-4">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">
                                                            Subtotal
                                                        </span>
                                                        <span className="font-semibold">
                                                            ${subtotal.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">
                                                            Shipping
                                                        </span>
                                                        <span className="font-semibold">
                                                            ${shippingFee.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <Separator />
                                                    <div className="flex items-center justify-between text-base font-semibold">
                                                        <span>Total</span>
                                                        <span>${total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isCheckoutDisabled && (
                                                <p className="text-xs text-amber-200/80">
                                                    Minimum order is $10.00.
                                                </p>
                                            )}

                                            {isCheckoutDisabled ? (
                                                <Button
                                                    className="w-full rounded-2xl h-11"
                                                    disabled
                                                >
                                                    Go to checkout
                                                </Button>
                                            ) : (
                                                <Link href="/checkout">
                                                    <Button className="w-full rounded-2xl h-11">
                                                        Go to checkout
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            )}
                        </div>
                    </div>

                    <div className="pb-3 md:hidden">
                        <div className="relative" ref={mobileSearchRef}>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search products"
                                className="pl-9 h-11 rounded-2xl bg-muted/50 border-muted/60"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                onFocus={() => setIsSearchOpen(true)}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" &&
                                        searchQuery.trim()
                                    ) {
                                        router.push(
                                            `/products?q=${encodeURIComponent(
                                                searchQuery
                                            )}`
                                        );
                                    }
                                }}
                            />
                            {isSearchOpen && searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border bg-card/95 p-2 shadow-xl backdrop-blur">
                                    <div className="space-y-1">
                                        {searchResults.map((product) => (
                                            <button
                                                key={product.id}
                                                type="button"
                                                onClick={() => {
                                                    openDetails(product);
                                                    setIsSearchOpen(false);
                                                }}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted/40"
                                            >
                                                <div className="h-10 w-10 overflow-hidden rounded-xl bg-muted/30">
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={
                                                                product.imageAlt ??
                                                                product.title
                                                            }
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : null}
                                                </div>
                                                <span className="font-medium">
                                                    {product.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <Separator className="my-2" />
                                    <Link
                                        href={`/products?q=${encodeURIComponent(
                                            searchQuery
                                        )}`}
                                        onClick={() => setIsSearchOpen(false)}
                                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        View all results
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
            <ProductDetailsDialog
                product={selectedProduct}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onAddToCart={addItem}
            />
        </header>
    );
}
