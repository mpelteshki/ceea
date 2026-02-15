/**
 * Helper to get localized content from a document.
 * Supports both suffix pattern (title_it) and sub-object pattern (title.it).
 */
export function getLocalized<T extends Record<string, any>>(
    item: T,
    locale: string,
    fields: string[]
): Record<string, any> {
    const result: Record<string, any> = {};

    for (const field of fields) {
        // 1. Try sub-object pattern: item[field][locale]
        if (
            item[field] &&
            typeof item[field] === "object" &&
            item[field][locale] !== undefined
        ) {
            result[field] = item[field][locale];
        }
        // 2. Try suffix pattern: item[`${field}_${locale}`]
        else if (item[`${field}_${locale}`] !== undefined) {
            result[field] = item[`${field}_${locale}`];
        }
        // 3. Fallback to default field: item[field]
        else {
            result[field] = item[field];
        }
    }

    return result;
}
