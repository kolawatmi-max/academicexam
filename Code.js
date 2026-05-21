const CONFIG = {
  SPREADSHEET_ID: '1LltzENxvP2RZBQWma1ol48KUB0barq1PHYoWw52AaoE',
  MASTER_COURSE_SHEET: 'รายวิชาที่จัดสอบ',
  MASTER_PERSONNEL_SHEET: 'ชื่อบุคลากร',
  REQUEST_SHEET: 'ExamRequests',
  REQUEST_HEADERS: [
    'requestId',
    'createdAt',
    'updatedAt',
    'courseCode',
    'term',
    'examType',
    'courseCategory',
    'sectionType',
    'productionMethod',
    'examArrangement',
    'submittedDate',
    'contactPhone',
    'senderName',
    'senderEmail',
    'ccEmail',
    'mcqPersonnelName',
    'requestStatus',
    'receivedBy',
    'envelopeCount',
    'receivedAt',
    'mcqType',
    'sheetCount',
    'sheetCountA',
    'sheetCountB',
    'questionCount',
    'scoreCount',
    'hasFreeQuestion',
    'freeQuestionCount',
    'examFormat',
    'mcqSubmittedAt',
    'mcqStatus',
    'mcqCheckedAt'
  ],
  TERM_OPTIONS: ['ภาค 2/2568', 'ภาค S/2568'],
  EXAM_TYPE_OPTIONS: ['สอบปลายภาค', 'สอบชดเชย', 'สอบแก้ตัว'],
  COURSE_CATEGORY_OPTIONS: ['รายวิชาในแผน', 'รายวิชานอกแผน'],
  SECTION_TYPE_OPTIONS: ['ปกติ', 'เสาร์-อาทิตย์'],
  PRODUCTION_METHOD_OPTIONS: ['ผลิตเอง', 'วิชาการผลิต'],
  EXAM_ARRANGEMENT_OPTIONS: ['จัดสอบเอง', 'วิชาการจัดสอบ'],
  MCQ_TYPE_OPTIONS: ['ปกติ', 'ชุด A และชุด B'],
  EXAM_FORMAT_OPTIONS: ['ในตาราง', 'นอกตาราง'],
  EMAIL_DOMAIN: '@spu.ac.th'
};

