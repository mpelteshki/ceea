"use client";

import { useEffect, useRef, useState } from "react";
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
  const [expandedHeight, setExpandedHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const measure = () => {
      setExpandedHeight(contentRef.current?.scrollHeight ?? null);
    };

    measure();

    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (observer) observer.observe(contentRef.current);
    window.addEventListener("resize", measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [text]);

  if (!text) return null;

  const collapsedLines = `${maxLines * 1.625}em`;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={contentRef}
        className="overflow-hidden text-muted-foreground transition-[max-height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] leading-relaxed"
        style={{
          maxHeight: isExpanded
            ? `${expandedHeight ?? 2000}px`
            : collapsedLines,
        }}
      >
        {text}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
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
