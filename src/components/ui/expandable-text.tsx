"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
    text: string;
    maxLines?: number;
    className?: string;
    readMoreLabel?: string;
    readLessLabel?: string;
}

export function ExpandableText({
    text,
    maxLines = 3,
    className,
    readMoreLabel = "Read more",
    readLessLabel = "Read less",
}: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Consider it "long" if it's more than ~200 chars or if we want to be safe, just let and CSS handle it if we used line-clamp.
    // But for a "Click for more details" we usually want a hard toggle.

    if (!text) return null;

    return (
        <div className={cn("space-y-2", className)}>
            <div
                className={cn(
                    "text-muted-foreground leading-relaxed transition-[max-height] duration-300",
                    !isExpanded && "line-clamp-3"
                )}
                style={{
                    display: !isExpanded ? '-webkit-box' : 'block',
                    WebkitLineClamp: !isExpanded ? maxLines : 'unset',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}
            >
                {text}
            </div>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--foreground)] hover:opacity-70 transition-opacity"
            >
                {isExpanded ? (
                    <>
                        {readLessLabel} <ChevronUp className="h-3 w-3" />
                    </>
                ) : (
                    <>
                        {readMoreLabel} <ChevronDown className="h-3 w-3" />
                    </>
                )}
            </button>
        </div>
    );
}
