"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import { ProductDetailsDialog } from "@/components/product-details-dialog";
import { useEffect, useState } from "react";

export default function HomePage() {
    const { addItem } = useCart();
    const { products, isLoading, error } = useProducts();
    const featured = products.slice(0, 4);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (!selectedProduct && featured[0]) {
            setSelectedProduct(featured[0]);
        }
    }, [featured, selectedProduct]);

    const openDetails = (product: Product) => {
        setSelectedProduct(product);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-12">
            <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-card/80 via-background to-muted/30 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_rgba(0,0,0,0.55)] md:p-12">
                <div className="pointer-events-none absolute -top-20 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.35),transparent_60%)]" />
                <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.3),transparent_60%)]" />

                <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                    AllInOne Market
                </h1>

                <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
                    The perfect place where you can find anything you want.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/products">
                        <Button className="h-11 rounded-2xl px-6">
                            Browse products
                        </Button>
                    </Link>
                </div>
            </section>

            <Separator />

            <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Featured</h2>
                        <p className="text-sm text-muted-foreground">
                            This week
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        View all
                    </Link>
                </div>

                {error ? (
                    <p className="text-sm text-muted-foreground">
                        {error}
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, index) => (
                                  <Card
                                      key={`loading-${index}`}
                                      className="rounded-3xl overflow-hidden"
                                  >
                                      <div className="aspect-square bg-muted/30 animate-pulse" />
                                      <CardContent className="p-4 space-y-3">
                                          <div className="h-4 w-2/3 rounded bg-muted/30 animate-pulse" />
                                          <div className="h-4 w-1/3 rounded bg-muted/30 animate-pulse" />
                                          <div className="h-10 w-full rounded-2xl bg-muted/30 animate-pulse" />
                                          <div className="h-10 w-full rounded-2xl bg-muted/30 animate-pulse" />
                                      </CardContent>
                                  </Card>
                              ))
                            : featured.map((product) => (
                                  <Card
                                      key={product.id}
                                      className="rounded-3xl overflow-hidden"
                                  >
                                      <div className="aspect-square bg-muted/30 overflow-hidden">
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
                                              {product.tag ? (
                                                  <Badge
                                                      variant="secondary"
                                                      className="rounded-full"
                                                  >
                                                      {product.tag}
                                                  </Badge>
                                              ) : null}
                                          </div>
                                          <Button
                                              className="mt-3 w-full rounded-2xl"
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
                              ))}
                    </div>
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
