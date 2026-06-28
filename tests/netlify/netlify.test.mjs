import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {
  answerLabels, getQuizConfiguration, gradeAnswers, QUESTIONS, validateSubmission,
} from '../../netlify/functions/_shared/quiz.mjs';
import { safeCellText, signPhotoKey, validPhotoSignature } from '../../netlify/functions/_shared/http.mjs';
import { appendCertificationViaAppsScript, requireAppsScriptEnvironment } from '../../netlify/functions/_shared/apps-script.mjs';

const perfect = {
  q01: 2, q02: 2, q03: 1, q04: 2, q05: 2, q06: 1,
  q07: 2, q08: 1, q09: 1, q10: 2, q11: 1, q12: 1,
};

const config = getQuizConfiguration('en');
assert.equal(config.questions.length, 12);
assert.equal(config.questions[0].answer, undefined);
assert.equal(JSON.stringify(config).includes('rationale'), false);
assert.equal(gradeAnswers(perfect, 'en').score, 12);
assert.equal(gradeAnswers({ ...perfect, q01: 0, q02: 0 }, 'en').passed, true);
assert.equal(gradeAnswers({ ...perfect, q01: 0, q02: 0, q03: 0 }, 'en').passed, false);
assert.match(getQuizConfiguration('es').questions[0].prompt, /Cuánta Salsa de Vino con Ajo/);
assert.match(gradeAnswers({ ...perfect, q01: 0 }, 'es').missed[0].rationale, /8 fl oz/);
assert.match(answerLabels(perfect)[0], /^C - 8 fl oz$/);
assert.equal(QUESTIONS.length, 12);

const validSubmission = {
  language: 'en', restaurantNumber: '1234', teamMember: 'Test Cook', managerName: 'Manager',
  shift: 'Dinner', recipeSelected: 'Creamy Garlic Fettuccine with Chicken', trainingConfirmed: true,
  answers: perfect, photo: { base64: 'dGVzdA==', mimeType: 'image/jpeg' },
};
assert.equal(validateSubmission(validSubmission), 'en');
assert.throws(() => validateSubmission({ ...validSubmission, trainingConfirmed: false }), /Watch the training video/);
assert.equal(safeCellText('=IMPORTXML("https://example.com")').startsWith("'="), true);

const secret = 'a-test-secret-that-is-long-enough';
const signature = signPhotoKey('GAR-TEST.jpg', secret);
assert.equal(validPhotoSignature('GAR-TEST.jpg', signature, secret), true);
assert.equal(validPhotoSignature('GAR-TAMPERED.jpg', signature, secret), false);

const env = {
  APPS_SCRIPT_WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbxTestDeployment123/exec',
  APPS_SCRIPT_WEBHOOK_SECRET: 'a-webhook-secret-that-is-long-enough-for-tests',
};
let capturedRequest = null;
const mockFetch = async (url, options) => {
  capturedRequest = { url: String(url), options };
  return new Response(JSON.stringify({ ok: true, attempt: 3, rowNumber: 17 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
requireAppsScriptEnvironment(env);
const saved = await appendCertificationViaAppsScript({ submissionId: 'GAR-TEST' }, env, mockFetch);
assert.equal(saved.attempt, 3);
assert.equal(saved.rowNumber, 17);
assert.equal(capturedRequest.url, env.APPS_SCRIPT_WEBHOOK_URL);
assert.equal(capturedRequest.options.redirect, 'follow');
assert.equal(JSON.parse(capturedRequest.options.body).secret, env.APPS_SCRIPT_WEBHOOK_SECRET);
assert.throws(() => requireAppsScriptEnvironment({ ...env, APPS_SCRIPT_WEBHOOK_URL: 'https://example.com' }), /must be a deployed/);

const html = fs.readFileSync(new URL('../../Index.html', import.meta.url), 'utf8');
assert.equal(html.includes('/api/quiz'), true);
assert.equal(html.includes('/api/submit'), true);
assert.equal(html.includes('[2,2,1,2,2,1,2,1,1,2,1,1]'), false);
const publicHtml = fs.readFileSync(new URL('../../public/index.html', import.meta.url), 'utf8');
assert.equal(publicHtml, html);
const netlifyConfig = fs.readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8');
assert.match(netlifyConfig, /publish = "public"/);
assert.equal(netlifyConfig.includes('command ='), false);

const webhookSource = fs.readFileSync(new URL('../../AppsScriptWebhook.gs', import.meta.url), 'utf8');
vm.runInNewContext(webhookSource, { console });
assert.equal(webhookSource.includes('function setupCertificationWebhook()'), true);
assert.equal(webhookSource.includes('function doPost(event)'), true);
assert.equal(webhookSource.includes('WEBHOOK_SECRET'), true);

console.log('All Netlify grading, signing, and Apps Script webhook integration tests passed.');
