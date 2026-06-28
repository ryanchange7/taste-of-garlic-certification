export const PASS_THRESHOLD = 0.8;
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export const RECIPE_CHOICES = Object.freeze([
  'Creamy Garlic Fettuccine with Chicken',
  'Creamy Garlic Fettuccine with Shrimp',
  'Creamy Garlic Fettuccine with Salmon',
  'Creamy Garlic Fettuccine (No Protein)',
]);

const SPANISH_RECIPE_LABELS = Object.freeze([
  'Fettuccine Cremoso con Ajo y Pollo',
  'Fettuccine Cremoso con Ajo y Camarones',
  'Fettuccine Cremoso con Ajo y Salmón',
  'Fettuccine Cremoso con Ajo (sin proteína)',
]);

export const QUESTIONS = Object.freeze([
  {
    id: 'q01', section: 'Core Build',
    prompt: 'How much Garlic Wine Sauce goes into one Creamy Garlic Fettuccine?',
    choices: ['4 fl oz', '6 fl oz', '8 fl oz', '10 fl oz'], answer: 2,
    rationale: 'Use 8 fl oz of Garlic Wine Sauce for every version of the dish.',
  },
  {
    id: 'q02', section: 'Core Build', prompt: 'What is the correct spinach portion for one order?',
    choices: ['12 leaves', '18 leaves', '24 leaves', '30 leaves'], answer: 2,
    rationale: 'The recipe calls for 24 spinach leaves.',
  },
  {
    id: 'q03', section: 'Core Build',
    prompt: 'What is the correct portion of multi-colored grape tomato mix?',
    choices: ['1 fl oz', '2 fl oz', '3 fl oz', '4 fl oz'], answer: 1,
    rationale: 'Each Creamy Garlic Fettuccine receives 2 fl oz of grape tomato mix.',
  },
  {
    id: 'q04', section: 'Protein Execution',
    prompt: 'Which finished temperature range matches the chicken CQP?',
    choices: ['145-155°F', '150-160°F', '165-175°F', '180-190°F'], answer: 2,
    rationale: 'Chicken should be golden brown, moist, and grilled to 165-175°F.',
  },
  {
    id: 'q05', section: 'Protein Execution',
    prompt: 'To what temperature should the shrimp finish cooking in the sauce?',
    choices: ['140°F', '145°F', '150°F', '165°F'], answer: 2,
    rationale: 'Shrimp finishes in the Garlic Wine Sauce and must reach 150°F.',
  },
  {
    id: 'q06', section: 'Protein Execution', prompt: 'What is the correct salmon temperature procedure?',
    choices: [
      'Grill to 130°F and serve immediately',
      'Grill to 140°F, then carry over to 150°F in the window',
      'Grill to 150°F before removing it from the grill',
      'Grill to 165°F and rest for 10 minutes',
    ], answer: 1,
    rationale: 'Cook salmon to 140°F on the grill; it carries over to 150°F in the window.',
  },
  {
    id: 'q07', section: 'CQPs & Vital Behaviors', prompt: 'When should the tomatoes and spinach be added?',
    choices: [
      'Before the sauce is heated', 'While the sauce is at a hard boil',
      'After the sauce bubbles and the heat is turned off', 'After the pasta is plated',
    ], answer: 2,
    rationale: 'Once the sauce bubbles, turn off the heat, then add tomatoes and spinach so they stay vibrant and the spinach only slightly wilts.',
  },
  {
    id: 'q08', section: 'CQPs & Vital Behaviors',
    prompt: 'Which vital behavior helps keep Garlic Wine Sauce from breaking or becoming oily?',
    choices: [
      'Let the sauce sit untouched', 'Stir the sauce consistently after adding it to the pan',
      'Add cold water after it bubbles', 'Keep the pan on high heat after adding vegetables',
    ], answer: 1,
    rationale: 'Consistent stirring after the sauce enters the pan protects the finished texture.',
  },
  {
    id: 'q09', section: 'CQPs & Vital Behaviors',
    prompt: 'Which set of actions best protects the fettuccine CQP?',
    choices: [
      'Low simmer, weigh the pasta, and rinse it',
      'Rolling boil, accurate hand portion, and drain with a sav-a-day',
      'Warm water, double portion, and hold it in sauce',
      'Rolling boil, skip draining, and plate before saucing',
    ], answer: 1,
    rationale: 'Use a rolling boil, accurately hand portion, and drain with a sav-a-day before adding pasta to the pan.',
  },
  {
    id: 'q10', section: 'CQPs & Vital Behaviors',
    prompt: 'How should chicken or shrimp be positioned for picture-perfect plating?',
    choices: [
      'Mixed beneath the pasta', 'Piled against the rim of the bowl',
      'Pushed to the back of the pan, then distributed over the center of the pasta',
      'Served on a separate plate',
    ], answer: 2,
    rationale: 'Push the protein to the back of the pan, plate the pasta, then distribute the protein evenly over the center.',
  },
  {
    id: 'q11', section: 'CQPs & Vital Behaviors', prompt: 'What finish is unique to the salmon version?',
    choices: [
      'Italian Cheese Blend and basil', 'Garlic herb butter drizzle and a lemon wedge',
      'Marinara and grated parmesan', 'Balsamic glaze and rosemary',
    ], answer: 1,
    rationale: 'Center the salmon over the pasta, drizzle with well-shaken garlic herb butter, and garnish with lemon and parsley.',
  },
  {
    id: 'q12', section: 'Prep & Food Quality',
    prompt: 'What is the shelf life of the prepared multi-colored grape tomato mix?',
    choices: ['1 day', '2 days', '3 days', '5 days'], answer: 1,
    rationale: 'The prepared grape tomato mix has a 2-day shelf life.',
  },
]);