function doGet(e) {
  ensureSetup_();

  const action = e && e.parameter && e.parameter.action;
  const callback = e && e.parameter && e.parameter.callback;
  if (action) {
    try {
      const payload = e.parameter.payload ? JSON.parse(e.parameter.payload) : undefined;
      const data = runApiActionWithLock_(action, payload);
      const response = { ok: true, data: data };
      if (callback) {
        return ContentService
          .createTextOutput(callback + '(' + JSON.stringify(response) + ')')
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return jsonResponse_(response);
    } catch (error) {
      const response = { ok: false, error: error.message || 'Unknown error' };
      if (callback) {
        return ContentService
          .createTextOutput(callback + '(' + JSON.stringify(response) + ')')
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return jsonResponse_(response);
    }
  }

  return jsonResponse_({ ok: true, data: getInitialData() });
}

function doPost(e) {
  try {
    ensureSetup_();
    const body = e && e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};
    const data = runApiActionWithLock_(body.action || '', body.payload);
    return jsonResponse_({
      ok: true,
      data: data
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error.message || 'Unknown error'
    });
  }
}

function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function handleOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getInitialData() {
  ensureSetup_();
  const diagnostics = [];
  let personnel = [];
  let courses = [];
  let requests = [];

  try {
    personnel = getPersonnel_();
  } catch (error) {
    diagnostics.push('personnel: ' + error.message);
  }

  try {
    courses = getCourses_();
  } catch (error) {
    diagnostics.push('courses: ' + error.message);
  }

  try {
    requests = getRequests_();
  } catch (error) {
    diagnostics.push('requests: ' + error.message);
  }

  return {
    config: {
      termOptions: CONFIG.TERM_OPTIONS,
      examTypeOptions: CONFIG.EXAM_TYPE_OPTIONS,
      courseCategoryOptions: CONFIG.COURSE_CATEGORY_OPTIONS,
      sectionTypeOptions: CONFIG.SECTION_TYPE_OPTIONS,
      productionMethodOptions: CONFIG.PRODUCTION_METHOD_OPTIONS,
      examArrangementOptions: CONFIG.EXAM_ARRANGEMENT_OPTIONS,
      mcqTypeOptions: CONFIG.MCQ_TYPE_OPTIONS,
      examFormatOptions: CONFIG.EXAM_FORMAT_OPTIONS,
      emailDomain: CONFIG.EMAIL_DOMAIN
    },
    personnel: personnel,
    courses: courses,
    requests: requests,
    diagnostics: diagnostics,
    sheetDiagnostics: getSheetDiagnostics_()
  };
}

function submitExamRequest(payload) {
  ensureSetup_();
  validateRequired_(
    payload,
    ['courseCode', 'term', 'examType', 'courseCategory', 'sectionType', 'productionMethod', 'examArrangement', 'submittedDate', 'contactPhone', 'senderName']
  );

  const now = new Date();
  const request = {
    requestId: Utilities.getUuid(),
    createdAt: now,
    updatedAt: now,
    courseCode: payload.courseCode,
    term: payload.term,
    examType: payload.examType,
    courseCategory: payload.courseCategory,
    sectionType: payload.sectionType,
    productionMethod: payload.productionMethod,
    examArrangement: payload.examArrangement,
    submittedDate: payload.submittedDate,
    contactPhone: payload.contactPhone,
    senderName: payload.senderName,
    senderEmail: '',
    ccEmail: '',
    mcqPersonnelName: '',
    requestStatus: 'ส่งข้อสอบแล้ว',
    receivedBy: '',
    envelopeCount: '',
    receivedAt: '',
    mcqType: '',
    sheetCount: '',
    sheetCountA: '',
    sheetCountB: '',
    questionCount: '',
    scoreCount: '',
    hasFreeQuestion: false,
    freeQuestionCount: '',
    examFormat: '',
    mcqSubmittedAt: '',
    mcqStatus: 'ยังไม่ส่งตรวจข้อสอบปรนัย',
    mcqCheckedAt: ''
  };

  appendRow_(CONFIG.REQUEST_SHEET, objectToRow_(request));
  return getInitialData();
}

function updateExamRequest(payload) {
  ensureSetup_();
  validateRequired_(payload, ['requestId']);
  const rowData = findRequestRow_(payload.requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการแก้ไข');
  }

  // Optimistic lock: reject if the row was modified since the client last read it
  if (payload.expectedUpdatedAt) {
    const serverUpdatedAt = formatDateTime_(rowData.record.updatedAt);
    if (serverUpdatedAt && serverUpdatedAt !== payload.expectedUpdatedAt) {
      throw new Error('ข้อมูลถูกแก้ไขโดยผู้ใช้งานอื่นก่อนหน้า กรุณารีเฟรชแล้วลองใหม่');
    }
  }

  const request = rowData.record;
  const protectedFields = {
    requestId: request.requestId,
    createdAt: request.createdAt,
    requestStatus: request.requestStatus,
    receivedBy: request.receivedBy,
    envelopeCount: request.envelopeCount,
    receivedAt: request.receivedAt,
    senderEmail: request.senderEmail,
    mcqPersonnelName: request.mcqPersonnelName,
    mcqType: request.mcqType,
    sheetCount: request.sheetCount,
    sheetCountA: request.sheetCountA,
    sheetCountB: request.sheetCountB,
    questionCount: request.questionCount,
    scoreCount: request.scoreCount,
    hasFreeQuestion: request.hasFreeQuestion,
    freeQuestionCount: request.freeQuestionCount,
    examFormat: request.examFormat,
    mcqSubmittedAt: request.mcqSubmittedAt,
    mcqStatus: request.mcqStatus,
    mcqCheckedAt: request.mcqCheckedAt
  };

  const updated = Object.assign({}, request, payload, protectedFields, {
    updatedAt: new Date()
  });

  setRowValues_(CONFIG.REQUEST_SHEET, rowData.rowIndex, objectToRow_(updated));
  return getInitialData();
}

function deleteExamRequest(requestId) {
  ensureSetup_();
  const rowData = findRequestRow_(requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการลบ');
  }
  getSheet_(CONFIG.REQUEST_SHEET).deleteRow(rowData.rowIndex);
  return getInitialData();
}

function receiveExam(payload) {
  ensureSetup_();
  validateRequired_(payload, ['requestId', 'receivedBy', 'envelopeCount']);
  const rowData = findRequestRow_(payload.requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการรับข้อสอบ');
  }

  const updated = Object.assign({}, rowData.record, {
    updatedAt: new Date(),
    requestStatus: 'รับข้อสอบแล้ว',
    receivedBy: payload.receivedBy,
    envelopeCount: payload.envelopeCount,
    receivedAt: new Date()
  });

  setRowValues_(CONFIG.REQUEST_SHEET, rowData.rowIndex, objectToRow_(updated));
  return getInitialData();
}

function updateReceive(payload) {
  ensureSetup_();
  validateRequired_(payload, ['requestId', 'receivedBy', 'envelopeCount']);
  const rowData = findRequestRow_(payload.requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการแก้ไข');
  }
  if (payload.expectedUpdatedAt) {
    const serverUpdatedAt = formatDateTime_(rowData.record.updatedAt);
    if (serverUpdatedAt && serverUpdatedAt !== payload.expectedUpdatedAt) {
      throw new Error('ข้อมูลถูกแก้ไขโดยผู้ใช้งานอื่นก่อนหน้า กรุณารีเฟรชแล้วลองใหม่');
    }
  }
  const updated = Object.assign({}, rowData.record, {
    updatedAt: new Date(),
    receivedBy: payload.receivedBy,
    envelopeCount: payload.envelopeCount,
  });
  setRowValues_(CONFIG.REQUEST_SHEET, rowData.rowIndex, objectToRow_(updated));
  return getInitialData();
}

function submitMcq(payload) {
  ensureSetup_();
  const requiredFields = ['requestId', 'mcqType', 'questionCount', 'scoreCount', 'examFormat', 'submittedDate', 'mcqPersonnelName', 'senderEmail'];
  validateRequired_(payload, requiredFields);
  const rowData = findRequestRow_(payload.requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการส่งตรวจข้อสอบปรนัย');
  }

  const isAbType = payload.mcqType === 'ชุด A และชุด B';
  const hasFreeQuestion = Boolean(payload.hasFreeQuestion);
  const updated = Object.assign({}, rowData.record, {
    updatedAt: new Date(),
    mcqType: payload.mcqType,
    sheetCount: isAbType ? '' : (payload.sheetCount || ''),
    sheetCountA: isAbType ? (payload.sheetCountA || '') : '',
    sheetCountB: isAbType ? (payload.sheetCountB || '') : '',
    questionCount: payload.questionCount,
    scoreCount: payload.scoreCount,
    hasFreeQuestion: hasFreeQuestion,
    freeQuestionCount: hasFreeQuestion ? payload.freeQuestionCount || '' : '',
    examFormat: payload.examFormat,
    senderEmail: normalizeEmail_(payload.senderEmail),
    ccEmail: payload.ccEmail ? normalizeEmail_(payload.ccEmail) : '',
    mcqPersonnelName: payload.mcqPersonnelName,
    mcqSubmittedAt: payload.submittedDate,
    mcqStatus: 'ส่งข้อสอบปรนัยแล้ว',
    requestStatus: 'ส่งข้อสอบปรนัยแล้ว'
  });

  setRowValues_(CONFIG.REQUEST_SHEET, rowData.rowIndex, objectToRow_(updated));
  return getInitialData();
}

function updateMcq(payload) {
  ensureSetup_();
  validateRequired_(payload, ['requestId']);
  const rowData = findRequestRow_(payload.requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการแก้ไข');
  }
  if (payload.expectedUpdatedAt) {
    const serverUpdatedAt = formatDateTime_(rowData.record.updatedAt);
    if (serverUpdatedAt && serverUpdatedAt !== payload.expectedUpdatedAt) {
      throw new Error('ข้อมูลถูกแก้ไขโดยผู้ใช้งานอื่นก่อนหน้า กรุณารีเฟรชแล้วลองใหม่');
    }
  }
  const isAbType = payload.mcqType === 'ชุด A และชุด B';
  const hasFreeQuestion = Boolean(payload.hasFreeQuestion);
  const updated = Object.assign({}, rowData.record, {
    updatedAt: new Date(),
    mcqType: payload.mcqType || rowData.record.mcqType,
    sheetCount: isAbType ? '' : (payload.sheetCount || rowData.record.sheetCount),
    sheetCountA: isAbType ? (payload.sheetCountA || rowData.record.sheetCountA) : '',
    sheetCountB: isAbType ? (payload.sheetCountB || rowData.record.sheetCountB) : '',
    questionCount: payload.questionCount || rowData.record.questionCount,
    scoreCount: payload.scoreCount || rowData.record.scoreCount,
    hasFreeQuestion: hasFreeQuestion,
    freeQuestionCount: hasFreeQuestion ? (payload.freeQuestionCount || rowData.record.freeQuestionCount) : '',
    examFormat: payload.examFormat || rowData.record.examFormat,
    senderEmail: payload.senderEmail ? normalizeEmail_(payload.senderEmail) : rowData.record.senderEmail,
    ccEmail: payload.ccEmail ? normalizeEmail_(payload.ccEmail) : rowData.record.ccEmail,
    mcqPersonnelName: payload.mcqPersonnelName || rowData.record.mcqPersonnelName,
    mcqSubmittedAt: payload.submittedDate || rowData.record.mcqSubmittedAt,
  });
  setRowValues_(CONFIG.REQUEST_SHEET, rowData.rowIndex, objectToRow_(updated));
  return getInitialData();
}

function markMcqChecked(requestId) {
  ensureSetup_();
  const rowData = findRequestRow_(requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการอัปเดตสถานะตรวจข้อสอบ');
  }

  const updated = Object.assign({}, rowData.record, {
    updatedAt: new Date(),
    mcqStatus: 'ตรวจข้อสอบปรนัยแล้ว',
    mcqCheckedAt: new Date(),
    requestStatus: 'ตรวจข้อสอบปรนัยแล้ว'
  });

  setRowValues_(CONFIG.REQUEST_SHEET, rowData.rowIndex, objectToRow_(updated));
  return getInitialData();
}

function sendCheckNotification(payload) {
  ensureSetup_();
  validateRequired_(payload, ['requestId', 'courseCode', 'sheetCount', 'questionCount', 'scoreCount', 'examinerEmail']);
  const rowData = findRequestRow_(payload.requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการส่งอีเมล');
  }

  const subject = 'แจ้งผลตรวจข้อสอบปรนัย — ' + payload.courseCode;
  var body = 'เรียน ' + (payload.mcqPersonnelName || 'ผู้ส่งตรวจข้อสอบ') + '\n\n'
    + 'รายวิชา: ' + payload.courseCode + '\n'
    + 'ประเภทกลุ่มเรียน: ' + (payload.sectionType || '-') + '\n'
    + 'จำนวนแผ่นเอกสาร: ' + payload.sheetCount + ' แผ่น\n'
    + 'จำนวนข้อ: ' + payload.questionCount + ' ข้อ\n'
    + 'จำนวนคะแนน: ' + payload.scoreCount + ' คะแนน\n'
    + '\nขอบคุณครับ';

  var options = {};
  if (payload.attachments && payload.attachments.length > 0) {
    options.attachments = payload.attachments.map(function (att) {
      var cleanBase64 = (att.data || '').replace(/\s+/g, '');
      var blob = Utilities.newBlob(
        Utilities.base64Decode(cleanBase64),
        att.mimeType,
        att.filename
      );
      Logger.log('Attachment: ' + att.filename + ', size: ' + blob.getBytes().length + ', type: ' + att.mimeType);
      if (blob.getBytes().length === 0) {
        throw new Error('ไฟล์แนบ ' + att.filename + ' มีขนาด 0 bytes — ตรวจสอบ base64 data');
      }
      return blob;
    });
  }
  if (payload.ccEmail) {
    options.cc = payload.ccEmail;
  }

  GmailApp.sendEmail(payload.examinerEmail, subject, body, options);

  updateCourseNotification_(payload);

  return { message: 'ส่งอีเมลแจ้งเตือนเรียบร้อยแล้ว' };
}

function updateCourseNotification_(payload) {
  try {
    const sheet = getSheet_(CONFIG.REQUEST_SHEET);

    // Find the request row by requestId
    const rowData = findRequestRow_(payload.requestId);
    if (!rowData.rowIndex) {
      Logger.log('updateCourseNotification_: request not found');
      return;
    }

    // Extra columns start right after the last REQUEST_HEADERS column
    const baseCol = CONFIG.REQUEST_HEADERS.length + 1;
    const extraHeaders = ['จำนวนแผ่นเอกสาร', 'จำนวนข้อ', 'จำนวนคะแนน', 'แจ้งเตือนล่าสุด'];

    // Ensure headers exist in row 1
    for (let i = 0; i < extraHeaders.length; i++) {
      const col = baseCol + i;
      const existing = sheet.getRange(1, col).getValue();
      if (!existing) {
        sheet.getRange(1, col).setValue(extraHeaders[i]);
      }
    }

    // Write notification data
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    sheet.getRange(rowData.rowIndex, baseCol).setValue(payload.sheetCount);
    sheet.getRange(rowData.rowIndex, baseCol + 1).setValue(payload.questionCount);
    sheet.getRange(rowData.rowIndex, baseCol + 2).setValue(payload.scoreCount);
    sheet.getRange(rowData.rowIndex, baseCol + 3).setValue(now);
    Logger.log('updateCourseNotification_: row ' + rowData.rowIndex + ' cols ' + baseCol + '-' + (baseCol + 3));
  } catch (error) {
    Logger.log('updateCourseNotification_ error: ' + error.message);
  }
}

function sendExamEmail(payload) {
  ensureSetup_();
  validateRequired_(payload, ['requestId', 'to', 'subject', 'body']);
  const rowData = findRequestRow_(payload.requestId);
  if (!rowData.rowIndex) {
    throw new Error('ไม่พบรายการที่ต้องการส่งอีเมล');
  }

  const attachments = payload.attachments || [];
  const options = {};
  if (attachments.length > 0) {
    options.attachments = attachments.map(function (att) {
      return Utilities.newBlob(
        Utilities.base64Decode(att.data),
        att.mimeType,
        att.filename
      );
    });
  }

  GmailApp.sendEmail(payload.to, payload.subject, payload.body, options);

  const updated = Object.assign({}, rowData.record, {
    updatedAt: new Date(),
    requestStatus: 'ตรวจและส่ง email เรียบร้อยแล้ว',
    mcqStatus: 'ตรวจและส่ง email เรียบร้อยแล้ว',
  });
  setRowValues_(CONFIG.REQUEST_SHEET, rowData.rowIndex, objectToRow_(updated));

  return getInitialData();
}

function ensureSetup_() {
  const sheet = getOrCreateSheet_(CONFIG.REQUEST_SHEET);
  const headers = CONFIG.REQUEST_HEADERS;
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const sameHeader = headers.every(function (header, index) {
    return existingHeaders[index] === header;
  });
  if (!sameHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function getCourses_() {
  const sheet = getSheet_(CONFIG.MASTER_COURSE_SHEET);
  const headers = getHeaders_(sheet);
  const headerVariants = ['CourseCode (รหัสวิชา)', 'CourseCode', 'รหัสวิชา'];
  let colIdx = -1;
  for (let i = 0; i < headerVariants.length; i++) {
    const idx = headers.indexOf(headerVariants[i]);
    if (idx !== -1) { colIdx = idx; break; }
  }
  if (colIdx === -1) colIdx = 0;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, colIdx + 1, lastRow - 1, 1).getValues()
    .map(function (row) { return String(row[0] || '').trim(); })
    .filter(Boolean);
}

function getPersonnel_() {
  const sheet = getSheet_(CONFIG.MASTER_PERSONNEL_SHEET);
  const headers = getHeaders_(sheet);
  const headerVariants = ['SenderName (ชื่อผู้ส่ง)', 'SenderName', 'ชื่อผู้ส่ง'];
  let colIdx = -1;
  for (let i = 0; i < headerVariants.length; i++) {
    const idx = headers.indexOf(headerVariants[i]);
    if (idx !== -1) { colIdx = idx; break; }
  }
  if (colIdx === -1) colIdx = 0;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, colIdx + 1, lastRow - 1, 1).getValues()
    .map(function (row) { return String(row[0] || '').trim(); })
    .filter(Boolean);
}

function createCourse(payload) {
  ensureSetup_();
  validateRequired_(payload, ['value']);
  createMasterValue_(getCourseSheetInfo_(), payload.value);
  return getInitialData();
}

function updateCourse(payload) {
  ensureSetup_();
  validateRequired_(payload, ['oldValue', 'newValue']);
  updateMasterValue_(getCourseSheetInfo_(), payload.oldValue, payload.newValue);
  return getInitialData();
}

function deleteCourse(value) {
  ensureSetup_();
  if (!value) {
    throw new Error('กรุณาระบุรายวิชาที่ต้องการลบ');
  }
  deleteMasterValue_(getCourseSheetInfo_(), value);
  return getInitialData();
}

function createPersonnel(payload) {
  ensureSetup_();
  validateRequired_(payload, ['value']);
  createMasterValue_(getPersonnelSheetInfo_(), payload.value);
  return getInitialData();
}

function updatePersonnel(payload) {
  ensureSetup_();
  validateRequired_(payload, ['oldValue', 'newValue']);
  updateMasterValue_(getPersonnelSheetInfo_(), payload.oldValue, payload.newValue);
  return getInitialData();
}

function deletePersonnel(value) {
  ensureSetup_();
  if (!value) {
    throw new Error('กรุณาระบุบุคลากรที่ต้องการลบ');
  }
  deleteMasterValue_(getPersonnelSheetInfo_(), value);
  return getInitialData();
}

function getRequests_() {
  const sheet = getSheet_(CONFIG.REQUEST_SHEET);
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol === 0) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return values
    .filter(function (row) {
      return row[0];
    })
    .map(function (row) {
      const record = rowToObject_(row);
      // Append extra columns beyond REQUEST_HEADERS
      const baseIdx = CONFIG.REQUEST_HEADERS.length;
      record._extra = row.slice(baseIdx);
      // DEBUG: log mcqPersonnelName for first row
      if (CONFIG.REQUEST_HEADERS.indexOf('mcqPersonnelName') >= 0) {
        const idx = CONFIG.REQUEST_HEADERS.indexOf('mcqPersonnelName');
        Logger.log('DEBUG mcqPersonnelName: row[' + idx + ']=' + JSON.stringify(row[idx]) + ' record=' + JSON.stringify(record.mcqPersonnelName));
      }
      return normalizeRequestForClient_(record);
    });
}

