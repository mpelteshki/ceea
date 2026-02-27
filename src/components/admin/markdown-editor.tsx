"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useMutation, useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  name?: string;
  /** aria-label forwarded to the textarea in write mode */
  ariaLabel?: string;
  /** Custom renderer for the preview tab */
  renderPreview?: (value: string) => React.ReactNode;
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
  renderPreview,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertText = (text: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + text + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }, 0);
    } else {
      onChange(value + "\n" + text + "\n");
    }
  };

  const handleImageUpload = (url: string) => {
    handleInsertText(`![Image](${url})`);
  };

  return (
    <div className="rounded-lg border border-border/80 bg-[var(--background)] overflow-hidden">
      {/* tab bar */}
      <div className="flex flex-wrap items-center border-b border-border/80 bg-[var(--accents-1)]/40 p-1 gap-2">
        <div className="flex items-center">
          <TabButton active={tab === "write"} onClick={() => setTab("write")}>
            Write
          </TabButton>
          <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
            Preview
          </TabButton>
        </div>

        {tab === "write" && (
          <div className="ml-auto flex items-center pr-2 gap-3">
            <span className="text-[10px] font-mono text-[var(--muted-foreground)] select-none hidden sm:inline-block pr-2">
              Markdown supported
            </span>
            <ImageUploadButton onUpload={handleImageUpload} />
          </div>
        )}
      </div>

      {/* write pane */}
      {tab === "write" && (
        <textarea
          ref={textareaRef}
          name={name}
          autoComplete="off"
          spellCheck
          aria-label={ariaLabel}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          className="w-full resize-y border-0 bg-transparent px-4 py-4 text-[15px] leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]/20"
        />
      )}

      {/* preview pane */}
      {tab === "preview" && (
        <div className="min-h-[calc(1.625rem*var(--rows,6)+1.5rem)] bg-[var(--background)]" style={{ "--rows": rows } as React.CSSProperties}>
          {value.trim().length === 0 ? (
            <div className="px-4 py-4">
              <p className="text-sm italic text-[var(--muted-foreground)]">
                Nothing to preview yet.
              </p>
            </div>
          ) : renderPreview ? (
            renderPreview(value)
          ) : (
            <div className="px-5 py-8 md:px-8">
              <div className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-white/40 dark:bg-black/20 p-6 sm:p-12 md:p-16 backdrop-blur-md shadow-sm">
                <div className="prose prose-lg md:prose-xl max-w-none text-left prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:text-[1.125rem] md:prose-p:text-[1.25rem] prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--brand-tan)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--brand-teal)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:pl-6 prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:text-muted-foreground prose-strong:text-[var(--foreground)] prose-li:text-muted-foreground prose-li:text-[1.125rem] md:prose-li:text-[1.25rem]">
                  <AdminMarkdownRenderer value={value} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminMarkdownRenderer({ value }: { value: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        a: ({ node, href, children, ...props }) => {
          const url = href ?? "";
          const external = /^https?:\/\//.test(url);
          return (
            <a href={url} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} {...props}>
              {children}
            </a>
          );
        },
        img: ({ node, ...props }) => {
          const caption = props.title || (props.alt && props.alt !== "Image" ? props.alt : "");
          return (
            <span className="my-8 block overflow-hidden rounded-2xl border border-border/60 shadow-lg bg-[var(--accents-1)]/30 backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...props}
                alt={props.alt || "Article image"}
                className="w-full h-auto object-cover max-h-[70vh] m-0"
                loading="lazy"
                decoding="async"
              />
              {caption && (
                <span className="block border-t border-border/50 bg-[var(--background)]/80 px-4 py-3 text-center text-sm font-medium text-[var(--muted-foreground)]">
                  {caption}
                </span>
              )}
            </span>
          );
        }
      }}
    >
      {value}
    </ReactMarkdown>
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
        "px-4 py-2 text-sm font-medium transition-colors rounded-md",
        active
          ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm border border-border/50"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accents-2)]/50 border border-transparent",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ImageUploadButton({ onUpload }: { onUpload: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const convex = useConvex();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      const url = await convex.query(api.posts.getImageUrl, { storageId });
      if (url) {
        onUpload(url);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 rounded-md border border-border/50 bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-sm hover:bg-[var(--accents-1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload Image"
      >
        {isUploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImageIcon className="h-3.5 w-3.5 text-[var(--brand-teal)]" />
        )}
        <span>{isUploading ? "Uploading…" : "Upload Image"}</span>
      </button>
    </>
  );
}
