import { getQuizConfiguration } from './_shared/quiz.mjs';
import { json, methodNotAllowed } from './_shared/http.mjs';

export default async function quizConfig(request) {
  if (request.method !== 'GET') return methodNotAllowed('GET');
  const language = new URL(request.url).searchParams.get('language');
  return json(getQuizConfiguration(language));
}

export const config = { path: '/api/quiz' };
