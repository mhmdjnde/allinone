import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const { data, error } = await supabaseServer
        .from("products")
        .select(
            `
            id,
            name,
            slug,
            description,
            price,
            tag,
            image_path,
            image_alt,
            created_at,
            rating,
            rating_count,
            highlights,
            option_label,
            product_types (
                name,
                slug
            ),
            product_images (
                id,
                image_path,
                image_alt,
                is_primary,
                sort_order
            ),
            product_options (
                id,
                name,
                image_path,
                image_alt
            )
        `
        )
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const typeRow = Array.isArray(data.product_types)
        ? data.product_types[0]
        : data.product_types;

    const getUrl = (path: string | null) =>
        path
            ? supabaseServer.storage
                  .from("product-images")
                  .getPublicUrl(path).data.publicUrl
            : "";

    const images = (data.product_images ?? [])
        .filter((img: { is_primary: boolean; sort_order: number; image_path: string; image_alt: string | null; id: string }) => img.image_path)
        .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
        .map((img: { id: string; image_path: string; image_alt: string | null; is_primary: boolean }) => ({
            id: img.id,
            url: getUrl(img.image_path),
            alt: img.image_alt ?? data.name,
            isPrimary: img.is_primary,
        }));

    const options = (data.product_options ?? []).map((opt: { id: string; name: string; image_path: string; image_alt: string | null }) => ({
        id: opt.id,
        name: opt.name,
        imageUrl: getUrl(opt.image_path),
        imageAlt: opt.image_alt ?? opt.name,
    }));

    const product = {
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
        ratingCount: data.rating_count ?? null,
        highlights: data.highlights ?? null,
        optionLabel: data.option_label ?? null,
        images,
        options,
    };

    return NextResponse.json(product);
}
