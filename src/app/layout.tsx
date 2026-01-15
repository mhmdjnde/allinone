import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-grotesk",
});

export const metadata: Metadata = {
    title: "AllInOne Shop",
    description: "Curated drops and daily essentials.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`dark ${inter.variable} ${spaceGrotesk.variable}`}
        >
            <body className="min-h-dvh bg-background text-foreground">
                <div
                    aria-hidden
                    className="pointer-events-none fixed inset-0 -z-10"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_55%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.16),transparent_55%)]" />
                    <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:72px_72px]" />
                </div>

                <a
                    href="#content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
                >
                    Skip to content
                </a>

                <CartProvider>
                    <SiteHeader />

                    <main id="content" className="mx-auto max-w-6xl px-4 py-8">
                        {children}
                    </main>

                    <SiteFooter />
                </CartProvider>
            </body>
        </html>
    );
}
