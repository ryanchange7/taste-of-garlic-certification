const APP_TITLE = 'Taste of Garlic Line Cook Certification';
const SPREADSHEET_TITLE = 'TOGarlic Certification';
const RESULTS_SHEET = 'Certification Results';
const PHOTO_FOLDER_TITLE = 'TOGarlic Certification Photos';
const PASS_THRESHOLD = 0.8;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

const RECIPE_CHOICES = Object.freeze([
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

const QUIZ_QUESTIONS = Object.freeze([
  {
    id: 'q01',
    section: 'Core Build',
    prompt: 'How much Garlic Wine Sauce goes into one Creamy Garlic Fettuccine?',
    choices: ['4 fl oz', '6 fl oz', '8 fl oz', '10 fl oz'],
    answer: 2,
    rationale: 'Use 8 fl oz of Garlic Wine Sauce for every version of the dish.',
  },
  {
    id: 'q02',
    section: 'Core Build',
    prompt: 'What is the correct spinach portion for one order?',
    choices: ['12 leaves', '18 leaves', '24 leaves', '30 leaves'],
    answer: 2,
    rationale: 'The recipe calls for 24 spinach leaves.',
  },
  {
    id: 'q03',
    section: 'Core Build',
    prompt: 'What is the correct portion of multi-colored grape tomato mix?',
    choices: ['1 fl oz', '2 fl oz', '3 fl oz', '4 fl oz'],
    answer: 1,
    rationale: 'Each Creamy Garlic Fettuccine receives 2 fl oz of grape tomato mix.',
  },
  {
    id: 'q04',
    section: 'Protein Execution',
    prompt: 'Which finished temperature range matches the chicken CQP?',
    choices: ['145-155°F', '150-160°F', '165-175°F', '180-190°F'],
    answer: 2,
    rationale: 'Chicken should be golden brown, moist, and grilled to 165-175°F.',
  },
  {
    id: 'q05',
    section: 'Protein Execution',
    prompt: 'To what temperature should the shrimp finish cooking in the sauce?',
    choices: ['140°F', '145°F', '150°F', '165°F'],
    answer: 2,
    rationale: 'Shrimp finishes in the Garlic Wine Sauce and must reach 150°F.',
  },
  {
    id: 'q06',
    section: 'Protein Execution',
    prompt: 'What is the correct salmon temperature procedure?',
    choices: [
      'Grill to 130°F and serve immediately',
      'Grill to 140°F, then carry over to 150°F in the window',
      'Grill to 150°F before removing it from the grill',
      'Grill to 165°F and rest for 10 minutes',
    ],
    answer: 1,
    rationale: 'Cook salmon to 140°F on the grill; it carries over to 150°F in the window.',
  },
  {
    id: 'q07',
    section: 'CQPs & Vital Behaviors',
    prompt: 'When should the tomatoes and spinach be added?',
    choices: [
      'Before the sauce is heated',
      'While the sauce is at a hard boil',
      'After the sauce bubbles and the heat is turned off',
      'After the pasta is plated',
    ],
    answer: 2,
    rationale: 'Once the sauce bubbles, turn off the heat, then add tomatoes and spinach so they stay vibrant and the spinach only slightly wilts.',
  },
  {
    id: 'q08',
    section: 'CQPs & Vital Behaviors',
    prompt: 'Which vital behavior helps keep Garlic Wine Sauce from breaking or becoming oily?',
    choices: [
      'Let the sauce sit untouched',
      'Stir the sauce consistently after adding it to the pan',
      'Add cold water after it bubbles',
      'Keep the pan on high heat after adding vegetables',
    ],
    answer: 1,
    rationale: 'Consistent stirring after the sauce enters the pan protects the finished texture.',
  },
  {
    id: 'q09',
    section: 'CQPs & Vital Behaviors',
    prompt: 'Which set of actions best protects the fettuccine CQP?',
    choices: [
      'Low simmer, weigh the pasta, and rinse it',
      'Rolling boil, accurate hand portion, and drain with a sav-a-day',
      'Warm water, double portion, and hold it in sauce',
      'Rolling boil, skip draining, and plate before saucing',
    ],
    answer: 1,
    rationale: 'Use a rolling boil, accurately hand portion, and drain with a sav-a-day before adding pasta to the pan.',
  },
  {
    id: 'q10',
    section: 'CQPs & Vital Behaviors',
    prompt: 'How should chicken or shrimp be positioned for picture-perfect plating?',
    choices: [
      'Mixed beneath the pasta',
      'Piled against the rim of the bowl',
      'Pushed to the back of the pan, then distributed over the center of the pasta',
      'Served on a separate plate',
    ],
    answer: 2,
    rationale: 'Push the protein to the back of the pan, plate the pasta, then distribute the protein evenly over the center.',
  },
  {
    id: 'q11',
    section: 'CQPs & Vital Behaviors',
    prompt: 'What finish is unique to the salmon version?',
    choices: [
      'Italian Cheese Blend and basil',
      'Garlic herb butter drizzle and a lemon wedge',
      'Marinara and grated parmesan',
      'Balsamic glaze and rosemary',
    ],
    answer: 1,
    rationale: 'Center the salmon over the pasta, drizzle with well-shaken garlic herb butter, and garnish with lemon and parsley.',
  },
  {
    id: 'q12',
    section: 'Prep & Food Quality',
    prompt: 'What is the shelf life of the prepared multi-colored grape tomato mix?',
    choices: ['1 day', '2 days', '3 days', '5 days'],
    answer: 1,
    rationale: 'The prepared grape tomato mix has a 2-day shelf life.',
  },
]);

const SPANISH_QUIZ_COPY = Object.freeze({
  q01: {
    section: 'Preparación base',
    prompt: '¿Cuánta Salsa de Vino con Ajo se usa en una orden de Fettuccine Cremoso con Ajo?',
    choices: ['4 fl oz', '6 fl oz', '8 fl oz', '10 fl oz'],
    rationale: 'Usa 8 fl oz de Salsa de Vino con Ajo para cada versión del plato.',
  },
  q02: {
    section: 'Preparación base',
    prompt: '¿Cuál es la porción correcta de espinaca para una orden?',
    choices: ['12 hojas', '18 hojas', '24 hojas', '30 hojas'],
    rationale: 'La receta lleva 24 hojas de espinaca.',
  },
  q03: {
    section: 'Preparación base',
    prompt: '¿Cuál es la porción correcta de la mezcla de tomates uva multicolores?',
    choices: ['1 fl oz', '2 fl oz', '3 fl oz', '4 fl oz'],
    rationale: 'Cada Fettuccine Cremoso con Ajo lleva 2 fl oz de mezcla de tomates uva.',
  },
  q04: {
    section: 'Ejecución de proteínas',
    prompt: '¿Qué rango de temperatura final corresponde al CQP del pollo?',
    choices: ['145-155°F', '150-160°F', '165-175°F', '180-190°F'],
    rationale: 'El pollo debe quedar dorado, jugoso y cocinado a la parrilla hasta alcanzar 165-175°F.',
  },
  q05: {
    section: 'Ejecución de proteínas',
    prompt: '¿A qué temperatura deben terminar de cocinarse los camarones en la salsa?',
    choices: ['140°F', '145°F', '150°F', '165°F'],
    rationale: 'Los camarones terminan de cocinarse en la Salsa de Vino con Ajo y deben alcanzar 150°F.',
  },
  q06: {
    section: 'Ejecución de proteínas',
    prompt: '¿Cuál es el procedimiento correcto de temperatura para el salmón?',
    choices: [
      'Cocinar a la parrilla hasta 130°F y servir de inmediato',
      'Cocinar a la parrilla hasta 140°F y dejar que llegue a 150°F por cocción residual en la ventana',
      'Cocinar a la parrilla hasta 150°F antes de retirarlo',
      'Cocinar a la parrilla hasta 165°F y dejar reposar 10 minutos',
    ],
    rationale: 'Cocina el salmón a 140°F en la parrilla; por cocción residual llegará a 150°F en la ventana.',
  },
  q07: {
    section: 'CQPs y comportamientos esenciales',
    prompt: '¿Cuándo se deben agregar los tomates y la espinaca?',
    choices: [
      'Antes de calentar la salsa',
      'Mientras la salsa está hirviendo fuertemente',
      'Después de que la salsa burbujee y se apague el fuego',
      'Después de emplatar la pasta',
    ],
    rationale: 'Cuando la salsa burbujee, apaga el fuego y agrega los tomates y la espinaca para conservar su color y marchitar la espinaca solo ligeramente.',
  },
  q08: {
    section: 'CQPs y comportamientos esenciales',
    prompt: '¿Qué comportamiento esencial ayuda a evitar que la Salsa de Vino con Ajo se corte o quede aceitosa?',
    choices: [
      'Dejar la salsa sin revolver',
      'Revolver la salsa constantemente después de agregarla al sartén',
      'Agregar agua fría después de que burbujee',
      'Mantener el sartén a fuego alto después de agregar las verduras',
    ],
    rationale: 'Revolver constantemente después de agregar la salsa al sartén protege la textura final.',
  },
  q09: {
    section: 'CQPs y comportamientos esenciales',
    prompt: '¿Qué conjunto de acciones protege mejor el CQP del fettuccine?',
    choices: [
      'Hervor suave, pesar la pasta y enjuagarla',
      'Hervor continuo, porción manual correcta y escurrir con un sav-a-day',
      'Agua tibia, porción doble y mantenerla en la salsa',
      'Hervor continuo, no escurrir y emplatar antes de agregar la salsa',
    ],
    rationale: 'Usa un hervor continuo, sirve la porción manual correcta y escurre con un sav-a-day antes de agregar la pasta al sartén.',
  },
  q10: {
    section: 'CQPs y comportamientos esenciales',
    prompt: '¿Cómo se debe colocar el pollo o los camarones para lograr una presentación perfecta?',
    choices: [
      'Mezclados debajo de la pasta',
      'Amontonados contra el borde del tazón',
      'Empujados hacia el fondo del sartén y luego distribuidos sobre el centro de la pasta',
      'Servidos en un plato aparte',
    ],
    rationale: 'Empuja la proteína hacia el fondo del sartén, emplata la pasta y luego distribuye la proteína uniformemente sobre el centro.',
  },
  q11: {
    section: 'CQPs y comportamientos esenciales',
    prompt: '¿Qué acabado es exclusivo de la versión con salmón?',
    choices: [
      'Mezcla de quesos italianos y albahaca',
      'Un chorrito de mantequilla de ajo y hierbas, y una rodaja de limón',
      'Marinara y parmesano rallado',
      'Glaseado balsámico y romero',
    ],
    rationale: 'Centra el salmón sobre la pasta, rocíalo con mantequilla de ajo y hierbas bien agitada y decora con limón y perejil.',
  },
  q12: {
    section: 'Preparación y calidad de los alimentos',
    prompt: '¿Cuál es la vida útil de la mezcla preparada de tomates uva multicolores?',
    choices: ['1 día', '2 días', '3 días', '5 días'],
    rationale: 'La mezcla preparada de tomates uva tiene una vida útil de 2 días.',
  },
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle(APP_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

function getQuizConfiguration(language) {
  const locale = normalizeLanguage_(language);
  return {
    language: locale,
    title: locale === 'es' ? 'Certificación para cocineros de línea Taste of Garlic' : APP_TITLE,
    passThreshold: PASS_THRESHOLD,
    totalQuestions: QUIZ_QUESTIONS.length,
    recipeChoices: RECIPE_CHOICES.slice(),
    recipeChoiceLabels: locale === 'es' ? SPANISH_RECIPE_LABELS.slice() : RECIPE_CHOICES.slice(),
    questions: QUIZ_QUESTIONS.map(function(question) {
      const localized = locale === 'es' ? SPANISH_QUIZ_COPY[question.id] : question;
      return {
        id: question.id,
        section: localized.section,
        prompt: localized.prompt,
        choices: localized.choices.slice(),
      };
    }),
  };
}

function submitCertification(payload) {
  validateSubmission_(payload);

  const language = normalizeLanguage_(payload.language);
  const grade = gradeAnswers_(payload.answers, language);
  const spreadsheet = getCertificationSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(RESULTS_SHEET);
  if (!sheet) {
    throw new Error('Certification Results sheet is missing. Run setupCertification() again.');
  }

  const photo = savePhoto_(payload.photo, payload);
  const submittedAt = new Date();
  const submissionId = `GAR-${Utilities.formatDate(submittedAt, Session.getScriptTimeZone(), 'yyyyMMdd')}-${Utilities.getUuid().slice(0, 8).toUpperCase()}`;
  const knowledgeResult = grade.passed ? 'Pass' : 'Retake';

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  let rowNumber;
  let attempt;
  try {
    attempt = countPriorAttempts_(sheet, payload.restaurantNumber, payload.teamMember) + 1;
    const answerCells = QUIZ_QUESTIONS.map(function(question) {
      const selected = Number(payload.answers[question.id]);
      const label = Number.isInteger(selected) && question.choices[selected]
        ? `${String.fromCharCode(65 + selected)} - ${question.choices[selected]}`
        : 'No answer';
      return label;
    });

    sheet.appendRow([
      submittedAt,
      submissionId,
      safeCellText_(payload.restaurantNumber, 30),
      safeCellText_(payload.teamMember, 100),
      safeCellText_(payload.managerName, 100),
      safeCellText_(payload.shift, 30),
      safeCellText_(payload.recipeSelected, 120),
      grade.score,
      grade.total,
      grade.percent,
      knowledgeResult,
      'Pending',
      '',
      photo.url,
      photo.id,
      attempt,
      Math.max(0, Math.round(Number(payload.elapsedSeconds) || 0)),
      safeCellText_(payload.userAgent || '', 500),
    ].concat(answerCells));
    rowNumber = sheet.getLastRow();
    sheet.getRange(rowNumber, 13).setFormula(
      `=IF(K${rowNumber}<>"Pass","Knowledge Retake Required",IF(L${rowNumber}="Approved","Certified",IF(L${rowNumber}="Needs Retry","Photo Retry Required","Pending Photo Review")))`
    );
    sheet.getRange(rowNumber, 1).setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange(rowNumber, 10).setNumberFormat('0%');
  } finally {
    lock.releaseLock();
  }

  return {
    submissionId: submissionId,
    score: grade.score,
    total: grade.total,
    percent: grade.percent,
    passed: grade.passed,
    attempt: attempt,
    skillStatus: language === 'es'
      ? (grade.passed ? 'Pendiente de revisión de la foto por el gerente' : 'Se requiere repetir la evaluación de conocimientos')
      : (grade.passed ? 'Pending manager photo review' : 'Knowledge retake required'),
    coaching: grade.missed.map(function(item) {
      return { number: item.number, rationale: item.rationale };
    }),
  };
}

function setupCertification() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheet = null;
  const savedId = properties.getProperty('SPREADSHEET_ID');

  if (savedId) {
    try {
      spreadsheet = SpreadsheetApp.openById(savedId);
    } catch (error) {
      properties.deleteProperty('SPREADSHEET_ID');
    }
  }

  if (!spreadsheet) {
    const matchingFiles = DriveApp.getFilesByName(SPREADSHEET_TITLE);
    while (matchingFiles.hasNext()) {
      const candidate = matchingFiles.next();
      if (candidate.getMimeType() === MimeType.GOOGLE_SHEETS) {
        spreadsheet = SpreadsheetApp.openById(candidate.getId());
        break;
      }
    }
  }

  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.create(SPREADSHEET_TITLE);
  }

  properties.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  configureWorkbook_(spreadsheet);
  const photoFolder = getPhotoFolder_();
  writeSetupLinks_(spreadsheet, photoFolder);

  const result = {
    spreadsheetUrl: spreadsheet.getUrl(),
    photoFolderUrl: photoFolder.getUrl(),
    message: 'Setup complete. Deploy this project as a web app.',
  };
  console.log(JSON.stringify(result));
  return result;
}

function setCertificationSpreadsheet(spreadsheetId) {
  const spreadsheet = SpreadsheetApp.openById(cleanText_(spreadsheetId, 100));
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheet.getId());
  configureWorkbook_(spreadsheet);
  writeSetupLinks_(spreadsheet, getPhotoFolder_());
  return { spreadsheetUrl: spreadsheet.getUrl() };
}

function sharePhotoFolderWithReviewers(commaSeparatedEmails) {
  const emails = String(commaSeparatedEmails || '')
    .split(',')
    .map(function(email) { return email.trim().toLowerCase(); })
    .filter(function(email) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email); });
  if (!emails.length) {
    throw new Error('Enter at least one valid reviewer email address.');
  }
  const folder = getPhotoFolder_();
  emails.forEach(function(email) { folder.addViewer(email); });
  return { photoFolderUrl: folder.getUrl(), reviewersAdded: emails.length };
}

