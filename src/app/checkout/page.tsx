"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const countryCodes = [
    { code: "+961", label: "Lebanon" },
    { code: "+971", label: "UAE" },
    { code: "+966", label: "Saudi Arabia" },
    { code: "+20", label: "Egypt" },
    { code: "+962", label: "Jordan" },
];

export default function CheckoutPage() {
    const [countryCode, setCountryCode] = useState("+961");
    const [phone, setPhone] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const fullPhone = useMemo(() => {
        if (!phone.trim()) return countryCode;
        return `${countryCode} ${phone.trim()}`;
    }, [countryCode, phone]);

    const validate = () => {
        const nextErrors: Record<string, string> = {};
        if (!firstName.trim()) nextErrors.firstName = "Required";
        if (!lastName.trim()) nextErrors.lastName = "Required";
        if (!phone.trim()) nextErrors.phone = "Required";
        if (!address.trim()) nextErrors.address = "Required";
        setErrors(nextErrors);
        return nextErrors;
    };

    const handleSubmit = () => {
        const nextErrors = validate();
        if (Object.keys(nextErrors).length > 0) return;
        setSubmitted(true);
    };

    const isComplete = firstName.trim() && lastName.trim() && phone.trim() && address.trim();

    return (
        <div className="space-y-8">

            {/* ── PAGE HEADER ──────────────────────────────────── */}
            <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card mt-6 px-7 py-9 md:px-12 md:py-11">
                <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60">
                    — Final step
                </p>
                <h1 className="mt-3 font-serif font-bold italic leading-tight tracking-tight text-foreground"
                    style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)" }}>
                    Confirm your order.
                </h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    We&apos;ll send your order details to WhatsApp for confirmation.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </section>

            {/* ── FORM + CONFIRMATION ──────────────────────────── */}
            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">

                {/* Customer details */}
                <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-7 space-y-6">
                    <div>
                        <h2 className="font-serif italic text-lg font-bold">Customer details</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Fields without &ldquo;optional&rdquo; are required.
                        </p>
                    </div>
                    <Separator className="opacity-40" />

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

                        {/* Name */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-semibold">
                                    First name
                                </label>
                                {errors.firstName && (
                                    <p className="text-[11px] text-destructive font-medium">{errors.firstName}</p>
                                )}
                                <Input
                                    required
                                    placeholder="First name"
                                    className={`h-10 rounded-xl bg-muted/40 text-sm ${errors.firstName ? "border-destructive/50" : "border-border/60"} focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30`}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-semibold">
                                    Last name
                                </label>
                                {errors.lastName && (
                                    <p className="text-[11px] text-destructive font-medium">{errors.lastName}</p>
                                )}
                                <Input
                                    required
                                    placeholder="Last name"
                                    className={`h-10 rounded-xl bg-muted/40 text-sm ${errors.lastName ? "border-destructive/50" : "border-border/60"} focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30`}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email + Phone */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-semibold">
                                    Email <span className="text-muted-foreground/40">(optional)</span>
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@email.com"
                                    className="h-10 rounded-xl bg-muted/40 border-border/60 text-sm focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-semibold">
                                    Phone number
                                </label>
                                {errors.phone && (
                                    <p className="text-[11px] text-destructive font-medium">{errors.phone}</p>
                                )}
                                <div className="flex gap-2">
                                    <select
                                        className="h-10 rounded-xl border border-border/60 bg-muted/40 px-2.5 text-xs text-foreground outline-none focus:border-primary/40 shrink-0"
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                    >
                                        {countryCodes.map((opt) => (
                                            <option key={opt.code} value={opt.code}>
                                                {opt.label} {opt.code}
                                            </option>
                                        ))}
                                    </select>
                                    <Input
                                        required
                                        placeholder="Phone number"
                                        className={`h-10 flex-1 rounded-xl bg-muted/40 text-sm ${errors.phone ? "border-destructive/50" : "border-border/60"} focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30`}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-semibold">
                                Delivery address
                            </label>
                            {errors.address && (
                                <p className="text-[11px] text-destructive font-medium">{errors.address}</p>
                            )}
                            <textarea
                                required
                                placeholder="Street, building, floor, city, landmark…"
                                className={`min-h-[110px] w-full rounded-xl border ${errors.address ? "border-destructive/50" : "border-border/60"} bg-muted/40 p-3 text-sm text-foreground outline-none focus:border-primary/40 resize-none transition-colors`}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 font-semibold">
                                Notes <span className="text-muted-foreground/40">(optional)</span>
                            </label>
                            <textarea
                                placeholder="Special delivery instructions or requests."
                                className="min-h-[80px] w-full rounded-xl border border-border/60 bg-muted/40 p-3 text-sm text-foreground outline-none focus:border-primary/40 resize-none transition-colors"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {/* Confirmation panel */}
                <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-7 space-y-6">
                    <div>
                        <h2 className="font-serif italic text-lg font-bold">Confirmation</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            A WhatsApp message will confirm your order.
                        </p>
                    </div>
                    <Separator className="opacity-40" />

                    <div className="space-y-4">
                        {/* Phone preview */}
                        <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold">WhatsApp number</p>
                            <p className="mt-1.5 text-base font-bold tabular-nums">{fullPhone}</p>
                        </div>

                        {/* Success state */}
                        {submitted ? (
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0 mt-0.5">
                                    <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 4l3 3 5-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-primary">Confirmation sent!</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        We&apos;ll reach you on {fullPhone} via WhatsApp shortly.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Button
                                className="w-full h-11 rounded-full text-sm font-semibold shadow-lg shadow-primary/20"
                                disabled={!isComplete}
                                onClick={handleSubmit}
                            >
                                Send confirmation to WhatsApp
                            </Button>
                        )}

                        {!isComplete && !submitted && (
                            <p className="text-[11px] text-muted-foreground/60 text-center">
                                Fill in all required fields to continue.
                            </p>
                        )}

                        <p className="text-[11px] text-muted-foreground/50 text-center">
                            Double-check your phone number before submitting.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
