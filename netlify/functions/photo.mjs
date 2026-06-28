import { getStore } from '@netlify/blobs';
import { validPhotoSignature } from './_shared/http.mjs';

export default async function photoReview(request) {
  if (request.method !== 'GET') return new Response('Method not allowed.', { status: 405, headers: { Allow: 'GET' } });
  const url = new URL(request.url);
  const key = url.searchParams.get('key') || '';
  const signature = url.searchParams.get('token') || '';
  if (!/^[A-Z0-9._-]{10,100}$/i.test(key) || !validPhotoSignature(key, signature, process.env.PHOTO_URL_SECRET)) {
    return new Response('Invalid or expired photo link.', { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }

  const store = getStore({ name: 'certification-photos', consistency: 'strong' });
  const entry = await store.getWithMetadata(key, { type: 'arrayBuffer', consistency: 'strong' });
  if (!entry || !entry.data) return new Response('Photo not found.', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return new Response(entry.data, {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `inline; filename="${key}"`,
      'Content-Type': entry.metadata && entry.metadata.contentType || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export const config = { path: '/review/photo' };
