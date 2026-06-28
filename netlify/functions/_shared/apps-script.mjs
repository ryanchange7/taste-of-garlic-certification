const WEB_APP_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;

export function requireAppsScriptEnvironment(env = process.env) {
  if (!env.APPS_SCRIPT_WEBHOOK_URL) throw new Error('APPS_SCRIPT_WEBHOOK_URL is missing from the Netlify environment variables.');
  if (!WEB_APP_PATTERN.test(env.APPS_SCRIPT_WEBHOOK_URL)) throw new Error('APPS_SCRIPT_WEBHOOK_URL must be a deployed Google Apps Script /exec URL.');
  if (!env.APPS_SCRIPT_WEBHOOK_SECRET || env.APPS_SCRIPT_WEBHOOK_SECRET.length < 32) {
    throw new Error('APPS_SCRIPT_WEBHOOK_SECRET is missing or invalid in the Netlify environment variables.');
  }
}

export async function appendCertificationViaAppsScript(record, env = process.env, fetchImpl = fetch) {
  requireAppsScriptEnvironment(env);
  const response = await fetchImpl(env.APPS_SCRIPT_WEBHOOK_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'appendCertification',
      secret: env.APPS_SCRIPT_WEBHOOK_SECRET,
      record,
    }),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`Apps Script returned an invalid response (${response.status}).`);
  }
  if (!response.ok || data.ok !== true) {
    throw new Error(`Apps Script could not record the certification: ${data.error || response.status}`);
  }
  return { attempt: Math.max(1, Number(data.attempt) || 1), rowNumber: Number(data.rowNumber) || null };
}
