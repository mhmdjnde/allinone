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
    const [submitMessage, setSubmitMessage] = useState("");

    const fullPhone = useMemo(() => {
        if (!phone.trim()) {
            return countryCode;
        }
        return `${countryCode} ${phone.trim()}`;
    }, [countryCode, phone]);

    const validate = () => {
        const nextErrors: Record<string, string> = {};

        if (!firstName.trim()) {
            nextErrors.firstName = "First name is required.";
        }
        if (!lastName.trim()) {
            nextErrors.lastName = "Last name is required.";
        }
        if (!phone.trim()) {
            nextErrors.phone = "Phone number is required.";
        }
        if (!address.trim()) {
            nextErrors.address = "Address is required.";
        }

        setErrors(nextErrors);
        return nextErrors;
    };

    const handleSubmit = () => {
        const nextErrors = validate();
        if (Object.keys(nextErrors).length > 0) {
            setSubmitMessage("");
            return;
        }

        setSubmitMessage(
            `Confirmation request sent to WhatsApp on ${fullPhone}.`
        );
    };

    const isComplete =
        firstName.trim() &&
        lastName.trim() &&
        phone.trim() &&
        address.trim();

    return (
        <div className="space-y-10">
            <section className="rounded-3xl border bg-gradient-to-br from-card/80 via-background to-muted/20 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.55)] md:p-10 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                            Checkout
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                            Confirm your order.
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                            We will send your order details to WhatsApp for
                            confirmation.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border bg-card/60 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <h2 className="text-lg font-semibold">Customer details</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        All fields are required unless marked optional.
                    </p>
                    <Separator className="my-6" />

                    <form className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                {errors.firstName && (
                                    <p className="text-xs text-amber-200/90">
                                        {errors.firstName}
                                    </p>
                                )}
                                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                                    First name
                                </label>
                                <Input
                                    required
                                    placeholder="First name"
                                    className="mt-2 h-11 rounded-2xl bg-muted/40 border-muted/60"
                                    value={firstName}
                                    onChange={(event) =>
                                        setFirstName(event.target.value)
                                    }
                                />
                            </div>
                            <div>
                                {errors.lastName && (
                                    <p className="text-xs text-amber-200/90">
                                        {errors.lastName}
                                    </p>
                                )}
                                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Last name
                                </label>
                                <Input
                                    required
                                    placeholder="Last name"
                                    className="mt-2 h-11 rounded-2xl bg-muted/40 border-muted/60"
                                    value={lastName}
                                    onChange={(event) =>
                                        setLastName(event.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Email (optional)
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@email.com"
                                    className="mt-2 h-11 rounded-2xl bg-muted/40 border-muted/60"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />
                            </div>
                            <div>
                                {errors.phone && (
                                    <p className="text-xs text-amber-200/90">
                                        {errors.phone}
                                    </p>
                                )}
                                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Phone number
                                </label>
                                <div className="mt-2 flex gap-2">
                                    <select
                                        className="h-11 rounded-2xl border border-muted/60 bg-muted/40 px-3 text-sm text-foreground outline-none focus:border-emerald-400/60"
                                        value={countryCode}
                                        onChange={(event) =>
                                            setCountryCode(event.target.value)
                                        }
                                    >
                                        {countryCodes.map((option) => (
                                            <option
                                                key={option.code}
                                                value={option.code}
                                            >
                                                {option.label} {option.code}
                                            </option>
                                        ))}
                                    </select>
                                    <Input
                                        required
                                        placeholder="Phone number"
                                        className="h-11 flex-1 rounded-2xl bg-muted/40 border-muted/60"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            {errors.address && (
                                <p className="text-xs text-amber-200/90">
                                    {errors.address}
                                </p>
                            )}
                            <label className="text-xs uppercase tracking-wide text-muted-foreground">
                                Detailed address
                            </label>
                            <textarea
                                required
                                placeholder="Street, building, city, floor, landmark..."
                                className="mt-2 min-h-[120px] w-full rounded-2xl border border-muted/60 bg-muted/40 p-3 text-sm text-foreground outline-none focus:border-emerald-400/60"
                                value={address}
                                onChange={(event) =>
                                    setAddress(event.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wide text-muted-foreground">
                                Notes (optional)
                            </label>
                            <textarea
                                placeholder="Delivery notes or special requests."
                                className="mt-2 min-h-[90px] w-full rounded-2xl border border-muted/60 bg-muted/40 p-3 text-sm text-foreground outline-none focus:border-emerald-400/60"
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                            />
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl border bg-card/60 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <h2 className="text-lg font-semibold">Confirmation</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        We will send a WhatsApp message to confirm your order.
                    </p>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                        <div className="rounded-2xl border bg-muted/30 p-4">
                            <p className="text-sm text-muted-foreground">
                                WhatsApp number
                            </p>
                            <p className="mt-1 text-base font-semibold">
                                {fullPhone}
                            </p>
                        </div>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={handleSubmit}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                        >
                            <Button
                                className={`h-12 w-full rounded-2xl ${
                                    !isComplete ? "pointer-events-none" : ""
                                }`}
                                disabled={!isComplete}
                                aria-disabled={!isComplete}
                            >
                                Send confirmation to WhatsApp on {fullPhone}
                            </Button>
                        </div>
                        {submitMessage && (
                            <p className="text-sm text-emerald-200/90">
                                {submitMessage}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Make sure your phone number is correct before
                            sending.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
