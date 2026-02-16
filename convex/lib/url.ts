const LOCAL_HTTP_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function parseUrlOrThrow(raw: string, fieldName: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`${fieldName} must be a valid absolute URL.`);
  }

  const isHttps = parsed.protocol === "https:";
  const isLocalHttp =
    parsed.protocol === "http:" && LOCAL_HTTP_HOSTS.has(parsed.hostname);

  if (!isHttps && !isLocalHttp) {
    throw new Error(
      `${fieldName} must use https:// (http:// is only allowed for localhost).`,
    );
  }

  if (parsed.username || parsed.password) {
    throw new Error(`${fieldName} must not include credentials.`);
  }

  return parsed;
}

export function normalizeOptionalUrl(
  raw: string | undefined,
  fieldName: string,
): string | undefined {
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return parseUrlOrThrow(trimmed, fieldName).toString();
}
