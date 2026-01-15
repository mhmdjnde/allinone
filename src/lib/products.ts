export type Product = {
    id: string;
    title: string;
    price: number;
    tag: string | null;
    category: string;
    categorySlug: string;
    description: string | null;
    imageUrl: string;
    imageAlt: string | null;
    createdAt: string;
};

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch("/api/products", { cache: "no-store" });
    if (!response.ok) {
        throw new Error("Failed to load products");
    }
    return response.json();
}
