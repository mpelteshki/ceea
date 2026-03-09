export function getReadableAccentText(accent: string) {
  return `color-mix(in oklch, ${accent} 42%, var(--foreground))`;
}