const ES = Object.freeze({
  q01: { section: 'Preparación base', prompt: '¿Cuánta Salsa de Vino con Ajo se usa en una orden de Fettuccine Cremoso con Ajo?', choices: ['4 fl oz', '6 fl oz', '8 fl oz', '10 fl oz'], rationale: 'Usa 8 fl oz de Salsa de Vino con Ajo para cada versión del plato.' },
  q02: { section: 'Preparación base', prompt: '¿Cuál es la porción correcta de espinaca para una orden?', choices: ['12 hojas', '18 hojas', '24 hojas', '30 hojas'], rationale: 'La receta lleva 24 hojas de espinaca.' },
  q03: { section: 'Preparación base', prompt: '¿Cuál es la porción correcta de la mezcla de tomates uva multicolores?', choices: ['1 fl oz', '2 fl oz', '3 fl oz', '4 fl oz'], rationale: 'Cada Fettuccine Cremoso con Ajo lleva 2 fl oz de mezcla de tomates uva.' },
  q04: { section: 'Ejecución de proteínas', prompt: '¿Qué rango de temperatura final corresponde al CQP del pollo?', choices: ['145-155°F', '150-160°F', '165-175°F', '180-190°F'], rationale: 'El pollo debe quedar dorado, jugoso y cocinado a la parrilla hasta alcanzar 165-175°F.' },
  q05: { section: 'Ejecución de proteínas', prompt: '¿A qué temperatura deben terminar de cocinarse los camarones en la salsa?', choices: ['140°F', '145°F', '150°F', '165°F'], rationale: 'Los camarones terminan de cocinarse en la Salsa de Vino con Ajo y deben alcanzar 150°F.' },
  q06: { section: 'Ejecución de proteínas', prompt: '¿Cuál es el procedimiento correcto de temperatura para el salmón?', choices: ['Cocinar a la parrilla hasta 130°F y servir de inmediato', 'Cocinar a la parrilla hasta 140°F y dejar que llegue a 150°F por cocción residual en la ventana', 'Cocinar a la parrilla hasta 150°F antes de retirarlo', 'Cocinar a la parrilla hasta 165°F y dejar reposar 10 minutos'], rationale: 'Cocina el salmón a 140°F en la parrilla; por cocción residual llegará a 150°F en la ventana.' },
  q07: { section: 'CQPs y comportamientos esenciales', prompt: '¿Cuándo se deben agregar los tomates y la espinaca?', choices: ['Antes de calentar la salsa', 'Mientras la salsa está hirviendo fuertemente', 'Después de que la salsa burbujee y se apague el fuego', 'Después de emplatar la pasta'], rationale: 'Cuando la salsa burbujee, apaga el fuego y agrega los tomates y la espinaca para conservar su color y marchitar la espinaca solo ligeramente.' },
  q08: { section: 'CQPs y comportamientos esenciales', prompt: '¿Qué comportamiento esencial ayuda a evitar que la Salsa de Vino con Ajo se corte o quede aceitosa?', choices: ['Dejar la salsa sin revolver', 'Revolver la salsa constantemente después de agregarla al sartén', 'Agregar agua fría después de que burbujee', 'Mantener el sartén a fuego alto después de agregar las verduras'], rationale: 'Revolver constantemente después de agregar la salsa al sartén protege la textura final.' },
  q09: { section: 'CQPs y comportamientos esenciales', prompt: '¿Qué conjunto de acciones protege mejor el CQP del fettuccine?', choices: ['Hervor suave, pesar la pasta y enjuagarla', 'Hervor continuo, porción manual correcta y escurrir con un sav-a-day', 'Agua tibia, porción doble y mantenerla en la salsa', 'Hervor continuo, no escurrir y emplatar antes de agregar la salsa'], rationale: 'Usa un hervor continuo, sirve la porción manual correcta y escurre con un sav-a-day antes de agregar la pasta al sartén.' },
  q10: { section: 'CQPs y comportamientos esenciales', prompt: '¿Cómo se debe colocar el pollo o los camarones para lograr una presentación perfecta?', choices: ['Mezclados debajo de la pasta', 'Amontonados contra el borde del tazón', 'Empujados hacia el fondo del sartén y luego distribuidos sobre el centro de la pasta', 'Servidos en un plato aparte'], rationale: 'Empuja la proteína hacia el fondo del sartén, emplata la pasta y luego distribuye la proteína uniformemente sobre el centro.' },
  q11: { section: 'CQPs y comportamientos esenciales', prompt: '¿Qué acabado es exclusivo de la versión con salmón?', choices: ['Mezcla de quesos italianos y albahaca', 'Un chorrito de mantequilla de ajo y hierbas, y una rodaja de limón', 'Marinara y parmesano rallado', 'Glaseado balsámico y romero'], rationale: 'Centra el salmón sobre la pasta, rocíalo con mantequilla de ajo y hierbas bien agitada y decora con limón y perejil.' },
  q12: { section: 'Preparación y calidad de los alimentos', prompt: '¿Cuál es la vida útil de la mezcla preparada de tomates uva multicolores?', choices: ['1 día', '2 días', '3 días', '5 días'], rationale: 'La mezcla preparada de tomates uva tiene una vida útil de 2 días.' },
});

