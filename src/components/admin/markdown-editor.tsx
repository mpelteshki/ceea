"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  name?: string;
  /** aria-label forwarded to the textarea in write mode */
  ariaLabel?: string;
}

/**
 * Tabbed Write / Preview markdown editor for admin forms.
 * Uses the same react-markdown + remark-gfm + rehype-sanitize stack
 * already used on the public newsletter pages.
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  required,
  rows = 6,
  name,
  ariaLabel,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="rounded-lg border border-[var(--accents-2)] bg-[var(--background)] overflow-hidden">
      {/* tab bar */}
      <div className="flex border-b border-[var(--accents-2)] bg-[var(--accents-1)]/40">
        <TabButton active={tab === "write"} onClick={() => setTab("write")}>
          Write
        </TabButton>
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </TabButton>
        <div className="ml-auto flex items-center pr-3">
          <span className="text-[10px] font-mono text-[var(--muted-foreground)] select-none">
            Markdown supported
          </span>
        </div>
      </div>

      {/* write pane */}
      {tab === "write" && (
        <textarea
          name={name}
          autoComplete="off"
          spellCheck
          aria-label={ariaLabel}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          className="w-full resize-y border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        />
      )}

      {/* preview pane */}
      {tab === "preview" && (
        <div className="min-h-[calc(1.625rem*var(--rows,6)+1.5rem)] px-4 py-3" style={{ "--rows": rows } as React.CSSProperties}>
          {value.trim().length === 0 ? (
            <p className="text-sm italic text-[var(--muted-foreground)]">
              Nothing to preview yet.
            </p>
          ) : (
            <div className="prose prose-sm prose-zinc max-w-none text-left prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-relaxed prose-p:text-[var(--muted-foreground)] prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:underline-offset-4 prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:text-[var(--muted-foreground)] prose-strong:text-[var(--foreground)] prose-li:text-[var(--muted-foreground)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {value}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
        active
          ? "border-b-2 border-[var(--foreground)] text-[var(--foreground)]"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