function getSpreadsheet_() {
  return CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_(name) {
  const sheet = getSpreadsheet_().getSheetByName(name);
  if (!sheet) {
    throw new Error('ไม่พบชีต: ' + name);
  }
  return sheet;
}

function getOrCreateSheet_(name) {
  const spreadsheet = getSpreadsheet_();
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function readSheetData_(sheetName) {
  const sheet = getSheet_(sheetName);
  return readRowsFromSheet_(sheet);
}

function readMasterSheetData_(expectedHeaders) {
  const sheets = getSpreadsheet_().getSheets();
  for (let index = 0; index < sheets.length; index += 1) {
    const sheet = sheets[index];
    const headers = getHeaders_(sheet);
    const found = expectedHeaders.some(function (expectedHeader) {
      return headers.indexOf(expectedHeader) !== -1;
    });
    if (found) {
      return readRowsFromSheet_(sheet);
    }
  }
  throw new Error('ไม่พบชีตข้อมูลหลักที่มีหัวคอลัมน์: ' + expectedHeaders.join(', '));
}

function getHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) {
    return [];
  }
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
}

function readRowsFromSheet_(sheet) {
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || lastColumn === 0) {
    return [];
  }
  const headers = getHeaders_(sheet);
  const values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  return values.map(function (row) {
    const item = {};
    headers.forEach(function (header, index) {
      item[header] = row[index];
    });
    return item;
  });
}

