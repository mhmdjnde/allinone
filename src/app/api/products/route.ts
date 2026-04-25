import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
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
            product_types (
                name,
                slug
            ),
            product_options ( id )
        `
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: "Failed to load products." },
            { status: 500 }
        );
    }

    const products = (data ?? []).map((row) => {
        const typeRow = Array.isArray(row.product_types)
            ? row.product_types[0]
            : row.product_types;
        const imageUrl = row.image_path
            ? supabaseServer.storage
                  .from("product-images")
                  .getPublicUrl(row.image_path).data.publicUrl
            : "";

        return {
            id: row.id,
            title: row.name,
            slug: row.slug,
            price: Number(row.price ?? 0),
            tag: row.tag ?? null,
            category: typeRow?.name ?? "Uncategorized",
            categorySlug: typeRow?.slug ?? "uncategorized",
            description: row.description ?? null,
            imageUrl,
            imageAlt: row.image_alt ?? row.name,
            createdAt: row.created_at,
            rating: row.rating != null ? Number(row.rating) : null,
            ratingCount: row.rating_count ?? null,
            highlights: row.highlights ?? null,
            hasOptions: (row.product_options as Array<{ id: string }> ?? []).length > 1,
        };
    });

    return NextResponse.json(products);
}
