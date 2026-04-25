"use client";

import { useState } from "react";

type ProductImage = { id: string; url: string; alt: string; isPrimary: boolean };

export function ProductGallery({
    images,
    tag,
}: {
    images: ProductImage[];
    tag?: string | null;
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = images[activeIndex];

    return (
        <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-muted/20">
                <img
                    key={active.id}
                    src={active.url}
                    alt={active.alt}
                    className="h-full w-full object-cover transition-opacity duration-300"
                />
                {tag && (
                    <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground uppercase tracking-wider shadow-md">
                            {tag}
                        </span>
                    </div>
                )}
                {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-background/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-muted-foreground tabular-nums">
                        {activeIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIndex(i)}
                            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                i === activeIndex
                                    ? "border-primary shadow-md shadow-primary/20 scale-105"
                                    : "border-transparent opacity-60 hover:opacity-100 hover:border-border"
                            }`}
                        >
                            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