function appendRow_(sheetName, row) {
  const sheet = getSheet_(sheetName);
  sheet.appendRow(row);
}

function getCourseSheetInfo_() {
  return getSheetInfoByName_(CONFIG.MASTER_COURSE_SHEET, [
    'CourseCode (รหัสวิชา)',
    'CourseCode',
    'รหัสวิชา'
  ]);
}

function getPersonnelSheetInfo_() {
  return getSheetInfoByName_(CONFIG.MASTER_PERSONNEL_SHEET, [
    'SenderName (ชื่อผู้ส่ง)',
    'SenderName',
    'ชื่อผู้ส่ง'
  ]);
}

function getSheetInfoByName_(sheetName, expectedHeaders) {
  const sheet = getSheet_(sheetName);
  const headers = getHeaders_(sheet);
  for (let i = 0; i < expectedHeaders.length; i++) {
    const idx = headers.indexOf(expectedHeaders[i]);
    if (idx !== -1) {
      return { sheet, headers, columnIndex: idx + 1, headerName: expectedHeaders[i] };
    }
  }
  return { sheet, headers, columnIndex: 1, headerName: headers[0] || '' };
}

function findMasterSheetInfo_(expectedHeaders) {
  const sheets = getSpreadsheet_().getSheets();
  for (let index = 0; index < sheets.length; index += 1) {
    const sheet = sheets[index];
    const headers = getHeaders_(sheet);
    for (let headerIndex = 0; headerIndex < expectedHeaders.length; headerIndex += 1) {
      const foundIndex = headers.indexOf(expectedHeaders[headerIndex]);
      if (foundIndex !== -1) {
        return {
          sheet: sheet,
          headers: headers,
          columnIndex: foundIndex + 1,
          headerName: expectedHeaders[headerIndex]
        };
      }
    }
  }
  throw new Error('ไม่พบชีตข้อมูลหลักสำหรับ header: ' + expectedHeaders.join(', '));
}