function gradeAnswers_(answers, language) {
  const safeAnswers = answers || {};
  const locale = normalizeLanguage_(language);
  let score = 0;
  const missed = [];
  QUIZ_QUESTIONS.forEach(function(question, index) {
    if (Number(safeAnswers[question.id]) === question.answer) {
      score += 1;
    } else {
      const rationale = locale === 'es' ? SPANISH_QUIZ_COPY[question.id].rationale : question.rationale;
      missed.push({ number: index + 1, rationale: rationale });
    }
  });
  const percent = score / QUIZ_QUESTIONS.length;
  return {
    score: score,
    total: QUIZ_QUESTIONS.length,
    percent: percent,
    passed: percent >= PASS_THRESHOLD,
    missed: missed,
  };
}

function validateSubmission_(payload) {
  const locale = normalizeLanguage_(payload && payload.language);
  const isSpanish = locale === 'es';
  if (!payload || typeof payload !== 'object') {
    throw new Error(isSpanish ? 'Faltan los datos del envío.' : 'Submission data is missing.');
  }
  const requiredText = [
    ['restaurantNumber', isSpanish ? 'El número del restaurante' : 'Restaurant number'],
    ['teamMember', isSpanish ? 'El nombre del cocinero' : 'Team member name'],
    ['managerName', isSpanish ? 'El nombre del gerente' : 'Manager name'],
    ['shift', isSpanish ? 'El turno' : 'Shift'],
    ['recipeSelected', isSpanish ? 'La selección de receta' : 'Recipe selection'],
  ];
  requiredText.forEach(function(field) {
    if (!String(payload[field[0]] || '').trim()) {
      throw new Error(isSpanish ? `${field[1]} es obligatorio.` : `${field[1]} is required.`);
    }
  });
  if (RECIPE_CHOICES.indexOf(payload.recipeSelected) === -1) {
    throw new Error(isSpanish ? 'Selecciona una receta válida de Taste of Garlic.' : 'Select a valid Taste of Garlic recipe.');
  }
  if (!payload.answers || typeof payload.answers !== 'object') {
    throw new Error(isSpanish ? 'Faltan las respuestas de la evaluación.' : 'Quiz answers are missing.');
  }
  if (payload.trainingConfirmed !== true) {
    throw new Error(isSpanish
      ? 'Mira el video de capacitación y confirma que lo completaste antes de enviar.'
      : 'Watch the training video and confirm completion before submitting.');
  }
  QUIZ_QUESTIONS.forEach(function(question, index) {
    const answer = Number(payload.answers[question.id]);
    if (!Number.isInteger(answer) || answer < 0 || answer >= question.choices.length) {
      throw new Error(isSpanish
        ? `Responde la pregunta ${index + 1} antes de enviar.`
        : `Answer question ${index + 1} before submitting.`);
    }
  });
  if (!payload.photo || !payload.photo.base64 || !payload.photo.mimeType) {
    throw new Error(isSpanish ? 'Se requiere una foto de la receta terminada.' : 'A photo of the finished recipe is required.');
  }
}

