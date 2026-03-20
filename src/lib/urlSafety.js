const HTTPS_PROTOCOL = "https:";

function normalizeHost(host) {
  return String(host || "").trim().toLowerCase();
}

function isAllowedHost(hostname, allowedHosts = []) {
  if (!Array.isArray(allowedHosts) || allowedHosts.length === 0) {
    return true;
  }

  const normalizedHost = normalizeHost(hostname);
  return allowedHosts.some((host) => {
    const allowed = normalizeHost(host);
    return normalizedHost === allowed || normalizedHost.endsWith(`.${allowed}`);
  });
}

export function sanitizeExternalUrl(value, {
  fallback = "",
  allowRelative = false,
  allowedHosts = [],
} = {}) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) {
    return fallback;
  }

  if (allowRelative && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return fallback;
  }

  if (parsed.protocol !== HTTPS_PROTOCOL) {
    return fallback;
  }
  if (!isAllowedHost(parsed.hostname, allowedHosts)) {
    return fallback;
  }

  return parsed.toString();
}

export function sanitizeMapEmbedUrl(value) {
  return sanitizeExternalUrl(value, {
    fallback: "",
    allowedHosts: ["google.com", "googleusercontent.com", "gstatic.com"],
  });
}
