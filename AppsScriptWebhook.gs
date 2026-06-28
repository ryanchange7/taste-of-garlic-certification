const WEBHOOK_SPREADSHEET_TITLE = 'TOGarlic Certification';
const WEBHOOK_RESULTS_SHEET = 'Certification Results';
const WEBHOOK_HEADERS = [
  'Submitted At', 'Submission ID', 'Restaurant #', 'Team Member', 'Manager', 'Shift',
  'Recipe Selected', 'Knowledge Score', 'Questions', 'Percent', 'Knowledge Result',
  'Photo Review', 'Final Status', 'Photo URL', 'Photo File ID', 'Attempt',
  'Time to Complete (sec)', 'User Agent',
  'Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q06', 'Q07', 'Q08', 'Q09', 'Q10', 'Q11', 'Q12',
];

function setupCertificationWebhook() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheet = null;
  const savedId = properties.getProperty('SPREADSHEET_ID');
  if (savedId) {
    try { spreadsheet = SpreadsheetApp.openById(savedId); } catch (error) {}
  }
  if (!spreadsheet) {
    const matches = DriveApp.getFilesByName(WEBHOOK_SPREADSHEET_TITLE);
    while (matches.hasNext()) {
      const file = matches.next();
      if (file.getMimeType() === MimeType.GOOGLE_SHEETS) {
        spreadsheet = SpreadsheetApp.openById(file.getId());
        break;
      }
    }
  }
  if (!spreadsheet) spreadsheet = SpreadsheetApp.create(WEBHOOK_SPREADSHEET_TITLE);

  properties.setProperty('SPREADSHEET_ID', spreadsheet.getId());
  let secret = properties.getProperty('WEBHOOK_SECRET');
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    properties.setProperty('WEBHOOK_SECRET', secret);
  }
  configureWebhookSheet_(spreadsheet);

  const result = {
    spreadsheetUrl: spreadsheet.getUrl(),
    webhookSecret: secret,
    nextStep: 'Deploy this script as a web app that executes as you, then add the /exec URL and webhook secret to Netlify.',
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

function rotateCertificationWebhookSecret() {
  const secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('WEBHOOK_SECRET', secret);
  console.log(JSON.stringify({ webhookSecret: secret }, null, 2));
  return { webhookSecret: secret };
}

function doGet() {
  return webhookJson_({ ok: true, service: 'TOGarlic Certification webhook' });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event && event.postData && event.postData.contents || '{}');
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (!expectedSecret || String(payload.secret || '') !== expectedSecret) throw new Error('Unauthorized request.');
    if (payload.action !== 'appendCertification') throw new Error('Unsupported action.');
    return webhookJson_(appendCertificationRecord_(payload.record));
  } catch (error) {
    console.error(error && error.stack || error);
    return webhookJson_({ ok: false, error: String(error && error.message || error || 'Unknown error') });
  }
}

function appendCertificationRecord_(record) {
  validateWebhookRecord_(record);
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Run setupCertificationWebhook() before accepting submissions.');
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(WEBHOOK_RESULTS_SHEET);
  if (!sheet) throw new Error('Certification Results is missing. Run setupCertificationWebhook() again.');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const attempt = countWebhookAttempts_(sheet, record.restaurantNumber, record.teamMember) + 1;
    const submittedAt = new Date(record.submittedAt);
    const total = Math.max(1, Math.round(Number(record.total) || 12));
    const score = Math.max(0, Math.min(total, Math.round(Number(record.score) || 0)));
    const passed = record.passed === true && score / total >= 0.8;
    const answers = record.answerLabels.slice(0, 12).map(function(answer) {
      return webhookSafeCellText_(answer, 300);
    });
    sheet.appendRow([
      isNaN(submittedAt.getTime()) ? new Date() : submittedAt,
      webhookSafeCellText_(record.submissionId, 50),
      webhookSafeCellText_(record.restaurantNumber, 30),
      webhookSafeCellText_(record.teamMember, 100),
      webhookSafeCellText_(record.managerName, 100),
      webhookSafeCellText_(record.shift, 30),
      webhookSafeCellText_(record.recipeSelected, 120),
      score, total, score / total, passed ? 'Pass' : 'Retake', 'Pending', '',
      webhookSafeCellText_(record.photoUrl, 1000),
      webhookSafeCellText_(record.photoKey, 150),
      attempt,
      Math.max(0, Math.round(Number(record.elapsedSeconds) || 0)),
      webhookSafeCellText_(record.userAgent, 500),
    ].concat(answers));
    const rowNumber = sheet.getLastRow();
    sheet.getRange(rowNumber, 13).setFormula(
      '=IF(K' + rowNumber + '<>"Pass","Knowledge Retake Required",IF(L' + rowNumber + '="Approved","Certified",IF(L' + rowNumber + '="Needs Retry","Photo Retry Required","Pending Photo Review")))'
    );
    sheet.getRange(rowNumber, 1).setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange(rowNumber, 10).setNumberFormat('0%');
    return { ok: true, attempt: attempt, rowNumber: rowNumber };
  } finally {
    lock.releaseLock();
  }
}

function validateWebhookRecord_(record) {
  if (!record || typeof record !== 'object') throw new Error('Certification record is missing.');
  ['submittedAt', 'submissionId', 'restaurantNumber', 'teamMember', 'managerName', 'shift', 'recipeSelected', 'photoUrl', 'photoKey']
    .forEach(function(key) {
      if (!String(record[key] || '').trim()) throw new Error(key + ' is required.');
    });
  if (!Array.isArray(record.answerLabels) || record.answerLabels.length !== 12) throw new Error('Exactly 12 answer labels are required.');
}

function countWebhookAttempts_(sheet, restaurantNumber, teamMember) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const restaurant = String(restaurantNumber).trim().toLowerCase();
  const name = String(teamMember).trim().toLowerCase();
  return sheet.getRange(2, 3, lastRow - 1, 2).getDisplayValues().reduce(function(count, row) {
    return count + (row[0].trim().toLowerCase() === restaurant && row[1].trim().toLowerCase() === name ? 1 : 0);
  }, 0);
}

function configureWebhookSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(WEBHOOK_RESULTS_SHEET);
  if (!sheet) {
    const first = spreadsheet.getSheets()[0];
    if (spreadsheet.getSheets().length === 1 && first.getLastRow() === 0) {
      first.setName(WEBHOOK_RESULTS_SHEET);
      sheet = first;
    } else {
      sheet = spreadsheet.insertSheet(WEBHOOK_RESULTS_SHEET, 0);
    }
  }
  sheet.getRange(1, 1, 1, WEBHOOK_HEADERS.length).setValues([WEBHOOK_HEADERS]);
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(true);
  sheet.getRange(1, 1, 1, WEBHOOK_HEADERS.length)
    .setBackground('#244B32').setFontColor('#FFFFFF').setFontWeight('bold').setWrap(true);
  sheet.getRange('L2:L5000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Pending', 'Approved', 'Needs Retry'], true).setAllowInvalid(false).build()
  );
  sheet.getRange('A2:A5000').setNumberFormat('yyyy-mm-dd hh:mm');
  sheet.getRange('J2:J5000').setNumberFormat('0%');
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(7, 260);
  sheet.setColumnWidth(14, 330);
}

function webhookSafeCellText_(value, maxLength) {
  const text = String(value == null ? '' : value).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function webhookJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
