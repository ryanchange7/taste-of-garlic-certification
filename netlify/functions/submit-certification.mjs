import { getStore } from '@netlify/blobs';
import { answerLabels, gradeAnswers, MAX_PHOTO_BYTES, validateSubmission } from './_shared/quiz.mjs';
import { appendCertificationViaAppsScript, requireAppsScriptEnvironment } from './_shared/apps-script.mjs';
import {
  cleanText, decodePhoto, extensionForMime, json, makeSubmissionId, methodNotAllowed,
  publicError, safeCellText, signPhotoKey,
} from './_shared/http.mjs';

const MAX_REQUEST_BYTES = 5_900_000;

export default async function submitCertification(request) {
  if (request.method !== 'POST') return methodNotAllowed('POST');
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_REQUEST_BYTES) return json({ error: 'The submission is too large. Choose a smaller photo.' }, 413);

  let payload;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) return json({ error: 'The submission is too large. Choose a smaller photo.' }, 413);
    payload = JSON.parse(rawBody);
  } catch (error) {
    return json({ error: 'The submission could not be read.' }, 400);
  }

  let photoKey = null;
  const photos = getStore({ name: 'certification-photos', consistency: 'strong' });
  try {
    const language = validateSubmission(payload);
    const grade = gradeAnswers(payload.answers, language);
    const photo = decodePhoto(payload.photo, MAX_PHOTO_BYTES);
    if (!process.env.PHOTO_URL_SECRET) throw new Error('PHOTO_URL_SECRET is missing from the Netlify environment variables.');
    requireAppsScriptEnvironment(process.env);
    const submittedAt = new Date();
    const submissionId = makeSubmissionId(submittedAt);
    const extension = extensionForMime(photo.mimeType);
    photoKey = `${submissionId}.${extension}`;
    const photoSignature = signPhotoKey(photoKey, process.env.PHOTO_URL_SECRET);
    const photoUrl = new URL('/review/photo', request.url);
    photoUrl.searchParams.set('key', photoKey);
    photoUrl.searchParams.set('token', photoSignature);

    await photos.set(photoKey, new Blob([photo.bytes], { type: photo.mimeType }), {
      metadata: {
        contentType: photo.mimeType,
        submittedAt: submittedAt.toISOString(),
        restaurantNumber: cleanText(payload.restaurantNumber, 30),
        teamMember: cleanText(payload.teamMember, 100),
        recipe: cleanText(payload.recipeSelected, 120),
      },
      onlyIfNew: true,
    });

    const saved = await appendCertificationViaAppsScript({
      submittedAt: submittedAt.toISOString(), submissionId,
      restaurantNumber: safeCellText(payload.restaurantNumber, 30),
      teamMember: safeCellText(payload.teamMember, 100),
      managerName: safeCellText(payload.managerName, 100),
      shift: safeCellText(payload.shift, 30),
      recipeSelected: safeCellText(payload.recipeSelected, 120),
      score: grade.score, total: grade.total, percent: grade.percent, passed: grade.passed,
      photoUrl: photoUrl.toString(), photoKey,
      elapsedSeconds: Math.max(0, Math.round(Number(payload.elapsedSeconds) || 0)),
      userAgent: safeCellText(payload.userAgent || '', 500),
      answerLabels: answerLabels(payload.answers),
    }, process.env);
    const attempt = saved.attempt;

    return json({
      submissionId, score: grade.score, total: grade.total, percent: grade.percent,
      passed: grade.passed, attempt,
      skillStatus: language === 'es'
        ? (grade.passed ? 'Pendiente de revisión de la foto por el gerente' : 'Se requiere repetir la evaluación de conocimientos')
        : (grade.passed ? 'Pending manager photo review' : 'Knowledge retake required'),
      coaching: grade.missed,
    });
  } catch (error) {
    if (photoKey) await photos.delete(photoKey).catch(() => {});
    console.error('Certification submission failed', error);
    const message = publicError(error);
    const status = /required|missing|valid|photo|question|training|obligatorio|Faltan|Selecciona|Mira|Responde|Se requiere/i.test(message) ? 400 : 500;
    return json({ error: message }, status);
  }
}

export const config = { path: '/api/submit' };