function getMasterColumnValues_(info) {
  const lastRow = info.sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }
  return info.sheet.getRange(2, info.columnIndex, lastRow - 1, 1).getValues().map(function (row) {
    return String(row[0] || '').trim();
  });
}

function findMasterRowIndex_(info, value) {
  const values = getMasterColumnValues_(info);
  const target = String(value || '').trim();
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] === target) {
      return index + 2;
    }
  }
  return 0;
}

function createMasterValue_(info, value) {
  const cleaned = String(value || '').trim();
  if (!cleaned) {
    throw new Error('กรุณากรอกข้อมูล');
  }
  if (findMasterRowIndex_(info, cleaned)) {
    throw new Error('มีข้อมูลนี้อยู่แล้ว');
  }
  const row = new Array(info.headers.length).fill('');
  row[info.columnIndex - 1] = cleaned;
  info.sheet.appendRow(row);
}

function updateMasterValue_(info, oldValue, newValue) {
  const oldCleaned = String(oldValue || '').trim();
  const newCleaned = String(newValue || '').trim();
  if (!oldCleaned || !newCleaned) {
    throw new Error('กรุณากรอกข้อมูลให้ครบ');
  }
  const rowIndex = findMasterRowIndex_(info, oldCleaned);
  if (!rowIndex) {
    throw new Error('ไม่พบข้อมูลที่ต้องการแก้ไข');
  }
  const duplicateRowIndex = findMasterRowIndex_(info, newCleaned);
  if (duplicateRowIndex && duplicateRowIndex !== rowIndex) {
    throw new Error('มีข้อมูลนี้อยู่แล้ว');
  }
  info.sheet.getRange(rowIndex, info.columnIndex).setValue(newCleaned);
}

