import { getSanityWriteClient } from "../../src/lib/sanity.server.js";
import { CATERING_EVENT_TYPES } from "../../src/lib/constants.js";
import { randomUUID } from "node:crypto";

const RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.CATERING_RATE_LIMIT_WINDOW_MS || "60000", 10);
const RATE_LIMIT_MAX_REQUESTS = Number.parseInt(process.env.CATERING_RATE_LIMIT_MAX_REQUESTS || "8", 10);

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store",
};
const JSON_HEADERS = {
  ...SECURITY_HEADERS,
  "Content-Type": "application/json; charset=utf-8",
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_EVENT_TYPES = new Set(CATERING_EVENT_TYPES);
const rateLimitStore = new Map();

function json(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...JSON_HEADERS, ...extraHeaders },
    body: JSON.stringify(payload),
  };
}

function sanitizeText(value, { max = 4000, multiline = false } = {}) {
  if (typeof value !== "string") {
    return "";
  }

  const noTags = value.replace(/<[^>]*>/g, " ");
  const controlChars = multiline ? /[\u0000-\u0009\u000b-\u001f\u007f]/g : /[\u0000-\u001f\u007f]/g;
  const noControl = noTags.replace(controlChars, " ");
  const normalizedWhitespace = multiline
    ? noControl.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n")
    : noControl.replace(/\s+/g, " ");

  return normalizedWhitespace.trim().slice(0, max);
}

function sanitizePhone(value) {
  const cleaned = sanitizeText(value, { max: 30 }).replace(/[^0-9()+.\-\s]/g, "");
  return cleaned.trim();
}

function parseBody(event) {
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";

  const contentType = (event.headers["content-type"] || event.headers["Content-Type"] || "").toLowerCase();

  if (contentType.includes("application/json")) {
    return JSON.parse(rawBody || "{}");
  }

  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
}

function toIsoDate(value) {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function getHeader(event, key) {
  const headers = event?.headers || {};
  return headers[key] || headers[key.toLowerCase()] || "";
}

function normalizeOrigin(value) {
  if (!value) return "";
  try {
    return new URL(value).origin.toLowerCase();
  } catch {
    return "";
  }
}

function getAllowedOrigins(event) {
  const configuredOrigins = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);

  if (configuredOrigins.length > 0) {
    return new Set(configuredOrigins);
  }

  const host = getHeader(event, "x-forwarded-host") || getHeader(event, "host");
  if (!host) {
    return new Set();
  }

  const forwardedProto = getHeader(event, "x-forwarded-proto");
  const origins = new Set();

  if (forwardedProto) {
    origins.add(`${forwardedProto}://${host}`.toLowerCase());
  } else {
    origins.add(`https://${host}`.toLowerCase());
    origins.add(`http://${host}`.toLowerCase());
  }

  return origins;
}

function getRequestOrigin(event) {
  const origin = normalizeOrigin(getHeader(event, "origin"));
  if (origin) {
    return origin;
  }

  const referer = getHeader(event, "referer");
  return normalizeOrigin(referer);
}

function isAllowedRequestOrigin(event) {
  const allowedOrigins = getAllowedOrigins(event);
  if (allowedOrigins.size === 0) {
    return true;
  }

  const requestOrigin = getRequestOrigin(event);
  if (!requestOrigin) {
    return false;
  }

  return allowedOrigins.has(requestOrigin);
}

function getClientKey(event) {
  const ipHeader =
    getHeader(event, "x-nf-client-connection-ip") ||
    getHeader(event, "client-ip") ||
    getHeader(event, "x-forwarded-for");

  const firstIp = String(ipHeader || "")
    .split(",")[0]
    .trim();

  return firstIp || "unknown-client";
}

function consumeRateLimit(clientKey) {
  const now = Date.now();
  const existing = rateLimitStore.get(clientKey);
  const state = existing && now < existing.resetAt
    ? existing
    : { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  state.count += 1;
  rateLimitStore.set(clientKey, state);

  // Keep memory bounded in warm runtimes.
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore) {
      if (value.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (state.count > RATE_LIMIT_MAX_REQUESTS) {
    return Math.max(1, Math.ceil((state.resetAt - now) / 1000));
  }

  return 0;
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" }, { Allow: "POST" });
  }

  if (!isAllowedRequestOrigin(event)) {
    return json(403, { ok: false, error: "Origin not allowed" });
  }

  const clientKey = getClientKey(event);
  const retryAfterSeconds = consumeRateLimit(clientKey);
  if (retryAfterSeconds > 0) {
    return json(
      429,
      { ok: false, error: "Too many requests. Please try again shortly." },
      { "Retry-After": String(retryAfterSeconds) }
    );
  }

  let body;
  try {
    body = parseBody(event);
  } catch {
    return json(400, { ok: false, error: "Invalid request body" });
  }

  // Honeypot: bots often fill hidden fields.
  const honeypot = sanitizeText(body.company || body.website || "", { max: 128 });
  if (honeypot) {
    return json(200, { ok: true });
  }

  const name = sanitizeText(body.name, { max: 120 });
  const email = sanitizeText(body.email, { max: 254 }).toLowerCase();
  const phone = sanitizePhone(body.phone);
  const eventType = sanitizeText(body.eventType, { max: 80 });
  const details = sanitizeText(body.message || body.details || "", { max: 4000, multiline: true });
  const eventDate = toIsoDate(body.eventDate || body.date || "");

  const guestCountRaw = body.guestCount ?? body.guests;
  const guestCount = guestCountRaw === "" || guestCountRaw == null ? undefined : Number.parseInt(String(guestCountRaw), 10);

  const messageParts = [`Event type: ${eventType || "Not specified"}`];
  if (details) {
    messageParts.push("", details);
  }
  const message = messageParts.join("\n");

  const errors = [];
  if (!name || name.length < 2) errors.push("name");
  if (!EMAIL_REGEX.test(email)) errors.push("email");
  if (!phone || phone.length < 7) errors.push("phone");
  if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) errors.push("eventType");
  if (eventDate === null) errors.push("eventDate");
  if (guestCount !== undefined && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10000)) errors.push("guestCount");

  if (errors.length > 0) {
    return json(400, {
      ok: false,
      error: "Validation failed",
      fields: errors,
    });
  }

  const createAsDraft = process.env.SANITY_CREATE_INQUIRIES_AS_DRAFTS === "true";
  const docId = createAsDraft ? `drafts.cateringInquiry-${randomUUID()}` : undefined;

  try {
    const created = await getSanityWriteClient().create({
      ...(docId ? { _id: docId } : {}),
      _type: "cateringInquiry",
      name,
      email,
      phone,
      eventDate: eventDate || undefined,
      eventType,
      guestCount,
      message,
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return json(201, {
      ok: true,
      id: created._id,
    });
  } catch (error) {
    console.error("Failed to create cateringInquiry document", error);
    return json(500, { ok: false, error: "Failed to store inquiry" });
  }
};
