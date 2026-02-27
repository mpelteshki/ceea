import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

/**
 * Renders a short markdown string inline on public pages.
 * Uses the same react-markdown stack as the newsletter article viewer.
 *
 * For short summaries use `prose-sm`; for longer descriptions use the default.
 */
export function InlineMarkdown({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  if (!children || children.trim().length === 0) return null;

  return (
    <div
      className={[
        "prose prose-sm max-w-none",
        // Consistent styling with the rest of the site
        "prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)]",
        "prose-p:leading-relaxed prose-p:text-[var(--muted-foreground)] prose-p:my-1",
        "prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:underline-offset-4",
        "prose-strong:text-[var(--foreground)]",
        "prose-ul:my-1 prose-ol:my-1 prose-li:text-[var(--muted-foreground)]",
        "prose-code:bg-[var(--accents-1)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
        "prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:text-[var(--muted-foreground)]",
        // Strip large top/bottom margins from the first/last block elements
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          img: ({ node, ...props }) => {
            const caption = props.title || (props.alt && props.alt !== "Image" ? props.alt : "");
            return (
              <span className="my-6 block overflow-hidden rounded-xl border border-border/60 shadow-md bg-[var(--accents-1)]/30 backdrop-blur-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...props}
                  alt={props.alt || "Article image"}
                  className="w-full h-auto object-cover max-h-[50vh] m-0"
                  loading="lazy"
                  decoding="async"
                />
                {caption && (
                  <span className="block border-t border-border/50 bg-[var(--background)]/80 px-3 py-2 text-center text-xs font-medium text-[var(--muted-foreground)]">
                    {caption}
                  </span>
                )}
              </span>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