function savePhoto_(photoPayload, payload) {
  const isSpanish = normalizeLanguage_(payload && payload.language) === 'es';
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const mimeType = String(photoPayload.mimeType || '').toLowerCase();
  if (allowedTypes.indexOf(mimeType) === -1) {
    throw new Error(isSpanish ? 'Sube una foto JPG, PNG o WebP.' : 'Upload a JPG, PNG, or WebP photo.');
  }

  let decoded;
  try {
    decoded = Utilities.base64Decode(String(photoPayload.base64));
  } catch (error) {
    throw new Error(isSpanish ? 'No se pudo leer la foto. Selecciónala de nuevo.' : 'The photo could not be read. Please choose it again.');
  }
  if (!decoded.length || decoded.length > MAX_PHOTO_BYTES) {
    throw new Error(isSpanish ? 'La foto procesada debe ser menor de 8 MB.' : 'The processed photo must be smaller than 8 MB.');
  }

  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  const baseName = [payload.restaurantNumber, payload.teamMember, payload.recipeSelected, timestamp]
    .map(function(value) { return cleanFilePart_(value); })
    .join('_')
    .slice(0, 180);
  const blob = Utilities.newBlob(decoded, mimeType, `${baseName}.${extension}`);
  const file = getPhotoFolder_().createFile(blob);
  file.setDescription(`Taste of Garlic certification photo for ${cleanText_(payload.teamMember, 100)} at restaurant ${cleanText_(payload.restaurantNumber, 30)}.`);
  return { id: file.getId(), url: file.getUrl() };
}

function getCertificationSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) {
    throw new Error('Certification is not configured. Run setupCertification() once before deploying.');
  }
  return SpreadsheetApp.openById(id);
}

function getPhotoFolder_() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty('PHOTO_FOLDER_ID');
  if (savedId) {
    try {
      return DriveApp.getFolderById(savedId);
    } catch (error) {
      properties.deleteProperty('PHOTO_FOLDER_ID');
    }
  }
  const folders = DriveApp.getFoldersByName(PHOTO_FOLDER_TITLE);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PHOTO_FOLDER_TITLE);
  properties.setProperty('PHOTO_FOLDER_ID', folder.getId());
  return folder;
}

function countPriorAttempts_(sheet, restaurantNumber, teamMember) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const targetRestaurant = String(restaurantNumber).trim().toLowerCase();
  const targetName = String(teamMember).trim().toLowerCase();
  return sheet.getRange(2, 3, lastRow - 1, 2).getDisplayValues().reduce(function(count, row) {
    return count + (row[0].trim().toLowerCase() === targetRestaurant && row[1].trim().toLowerCase() === targetName ? 1 : 0);
  }, 0);
}

function configureWorkbook_(spreadsheet) {
  let results = spreadsheet.getSheetByName(RESULTS_SHEET);
  if (!results) {
    const firstSheet = spreadsheet.getSheets()[0];
    if (spreadsheet.getSheets().length === 1 && firstSheet.getLastRow() === 0) {
      firstSheet.setName(RESULTS_SHEET);
      results = firstSheet;
    } else {
      results = spreadsheet.insertSheet(RESULTS_SHEET, 0);
    }
  }

  const headers = [
    'Submitted At', 'Submission ID', 'Restaurant #', 'Team Member', 'Manager', 'Shift',
    'Recipe Selected', 'Knowledge Score', 'Questions', 'Percent', 'Knowledge Result',
    'Photo Review', 'Final Status', 'Photo URL', 'Photo File ID', 'Attempt',
    'Time to Complete (sec)', 'User Agent',
  ].concat(QUIZ_QUESTIONS.map(function(question) { return question.id.toUpperCase(); }));

  results.getRange(1, 1, 1, headers.length).setValues([headers]);
  results.setFrozenRows(1);
  results.setHiddenGridlines(true);
  results.getRange(1, 1, 1, headers.length)
    .setBackground('#E5E7EB')
    .setFontColor('#111827')
    .setFontWeight('bold')
    .setWrap(true)
    .setVerticalAlignment('middle');
  results.setRowHeight(1, 42);
  results.getRange('A2:A5000').setNumberFormat('yyyy-mm-dd hh:mm');
  results.getRange('J2:J5000').setNumberFormat('0%');
  results.getRange('L2:L5000').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Pending', 'Approved', 'Needs Retry'], true)
      .setAllowInvalid(false)
      .build()
  );
  const widths = [145, 155, 90, 145, 145, 90, 250, 90, 80, 80, 105, 105, 175, 260, 155, 70, 125, 260];
  widths.forEach(function(width, index) { results.setColumnWidth(index + 1, width); });
  for (let column = 19; column <= 30; column += 1) results.setColumnWidth(column, 58);

  if (!results.getFilter()) {
    results.getRange(1, 1, 5000, headers.length).createFilter();
  }
  const currentRules = results.getConditionalFormatRules().filter(function(rule) {
    return rule.getRanges().every(function(range) {
      return range.getA1Notation() !== 'K2:M5000';
    });
  });
  const statusRange = results.getRange('K2:M5000');
  currentRules.push(
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Certified').setBackground('#DCFCE7').setFontColor('#166534').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Approved').setBackground('#DCFCE7').setFontColor('#166534').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Pending').setBackground('#FEF3C7').setFontColor('#92400E').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Required').setBackground('#FEE2E2').setFontColor('#991B1B').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Needs Retry').setBackground('#FEE2E2').setFontColor('#991B1B').setRanges([statusRange]).build()
  );
  results.setConditionalFormatRules(currentRules);

  configureDashboard_(spreadsheet);
  configureReadMe_(spreadsheet);
}

