import { SectionHeader } from "@/components/site/section-header";

export function EventsSkeleton() {
    return (
        <section className="relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: "var(--home-section-bg, var(--background))" }}
            />
            <div className="ui-site-container relative py-12 sm:py-16">
                <SectionHeader
                    title="Moments worth showing up for"
                    accent="var(--brand-crimson)"
                />
                <div className="mt-12 flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-24 w-full animate-pulse rounded-2xl bg-[var(--accents-1)]"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DispatchSkeleton() {
    return (
        <section className="relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: "var(--home-section-bg, var(--background))" }}
            />
            <div className="ui-site-container relative py-12 sm:py-16">
                <SectionHeader
                    title="The Latest Dispatch"
                    accent="var(--brand-caramel)"
                />
                <div className="mt-12 flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-32 w-full animate-pulse rounded-2xl bg-[var(--accents-1)]"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