function deleteMasterValue_(info, value) {
  const rowIndex = findMasterRowIndex_(info, value);
  if (!rowIndex) {
    throw new Error('ไม่พบข้อมูลที่ต้องการลบ');
  }
  info.sheet.deleteRow(rowIndex);
}

function setRowValues_(sheetName, rowIndex, row) {
  getSheet_(sheetName).getRange(rowIndex, 1, 1, row.length).setValues([row]);
}

function findRequestRow_(requestId) {
  const sheet = getSheet_(CONFIG.REQUEST_SHEET);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {};
  }

  const values = sheet.getRange(2, 1, lastRow - 1, CONFIG.REQUEST_HEADERS.length).getValues();

  for (let index = 0; index < values.length; index += 1) {
    if (values[index][0] === requestId) {
      const record = rowToObject_(values[index]);
      return {
        rowIndex: index + 2,
        record: record
      };
    }
  }

  return {};
}

function objectToRow_(record) {
  return CONFIG.REQUEST_HEADERS.map(function (header) {
    return record[header];
  });
}

function rowToObject_(row) {
  const item = {};
  CONFIG.REQUEST_HEADERS.forEach(function (header, index) {
    item[header] = row[index];
  });
  return item;
}

function normalizeEmail_(email) {
  const cleaned = String(email || '').trim();
  if (!cleaned) {
    return '';
  }
  if (cleaned.indexOf('@') !== -1) {
    return cleaned;
  }
  return cleaned + CONFIG.EMAIL_DOMAIN;
}

