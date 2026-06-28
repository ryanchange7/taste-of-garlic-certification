import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getQuizConfiguration, gradeAnswers, validateSubmission } from '../netlify/functions/_shared/quiz.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(projectRoot, 'dist', 'index.html');
const port = Number(process.env.PORT || 8899);

function sendJson(response, data, status = 200) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(data));
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === 'GET' && url.pathname === '/api/quiz') {
    return sendJson(response, getQuizConfiguration(url.searchParams.get('language')));
  }
  if (request.method === 'POST' && url.pathname === '/api/submit') {
    let body = '';
    for await (const chunk of request) {
      body += chunk;
      if (Buffer.byteLength(body) > 5_900_000) return sendJson(response, { error: 'Preview submission is too large.' }, 413);
    }
    try {
      const payload = JSON.parse(body);
      const language = validateSubmission(payload);
      const grade = gradeAnswers(payload.answers, language);
      return sendJson(response, {
        submissionId: 'GAR-LOCAL-PREVIEW', score: grade.score, total: grade.total,
        percent: grade.percent, passed: grade.passed, attempt: 1, coaching: grade.missed,
      });
    } catch (error) {
      return sendJson(response, { error: error.message }, 400);
    }
  }
  if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    const html = await readFile(indexPath);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return response.end(html);
  }
  response.writeHead(404);
  response.end('Not found');
}).listen(port, '127.0.0.1', () => {
  console.log(`Local preview: http://localhost:${port}`);
  console.log('Preview submissions are graded but are not written to Google Sheets or Netlify Blobs.');
});
