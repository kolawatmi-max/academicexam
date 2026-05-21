const fs = require('fs');
const content = fs.readFileSync('Code.js', 'utf8');

// Fix getCourses_ to use sheet name
const oldCourses = `function getCourses_() {
  const rows = readMasterSheetData_([
    'CourseCode (รหัสวิชา)',
    'CourseCode',
    'รหัสวิชา'
  ]);
  return rows
    .map(function(row) { return row['CourseCode (รหัสวิชา)'] || row.CourseCode || row['รหัสวิชา'] || ''; })
    .filter(Boolean);
}`;

const newCourses = `function getCourses_() {
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
    .map(function(row) { return String(row[0] || '').trim(); })
    .filter(Boolean);
}`;

// Fix getPersonnel_ to use sheet name
const oldPersonnel = `function getPersonnel_() {
  const rows = readMasterSheetData_([
    'SenderName (ชื่อผู้ส่ง)',
    'SenderName',
    'ชื่อผู้ส่ง'
  ]);
  return rows
    .map(function(row) { return row['SenderName (ชื่อผู้ส่ง)'] || row.SenderName || row['ชื่อผู้ส่ง'] || ''; })
    .filter(Boolean);
}`;

const newPersonnel = `function getPersonnel_() {
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
    .map(function(row) { return String(row[0] || '').trim(); })
    .filter(Boolean);
}`;

let updated = content;
if (updated.includes(oldCourses)) {
  updated = updated.replace(oldCourses, newCourses);
  console.log('Replaced getCourses_');
} else {
  console.log('WARNING: Could not find getCourses_');
}

if (updated.includes(oldPersonnel)) {
  updated = updated.replace(oldPersonnel, newPersonnel);
  console.log('Replaced getPersonnel_');
} else {
  console.log('WARNING: Could not find getPersonnel_');
}

fs.writeFileSync('Code.js', updated, 'utf8');
console.log('Done.');
