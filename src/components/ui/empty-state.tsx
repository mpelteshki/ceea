import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    title = "Nothing to show",
    description,
    icon: Icon = Inbox,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--accents-2)] bg-[var(--accents-1)]/50 p-12 text-center",
                className
            )}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accents-2)]">
                <Icon className="h-6 w-6 text-[var(--accents-6)]" />
            </div>
            <h3 className="mt-4 font-display text-lg text-[var(--foreground)]">
                {title}
            </h3>
            {description && (
                <p className="mt-2 max-w-sm text-sm text-[var(--accents-6)]">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