function configureDashboard_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Dashboard');
  if (!sheet) sheet = spreadsheet.insertSheet('Dashboard');
  sheet.clear();
  sheet.setHiddenGridlines(true);
  sheet.getRange('A1:H1').merge().setValue('TOGarlic Certification Dashboard')
    .setBackground('#2F5D3A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(18);
  sheet.setRowHeight(1, 46);
  sheet.getRange('A3:B3').setValues([['Total submissions', 'Knowledge pass rate']]);
  sheet.getRange('D3:E3').setValues([['Certified', 'Pending photo review']]);
  sheet.getRange('G3:H3').setValues([['Knowledge retakes', 'Photo retries']]);
  sheet.getRange('A4').setFormula(`=COUNTA('${RESULTS_SHEET}'!$B$2:$B$5000)`);
  sheet.getRange('B4').setFormula(`=IFERROR(COUNTIF('${RESULTS_SHEET}'!$K$2:$K$5000,"Pass")/COUNTA('${RESULTS_SHEET}'!$B$2:$B$5000),0)`).setNumberFormat('0%');
  sheet.getRange('D4').setFormula(`=COUNTIF('${RESULTS_SHEET}'!$M$2:$M$5000,"Certified")`);
  sheet.getRange('E4').setFormula(`=COUNTIF('${RESULTS_SHEET}'!$M$2:$M$5000,"Pending Photo Review")`);
  sheet.getRange('G4').setFormula(`=COUNTIF('${RESULTS_SHEET}'!$M$2:$M$5000,"Knowledge Retake Required")`);
  sheet.getRange('H4').setFormula(`=COUNTIF('${RESULTS_SHEET}'!$M$2:$M$5000,"Photo Retry Required")`);
  ['A3:B3', 'D3:E3', 'G3:H3'].forEach(function(range) {
    sheet.getRange(range).setBackground('#F3F4F6').setFontWeight('bold').setWrap(true);
  });
  ['A4:B4', 'D4:E4', 'G4:H4'].forEach(function(range) {
    sheet.getRange(range).setFontWeight('bold').setFontSize(18);
  });
  sheet.getRange('A7:C7').setValues([['Recipe', 'Submissions', 'Knowledge pass rate']])
    .setBackground('#E5E7EB').setFontWeight('bold');
  sheet.getRange('A8:A11').setValues(RECIPE_CHOICES.map(function(recipe) { return [recipe]; }));
  for (let row = 8; row <= 11; row += 1) {
    sheet.getRange(row, 2).setFormula(`=COUNTIF('${RESULTS_SHEET}'!$G$2:$G$5000,A${row})`);
    sheet.getRange(row, 3).setFormula(`=IFERROR(COUNTIFS('${RESULTS_SHEET}'!$G$2:$G$5000,A${row},'${RESULTS_SHEET}'!$K$2:$K$5000,"Pass")/B${row},0)`).setNumberFormat('0%');
  }
  sheet.setColumnWidth(1, 300);
  for (let column = 2; column <= 8; column += 1) sheet.setColumnWidth(column, 145);
  sheet.setFrozenRows(1);
}

