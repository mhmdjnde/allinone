import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
    weight: ["400", "500", "700", "800"],
    style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "One For All — Curated Essentials",
    description: "Curated drops and daily essentials in one place.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`dark ${playfair.variable} ${jakarta.variable}`}
        >
            <body className="min-h-dvh bg-background text-foreground antialiased">
                <a
                    href="#content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
                >
                    Skip to content
                </a>

                <CartProvider>
                    <SiteHeader />
                    <main id="content" className="mx-auto max-w-6xl px-4 pb-24 pt-2">
                        {children}
                    </main>
                    <SiteFooter />
                </CartProvider>
            </body>
        </html>
    );
}
