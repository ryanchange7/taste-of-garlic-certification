import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../Code.gs', import.meta.url), 'utf8');
const context = vm.createContext({ console });
vm.runInContext(source, context);

const perfect = {
  q01: 2, q02: 2, q03: 1, q04: 2, q05: 2, q06: 1,
  q07: 2, q08: 1, q09: 1, q10: 2, q11: 1, q12: 1,
};

const perfectResult = context.gradeAnswers_(perfect);
assert.equal(perfectResult.score, 12);
assert.equal(perfectResult.passed, true);
assert.equal(perfectResult.missed.length, 0);

const minimumPass = { ...perfect, q01: 0, q02: 0 };
const minimumPassResult = context.gradeAnswers_(minimumPass);
assert.equal(minimumPassResult.score, 10);
assert.equal(minimumPassResult.passed, true);

const retake = { ...minimumPass, q03: 0 };
const retakeResult = context.gradeAnswers_(retake);
assert.equal(retakeResult.score, 9);
assert.equal(retakeResult.passed, false);
assert.equal(retakeResult.missed.length, 3);

assert.equal(context.getQuizConfiguration().questions[0].answer, undefined);
assert.equal(context.getQuizConfiguration().questions.length, 12);
assert.equal(context.getQuizConfiguration().recipeChoices.length, 4);
assert.equal(context.getQuizConfiguration('es').language, 'es');
assert.match(context.getQuizConfiguration('es').questions[0].prompt, /Cuánta Salsa de Vino con Ajo/);
assert.equal(context.getQuizConfiguration('es').recipeChoices[0], 'Creamy Garlic Fettuccine with Chicken');
assert.equal(context.getQuizConfiguration('es').recipeChoiceLabels[0], 'Fettuccine Cremoso con Ajo y Pollo');
assert.match(context.gradeAnswers_(retake, 'es').missed[0].rationale, /Salsa de Vino con Ajo/);
assert.equal(context.safeCellText_('=IMPORTXML("https://example.com")', 100).startsWith("'="), true);
assert.equal(context.safeCellText_('1234', 30), '1234');

const submission = {
  restaurantNumber: '1234',
  teamMember: 'Test Cook',
  managerName: 'Test Manager',
  shift: 'Dinner',
  recipeSelected: 'Creamy Garlic Fettuccine with Chicken',
  trainingConfirmed: false,
  answers: perfect,
  photo: { base64: 'dGVzdA==', mimeType: 'image/jpeg' },
};
assert.throws(() => context.validateSubmission_(submission), /Watch the training video/);
submission.trainingConfirmed = true;
assert.doesNotThrow(() => context.validateSubmission_(submission));
submission.trainingConfirmed = false;
submission.language = 'es';
assert.throws(() => context.validateSubmission_(submission), /Mira el video de capacitación/);

const html = fs.readFileSync(new URL('../Index.html', import.meta.url), 'utf8');
assert.equal(html.includes('entry_id/1_ijmd9utm/embed/dynamic?'), true);
assert.equal(html.includes('id="trainingConfirmed"'), true);
assert.equal(html.includes('id="languageSpanish"'), true);
assert.equal(html.includes('const SPANISH_UI'), true);

console.log('All grading and answer-key exposure tests passed.');
