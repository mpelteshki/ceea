export function EventsListSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="h-32 w-full animate-pulse rounded-2xl bg-[var(--accents-1)]"
                />
            ))}
        </div>
    );
}
