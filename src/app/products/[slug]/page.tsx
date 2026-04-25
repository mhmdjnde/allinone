import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Package, Sparkles, Quote } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductOptions } from "./product-options";
import { ProductGallery } from "./product-gallery";
import type { Product } from "@/lib/products";

type ProductImage = { id: string; url: string; alt: string; isPrimary: boolean };
type ProductOption = { id: string; name: string; imageUrl: string; imageAlt: string };

type FullProduct = Product & {
    optionLabel: string | null;
    images: ProductImage[];
    options: ProductOption[];
};

type Review = {
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string;
    created_at: string;
};

async function getProduct(slug: string): Promise<FullProduct | null> {
    const { data, error } = await supabaseServer
        .from("products")
        .select(
            `
            id, name, slug, description, price, tag,
            image_path, image_alt, created_at,
            rating, rating_count, highlights, option_label,
            product_types ( name, slug ),
            product_images ( id, image_path, image_alt, is_primary, sort_order ),
            product_options ( id, name, image_path, image_alt )
            `
        )
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error || !data) return null;

    const typeRow = Array.isArray(data.product_types)
        ? data.product_types[0]
        : (data.product_types as { name: string; slug: string } | null);

    const getUrl = (path: string | null): string =>
        path
            ? supabaseServer.storage.from("product-images").getPublicUrl(path).data.publicUrl
            : "";

    const rawImages = ((data.product_images as Array<{ id: string; image_path: string; image_alt: string | null; is_primary: boolean; sort_order: number }>) ?? [])
        .filter((img) => img.image_path)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => ({
            id: img.id,
            url: getUrl(img.image_path),
            alt: img.image_alt ?? data.name,
            isPrimary: img.is_primary,
        }));

    const rawOptions = ((data.product_options as Array<{ id: string; name: string; image_path: string; image_alt: string | null }>) ?? [])
        .map((opt) => ({
            id: opt.id,
            name: opt.name,
            imageUrl: getUrl(opt.image_path),
            imageAlt: opt.image_alt ?? opt.name,
        }));

    return {
        id: data.id,
        title: data.name,
        slug: data.slug,
        price: Number(data.price ?? 0),
        tag: data.tag ?? null,
        category: typeRow?.name ?? "Uncategorized",
        categorySlug: typeRow?.slug ?? "uncategorized",
        description: data.description ?? null,
        imageUrl: getUrl(data.image_path),
        imageAlt: data.image_alt ?? data.name,
        createdAt: data.created_at,
        rating: data.rating != null ? Number(data.rating) : null,
        ratingCount: (data.rating_count as number | null) ?? null,
        highlights: (data.highlights as string[] | null) ?? null,
        optionLabel: (data.option_label as string | null) ?? null,
        images: rawImages,
        options: rawOptions,
    };
}

async function getReviews(productId: string): Promise<Review[]> {
    try {
        const { data, error } = await supabaseServer
            .from("product_reviews")
            .select("id, reviewer_name, rating, comment, created_at")
            .eq("product_id", productId)
            .order("created_at", { ascending: false })
            .limit(20);
        if (error) return [];
        return (data ?? []) as Review[];
    } catch {
        return [];
    }
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
    const sizes = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-6 w-6" };
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rating >= star - 0.25;
                return (
                    <Star
                        key={star}
                        className={`${sizes[size]} ${filled ? "text-primary fill-primary" : "text-muted-foreground/25"}`}
                    />
                );
            })}
        </div>
    );
}

