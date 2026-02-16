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

export function renderGradientTitle(title: string) {
  const tokens = title.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return title;

  const highlightIndex = pickHighlightIndex(tokens);

  return (
    <>
      {tokens.map((token, index) => (
        <span key={`${token}-${index}`}>
          {index > 0 ? " " : ""}
          {index === highlightIndex ? <span className="text-gradient">{token}</span> : token}
        </span>
      ))}
    </>
  );
}
