"use client";

import { useRef, useState } from "react";
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
    const contentRef = useRef<HTMLDivElement>(null);

    if (!text) return null;

    const collapsedLines = `${maxLines * 1.625}em`;

    return (
        <div className={cn("space-y-2", className)}>
            <div
                ref={contentRef}
                className="text-muted-foreground leading-relaxed overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                    maxHeight: isExpanded
                        ? `${contentRef.current?.scrollHeight ?? 2000}px`
                        : collapsedLines,
                }}
            >
                {text}
            </div>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
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
