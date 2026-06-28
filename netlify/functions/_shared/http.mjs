import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
  });
}

export function methodNotAllowed(allowed) {
  return json({ error: 'Method not allowed.' }, 405, { Allow: allowed });
}

export function cleanText(value, maxLength = 500) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function safeCellText(value, maxLength = 500) {
  const text = cleanText(value, maxLength);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

export function makeSubmissionId(date = new Date()) {
  const day = date.toISOString().slice(0, 10).replaceAll('-', '');
  return `GAR-${day}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function extensionForMime(mimeType) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

export function decodePhoto(photo, maxBytes) {
  const mimeType = cleanText(photo && photo.mimeType, 50).toLowerCase();
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
    throw new Error('Upload a JPG, PNG, or WebP photo.');
  }
  const base64 = String(photo && photo.base64 || '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) throw new Error('The photo could not be read. Please choose it again.');
  const bytes = Buffer.from(base64, 'base64');
  if (!bytes.length || bytes.length > maxBytes) throw new Error(`The processed photo must be smaller than ${Math.floor(maxBytes / 1024 / 1024)} MB.`);
  return { bytes, mimeType };
}

export function signPhotoKey(key, secret) {
  if (!secret || secret.length < 24) throw new Error('PHOTO_URL_SECRET must contain at least 24 characters.');
  return createHmac('sha256', secret).update(key).digest('base64url');
}

export function validPhotoSignature(key, signature, secret) {
  if (!key || !signature || !secret) return false;
  const expected = Buffer.from(signPhotoKey(key, secret));
  const supplied = Buffer.from(String(signature));
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export function publicError(error, fallback = 'The request could not be completed.') {
  const message = cleanText(error && error.message, 500);
  if (/APPS_SCRIPT_WEBHOOK_URL|APPS_SCRIPT_WEBHOOK_SECRET|PHOTO_URL_SECRET|Apps Script/.test(message)) return message;
  if (/required|missing|valid|photo|question|training|obligatorio|Faltan|Selecciona|Mira|Responde|Se requiere/i.test(message)) return message;
  return fallback;
}
