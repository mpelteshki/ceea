import type { CSSProperties } from "react";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "da",
  "de",
  "dei",
  "del",
  "della",
  "delle",
  "dello",
  "di",
  "e",
  "for",
  "il",
  "in",
  "is",
  "i",
  "la",
  "le",
  "lo",
  "nel",
  "nella",
  "nello",
  "noi",
  "nostra",
  "nostre",
  "nostri",
  "nostro",
  "of",
  "our",
  "per",
  "the",
  "to",
  "un",
  "una",
  "us",
  "up",
]);

const DEEMPHASIZED_ADJECTIVES = new Set([
  "latest",
  "new",
  "nostra",
  "nostre",
  "nostri",
  "nostro",
  "our",
  "prossimi",
  "upcoming",
  "ultimi",
]);

function normalizeToken(token: string): string {
  return token
    .toLocaleLowerCase()
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

function pickHighlightIndex(tokens: string[]): number {
  const acronymIndex = tokens.findIndex((token) => /^[A-Z]{2,}[\W_]*$/.test(token));
  if (acronymIndex >= 0) return acronymIndex;

  const primaryIndex = tokens.findIndex((token) => {
    const normalized = normalizeToken(token);
    return normalized && !STOP_WORDS.has(normalized) && !DEEMPHASIZED_ADJECTIVES.has(normalized);
  });
  if (primaryIndex >= 0) return primaryIndex;

  const fallbackIndex = tokens.findIndex((token) => {
    const normalized = normalizeToken(token);
    return normalized && !STOP_WORDS.has(normalized);
  });
  if (fallbackIndex >= 0) return fallbackIndex;

  return tokens.length - 1;
}

type GradientTitleOptions = {
  highlightClassName?: string;
  highlightStyle?: CSSProperties;
  mode?: "single" | "full";
};

type GradientVarsInput = {
  from: string;
  to: string;
  angle?: string;
};

const BRAND_GRADIENT_CYCLE = [
  "var(--brand-teal)",
  "var(--brand-caramel)",
  "var(--brand-crimson)",
  "var(--brand-teal-soft)",
] as const;

export function gradientVars({ from, to, angle = "112deg" }: GradientVarsInput): CSSProperties {
  return {
    "--text-gradient-angle": angle,
    "--text-gradient-from": from,
    "--text-gradient-to": to,
  } as CSSProperties;
}

export function singleToneGradientVars(tone: string, angle = "180deg"): CSSProperties {
  return gradientVars({
    angle,
    from: "var(--text-gradient-start, var(--color-white))",
    to: tone,
  });
}

export function cycleBrandGradientVars(startIndex = 0, angle = "180deg"): CSSProperties {
  const len = BRAND_GRADIENT_CYCLE.length;
  const base = ((startIndex % len) + len) % len;

  return singleToneGradientVars(BRAND_GRADIENT_CYCLE[base], angle);
}

export function accentGradientVars(accent: string): CSSProperties {
  const toneIndex = BRAND_GRADIENT_CYCLE.indexOf(accent as typeof BRAND_GRADIENT_CYCLE[number]);
  if (toneIndex >= 0) return singleToneGradientVars(BRAND_GRADIENT_CYCLE[toneIndex]);

  return cycleBrandGradientVars(0);
}

export function renderGradientTitle(title: string, options: GradientTitleOptions = {}) {
  const tokens = title.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return title;

  const { highlightClassName = "text-[var(--foreground)]", highlightStyle, mode = "single" } = options;

  if (mode === "full") {
    return <span className={highlightClassName} style={highlightStyle}>{tokens.join(" ")}</span>;
  }

  const highlightIndex = pickHighlightIndex(tokens);

  return (
    <>
      {tokens.map((token, index) => (
        <span key={`${token}-${index}`}>
          {index > 0 ? " " : ""}
          {index === highlightIndex ? <span className={highlightClassName} style={highlightStyle}>{token}</span> : token}
        </span>
      ))}
    </>
  );
}