function normalizeRequestForClient_(row) {
  const rawStatus = row.requestStatus || '';
  const rawMcqName = row.mcqPersonnelName || '';
  const statusValue = rawStatus || rawMcqName;

  // Extra columns after REQUEST_HEADERS (stored in _extra array)
  const extra = row._extra || [];
  const notifSheetCount = extra[0] || '';
  const notifQuestionCount = extra[1] || '';
  const notifScoreCount = extra[2] || '';
  const notifAt = extra[3] || '';

  return {
    requestId: row.requestId || '',
    createdAt: formatDateTime_(row.createdAt),
    updatedAt: formatDateTime_(row.updatedAt),
    courseCode: row.courseCode || '',
    term: row.term || '',
    examType: row.examType || '',
    courseCategory: row.courseCategory || '',
    sectionType: row.sectionType || '',
    productionMethod: row.productionMethod || '',
    examArrangement: row.examArrangement || '',
    submittedDate: formatDate_(row.submittedDate),
    contactPhone: row.contactPhone || '',
    senderName: row.senderName || '',
    senderEmail: row.senderEmail || '',
    ccEmail: row.ccEmail || '',
    mcqPersonnelName: String(row.mcqPersonnelName || '').trim(),
    requestStatus: statusValue,
    receivedBy: row.receivedBy || '',
    envelopeCount: row.envelopeCount || '',
    receivedAt: formatDateTime_(row.receivedAt),
    mcqType: row.mcqType || '',
    sheetCount: row.sheetCount || '',
    sheetCountA: row.sheetCountA || '',
    sheetCountB: row.sheetCountB || '',
    questionCount: row.questionCount || '',
    scoreCount: row.scoreCount || '',
    hasFreeQuestion: String(row.hasFreeQuestion) === 'true' || row.hasFreeQuestion === true,
    freeQuestionCount: row.freeQuestionCount || '',
    examFormat: row.examFormat || '',
    mcqSubmittedAt: formatDate_(row.mcqSubmittedAt),
    mcqStatus: row.mcqStatus || '',
    mcqCheckedAt: formatDateTime_(row.mcqCheckedAt),
    notifSheetCount: notifSheetCount,
    notifQuestionCount: notifQuestionCount,
    notifScoreCount: notifScoreCount,
    notifAt: notifAt ? formatDateTime_(notifAt) : ''
  };
}