function RatingBreakdown({ reviews }: { reviews: Review[] }) {
    const count = reviews.length;
    if (count === 0) return null;

    return (
        <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
                const n = reviews.filter((r) => r.rating === star).length;
                const pct = Math.round((n / count) * 100);
                return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 w-7 shrink-0">
                            <span className="tabular-nums text-muted-foreground">{star}</span>
                            <Star className="h-3 w-3 text-primary fill-primary" />
                        </div>
                        <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="tabular-nums text-muted-foreground/60 w-7 text-right">{pct}%</span>
                    </div>
                );
            })}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const initials = review.reviewer_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="relative flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-5 overflow-hidden">
            {/* Decorative large quote */}
            <div className="absolute -right-1 -top-1 text-primary/5 pointer-events-none select-none" aria-hidden>
                <Quote className="h-16 w-16 fill-current" />
            </div>

            {/* Stars */}
            <StarRating rating={review.rating} size="sm" />

            {/* Comment */}
            <p className="text-sm leading-relaxed text-foreground/80 relative z-10">
                {review.comment}
            </p>

            {/* Reviewer */}
            <div className="flex items-center gap-2.5 mt-auto pt-2 border-t border-border/30">
                <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">{initials}</span>
                </div>
                <div>
                    <p className="text-xs font-semibold text-foreground">{review.reviewer_name}</p>
                    <p className="text-[10px] text-muted-foreground/50">✓ Verified buyer</p>
                </div>
            </div>
        </div>
    );
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) notFound();

    const reviews = await getReviews(product.id);

    const allImages: ProductImage[] =
        product.images.length > 0
            ? product.images
            : [{ id: "main", url: product.imageUrl, alt: product.imageAlt ?? product.title, isPrimary: true }];

    const hasRating = product.rating != null && product.ratingCount != null && product.ratingCount > 0;
    const ratingVal = product.rating ?? 0;
    const ratingCount = product.ratingCount ?? 0;
    const hasMultipleOptions = product.options.length > 1;

    return (
        <div className="space-y-12 pt-6">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <span className="opacity-40">/</span>
                <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
                <span className="opacity-40">/</span>
                <span className="text-foreground/70 truncate max-w-[160px]">{product.title}</span>
            </nav>

            {/* Product */}
            <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">

                {/* Gallery */}
                <ProductGallery images={allImages} tag={product.tag} />

                {/* Details */}
                <div className="space-y-7">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/60 mb-2">
                            {product.category}
                        </p>
                        <h1 className="font-serif text-3xl font-bold italic leading-tight tracking-tight md:text-4xl">
                            {product.title}
                        </h1>
                    </div>

                    {/* Rating */}
                    {hasRating && (
                        <div className="flex items-center gap-3 flex-wrap">
                            <StarRating rating={ratingVal} size="md" />
                            <span className="text-sm font-bold text-primary tabular-nums">{ratingVal.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">
                                {ratingCount.toLocaleString()} review{ratingCount !== 1 ? "s" : ""}
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="pb-1">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">Price</p>
                        <p className="mt-1 text-5xl font-bold text-primary tabular-nums">${product.price.toFixed(2)}</p>
                    </div>

                    {/* Highlights */}
                    {product.highlights && product.highlights.length > 0 && (
                        <div className="rounded-xl border border-border/40 bg-muted/20 p-4 space-y-3">
                            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 flex items-center gap-1.5 font-semibold">
                                <Sparkles className="h-3 w-3 text-primary" />
                                Highlights
                            </p>
                            <ul className="space-y-2">
                                {product.highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <span className="text-muted-foreground leading-snug">{h}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description */}
                    {product.description && (
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 mb-2 flex items-center gap-1.5">
                                <Package className="h-3 w-3" />
                                About this product
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Options + CTA */}
                    {hasMultipleOptions ? (
                        <ProductOptions
                            product={product}
                            options={product.options}
                            optionLabel={product.optionLabel}
                        />
                    ) : (
                        <div className="space-y-3 pt-1">
                            <AddToCartButton product={product} />
                            <Link href="/products">
                                <div className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer">
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Continue shopping
                                </div>
                            </Link>
                        </div>
                    )}

                    {hasMultipleOptions && (
                        <Link href="/products">
                            <div className="flex w-full items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Continue shopping
                            </div>
                        </Link>
                    )}
                </div>
            </section>

            {/* Reviews section — shown right after the product details */}
            {reviews.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/50">— What people say</p>
                            <h2 className="font-serif text-2xl font-bold italic mt-1">Customer Reviews</h2>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                            <span className="font-semibold text-primary">
                                {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                            </span>
                            <span className="text-muted-foreground/50">· {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </section>
            )}

            {/* Rating breakdown */}
            {hasRating && (
                <section className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                    <div className="px-6 pt-6 pb-4 border-b border-border/40">
                        <h2 className="font-serif text-xl font-bold italic">Rating &amp; Reviews</h2>
                    </div>
                    <div className="p-6 md:p-8">
                        <div className="grid gap-8 sm:grid-cols-[auto_1fr] items-center">
                            {/* Score display */}
                            <div className="flex flex-col items-center justify-center text-center px-4 py-2">
                                <p className="text-7xl font-bold text-primary tabular-nums leading-none">{ratingVal.toFixed(1)}</p>
                                <div className="mt-3">
                                    <StarRating rating={ratingVal} size="md" />
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground/60">
                                    {ratingCount.toLocaleString()} review{ratingCount !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Breakdown */}
                            <RatingBreakdown reviews={reviews} />
                        </div>

                        <p className="mt-6 text-[11px] text-muted-foreground/30 border-t border-border/30 pt-4">
                            Rating based on {ratingCount.toLocaleString()} verified purchase{ratingCount !== 1 ? "s" : ""}.
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}
