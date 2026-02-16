/**
 * Helper to get localized content from a document.
 * Supports both suffix pattern (title_it) and sub-object pattern (title.it).
 */
export function getLocalized(
  item: Record<string, unknown>,
  locale: string,
  fields: readonly string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const fieldValue = item[field];

    if (
      fieldValue &&
      typeof fieldValue === "object" &&
      locale in (fieldValue as Record<string, unknown>)
    ) {
      result[field] = (fieldValue as Record<string, unknown>)[locale];
      continue;
    }

    const suffixed = item[`${field}_${locale}`];
    if (suffixed !== undefined) {
      result[field] = suffixed;
      continue;
    }

    result[field] = fieldValue;
  }

  return result;
}