export function normalizeLanguage(language) {
  return String(language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function getQuizConfiguration(language) {
  const locale = normalizeLanguage(language);
  return {
    language: locale,
    title: locale === 'es' ? 'Certificación para cocineros de línea Taste of Garlic' : 'Taste of Garlic Line Cook Certification',
    passThreshold: PASS_THRESHOLD,
    totalQuestions: QUESTIONS.length,
    recipeChoices: RECIPE_CHOICES.slice(),
    recipeChoiceLabels: locale === 'es' ? SPANISH_RECIPE_LABELS.slice() : RECIPE_CHOICES.slice(),
    questions: QUESTIONS.map((question) => {
      const copy = locale === 'es' ? ES[question.id] : question;
      return { id: question.id, section: copy.section, prompt: copy.prompt, choices: copy.choices.slice() };
    }),
  };
}

export function gradeAnswers(answers, language) {
  const locale = normalizeLanguage(language);
  const safeAnswers = answers || {};
  let score = 0;
  const missed = [];
  QUESTIONS.forEach((question, index) => {
    if (Number(safeAnswers[question.id]) === question.answer) score += 1;
    else missed.push({ number: index + 1, rationale: locale === 'es' ? ES[question.id].rationale : question.rationale });
  });
  const percent = score / QUESTIONS.length;
  return { score, total: QUESTIONS.length, percent, passed: percent >= PASS_THRESHOLD, missed };
}

export function validateSubmission(payload) {
  const locale = normalizeLanguage(payload && payload.language);
  const es = locale === 'es';
  if (!payload || typeof payload !== 'object') throw new Error(es ? 'Faltan los datos del envío.' : 'Submission data is missing.');
  const fields = [
    ['restaurantNumber', es ? 'El número del restaurante' : 'Restaurant number'],
    ['teamMember', es ? 'El nombre del cocinero' : 'Team member name'],
    ['managerName', es ? 'El nombre del gerente' : 'Manager name'],
    ['shift', es ? 'El turno' : 'Shift'],
    ['recipeSelected', es ? 'La selección de receta' : 'Recipe selection'],
  ];
  fields.forEach(([key, label]) => {
    if (!String(payload[key] || '').trim()) throw new Error(es ? `${label} es obligatorio.` : `${label} is required.`);
  });
  if (!RECIPE_CHOICES.includes(payload.recipeSelected)) throw new Error(es ? 'Selecciona una receta válida de Taste of Garlic.' : 'Select a valid Taste of Garlic recipe.');
  if (payload.trainingConfirmed !== true) throw new Error(es ? 'Mira el video de capacitación y confirma que lo completaste antes de enviar.' : 'Watch the training video and confirm completion before submitting.');
  if (!payload.answers || typeof payload.answers !== 'object') throw new Error(es ? 'Faltan las respuestas de la evaluación.' : 'Quiz answers are missing.');
  QUESTIONS.forEach((question, index) => {
    const answer = Number(payload.answers[question.id]);
    if (!Number.isInteger(answer) || answer < 0 || answer >= question.choices.length) {
      throw new Error(es ? `Responde la pregunta ${index + 1} antes de enviar.` : `Answer question ${index + 1} before submitting.`);
    }
  });
  if (!payload.photo || !payload.photo.base64 || !payload.photo.mimeType) throw new Error(es ? 'Se requiere una foto de la receta terminada.' : 'A photo of the finished recipe is required.');
  return locale;
}

export function answerLabels(answers) {
  return QUESTIONS.map((question) => {
    const selected = Number(answers && answers[question.id]);
    return Number.isInteger(selected) && question.choices[selected]
      ? `${String.fromCharCode(65 + selected)} - ${question.choices[selected]}`
      : 'No answer';
  });
}
