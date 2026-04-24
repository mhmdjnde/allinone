import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border/60 mt-20">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

                    {/* Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="h-6 w-6 overflow-hidden rounded-md opacity-80">
                                <Image
                                    src="/brand/logo.png"
                                    alt="AllInOne"
                                    width={24}
                                    height={24}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="font-serif text-sm font-bold italic tracking-tight">AllInOne</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                            Curated drops and daily essentials — everything in one place.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <Link href="/products" className="hover:text-foreground transition-colors">
                            Shop
                        </Link>
                        <Link href="/checkout" className="hover:text-foreground transition-colors">
                            Checkout
                        </Link>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-t border-border/40 pt-6">
                    <p className="text-[11px] text-muted-foreground/60">
                        © {year} AllInOne. All rights reserved.
                    </p>
                    <p className="text-[11px] text-muted-foreground/40">
                        Studio line 01
                    </p>
                </div>
            </div>
        </footer>
    );
}