function formatDate_(value) {
  if (!value) {
    return '';
  }
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value);
}

function formatDateTime_(value) {
  if (!value) {
    return '';
  }
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  }
  return String(value);
}

function validateRequired_(payload, fields) {
  fields.forEach(function (field) {
    const value = payload[field];
    if (value === undefined || value === null || value === '') {
      throw new Error('กรุณากรอกข้อมูลให้ครบ: ' + field);
    }
  });
}

function getSheetDiagnostics_() {
  const spreadsheet = getSpreadsheet_();
  return {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetName: spreadsheet.getName(),
    sheets: spreadsheet.getSheets().map(function (sheet) {
      const headers = getHeaders_(sheet).slice(0, 5).map(function (value) {
        return value || '';
      });
      return {
        name: sheet.getName(),
        lastRow: sheet.getLastRow(),
        lastColumn: sheet.getLastColumn(),
        headers: headers
      };
    })
  };
}

function runApiActionWithLock_(action, payload) {
  const lock = LockService.getScriptLock();
  const acquired = lock.tryLock(10000);
  if (!acquired) {
    throw new Error('มีผู้ใช้งานอื่นกำลังบันทึกข้อมูลอยู่ กรุณารอสักครู่แล้วลองใหม่');
  }
  try {
    return runApiAction_(action, payload);
  } finally {
    lock.releaseLock();
  }
}

function runApiAction_(action, payload) {
  switch (action) {
    case 'getInitialData':
      return getInitialData();
    case 'submitExamRequest':
      return submitExamRequest(payload);
    case 'updateExamRequest':
      return updateExamRequest(payload);
    case 'deleteExamRequest':
      return deleteExamRequest(payload);
    case 'receiveExam':
      return receiveExam(payload);
    case 'submitMcq':
      return submitMcq(payload);
    case 'markMcqChecked':
      return markMcqChecked(payload);
    case 'createCourse':
      return createCourse(payload);
    case 'updateCourse':
      return updateCourse(payload);
    case 'deleteCourse':
      return deleteCourse(payload);
    case 'createPersonnel':
      return createPersonnel(payload);
    case 'updatePersonnel':
      return updatePersonnel(payload);
    case 'deletePersonnel':
      return deletePersonnel(payload);
    case 'sendExamEmail':
      return sendExamEmail(payload);
    case 'sendCheckNotification':
      return sendCheckNotification(payload);
    case 'updateReceive':
      return updateReceive(payload);
    case 'updateMcq':
      return updateMcq(payload);
    default:
      throw new Error('Unsupported action: ' + action);
  }
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
