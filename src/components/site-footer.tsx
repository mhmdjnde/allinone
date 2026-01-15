import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-16">
            <div className="mx-auto max-w-6xl px-4">
                <div className="rounded-3xl border bg-gradient-to-br from-muted/30 via-background to-muted/20 p-6 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl border bg-muted/40 overflow-hidden">
                                <Image
                                    src="/brand/logo.png"
                                    alt="AllInOne"
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 object-contain p-1"
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-semibold tracking-tight">
                                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                                            AllInOne
                                        </span>
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Studio line 01
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Link
                                className="text-muted-foreground hover:text-foreground"
                                href="/products"
                            >
                                Products
                            </Link>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <p className="text-xs text-muted-foreground">
                            Copyright {year} AllInOne. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
        </footer>
    );
}
