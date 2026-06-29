import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getQuizConfiguration, gradeAnswers, validateSubmission } from '../netlify/functions/_shared/quiz.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(projectRoot, 'dist', 'index.html');
const trainingVideoPath = path.join(projectRoot, 'dist', 'assets', 'og-training.mp4');
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
  if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname === '/assets/og-training.mp4') {
    const videoStats = await stat(trainingVideoPath);
    const range = request.headers.range;
    const headers = {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    };

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = match?.[1] ? Number(match[1]) : 0;
      const end = match?.[2] ? Number(match[2]) : videoStats.size - 1;
      if (!match || start > end || end >= videoStats.size) {
        response.writeHead(416, { 'Content-Range': `bytes */${videoStats.size}` });
        return response.end();
      }
      response.writeHead(206, {
        ...headers,
        'Content-Range': `bytes ${start}-${end}/${videoStats.size}`,
        'Content-Length': end - start + 1,
      });
      if (request.method === 'HEAD') return response.end();
      return createReadStream(trainingVideoPath, { start, end }).pipe(response);
    }

    response.writeHead(200, { ...headers, 'Content-Length': videoStats.size });
    if (request.method === 'HEAD') return response.end();
    return createReadStream(trainingVideoPath).pipe(response);
  }
  response.writeHead(404);
  response.end('Not found');
}).listen(port, '127.0.0.1', () => {
  console.log(`Local preview: http://localhost:${port}`);
  console.log('Preview submissions are graded but are not written to Google Sheets or Netlify Blobs.');
});
