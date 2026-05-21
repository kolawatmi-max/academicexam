const fs = require('fs');
const content = fs.readFileSync('Code.js', 'utf8');

// Match from function signature to the closing brace of getPersonnelSheetInfo_
const startMarker = 'function getCourseSheetInfo_()';
const endMarker = '}\n\nfunction findMasterSheetInfo_';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: Could not find markers in Code.js');
  console.log('startIdx:', startIdx, 'endIdx:', endIdx);
  process.exit(1);
}

// Include the closing } of getPersonnelSheetInfo_ plus the newline before findMasterSheetInfo_
const endOfReplacement = endIdx + 1; // +1 to include the }
const oldText = content.substring(startIdx, endOfReplacement);

const replacement = `function getCourseSheetInfo_() {
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
}`;

const updated = content.substring(0, startIdx) + replacement + content.substring(endOfReplacement);
fs.writeFileSync('Code.js', updated, 'utf8');
console.log('Done. Replaced successfully.');
console.log('Old text length:', oldText.length, 'New text length:', replacement.length);