function configureReadMe_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName('Read Me');
  if (!sheet) sheet = spreadsheet.insertSheet('Read Me');
  sheet.clear();
  sheet.setHiddenGridlines(true);
  sheet.getRange('A1:F1').merge().setValue('TOGarlic Certification - Manager Guide')
    .setBackground('#2F5D3A').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(18);
  sheet.setRowHeight(1, 46);
  const rows = [
    ['Purpose', 'Validate line-cook knowledge and execution of the Season of Garlic recipes.'],
    ['Knowledge standard', 'A passing score is 80% or higher. With 12 questions, 10 correct answers are required.'],
    ['Skill evidence', "Every submission requires one photo of the cook's selected Creamy Garlic Fettuccine recipe."],
    ['Manager action', 'Open the Photo URL, compare the dish to CQPs, then set Photo Review to Approved or Needs Retry.'],
    ['Final status', 'Certified requires both a passing knowledge score and an Approved photo review.'],
    ['Important', 'Do not rename the Certification Results tab; the quiz writes to that exact tab name.'],
  ];
  rows.forEach(function(row, index) {
    const targetRow = index + 3;
    sheet.getRange(targetRow, 1).setValue(row[0]).setBackground('#F3F4F6').setFontWeight('bold');
    sheet.getRange(targetRow, 2, 1, 5).merge().setValue(row[1]).setWrap(true);
    sheet.setRowHeight(targetRow, 48);
  });
  sheet.setColumnWidth(1, 150);
  for (let column = 2; column <= 6; column += 1) sheet.setColumnWidth(column, 145);
}

function writeSetupLinks_(spreadsheet, photoFolder) {
  const sheet = spreadsheet.getSheetByName('Read Me');
  sheet.getRange('A10').setValue('Spreadsheet URL').setBackground('#F3F4F6').setFontWeight('bold');
  sheet.getRange('B10:F10').merge().setValue(spreadsheet.getUrl());
  sheet.getRange('A11').setValue('Photo folder URL').setBackground('#F3F4F6').setFontWeight('bold');
  sheet.getRange('B11:F11').merge().setValue(photoFolder.getUrl());
}

function cleanText_(value, maxLength) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

function safeCellText_(value, maxLength) {
  const text = cleanText_(value, maxLength);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function cleanFilePart_(value) {
  return cleanText_(value, 80).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}

function normalizeLanguage_(language) {
  return String(language || '').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
}
