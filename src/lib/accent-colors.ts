export function getReadableAccentText(accent: string) {
  return `color-mix(in oklch, ${accent} 42%, var(--foreground))`;
}

export function getAccentSurface(accent: string, amount = 12) {
  return `color-mix(in oklch, ${accent} ${amount}%, var(--background))`;
}
