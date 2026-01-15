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
            product_types (
                name,
                slug
            )
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
        const imageUrl = row.image_path
            ? supabaseServer.storage
                  .from("product-images")
                  .getPublicUrl(row.image_path).data.publicUrl
            : "";

        return {
            id: row.id,
            title: row.name,
            price: Number(row.price ?? 0),
            tag: row.tag ?? null,
            category: row.product_types?.name ?? "Uncategorized",
            categorySlug: row.product_types?.slug ?? "uncategorized",
            description: row.description ?? null,
            imageUrl,
            imageAlt: row.image_alt ?? row.name,
            createdAt: row.created_at,
        };
    });

    return NextResponse.json(products);
}
