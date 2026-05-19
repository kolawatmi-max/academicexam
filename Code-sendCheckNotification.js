// เพิ่ม function นี้ใน Code.js ของ Google Apps Script
// จากนั้น deploy ใหม่ด้วย clasp push + clasp deploy

function sendCheckNotification(payload) {
  var courseCode = payload.courseCode || '';
  var sheetCount = payload.sheetCount || '';
  var questionCount = payload.questionCount || '';
  var scoreCount = payload.scoreCount || '';
  var examinerEmail = payload.examinerEmail || '';
  var fileName = payload.fileName || '';

  if (!examinerEmail) {
    return { ok: false, error: 'ไม่พบอีเมลผู้ส่งตรวจข้อสอบ' };
  }

  var subject = 'แจ้งผลตรวจข้อสอบปรนัย — ' + courseCode;

  var body = 'เรียน ผู้ส่งตรวจข้อสอบ\n\n'
    + 'รายวิชา: ' + courseCode + '\n'
    + 'จำนวนแผ่นเอกสาร: ' + sheetCount + ' แผ่น\n'
    + 'จำนวนข้อ: ' + questionCount + ' ข้อ\n'
    + 'จำนวนคะแนน: ' + scoreCount + ' คะแนน\n';

  if (fileName) {
    body += 'ไฟล์แนบ: ' + fileName + '\n';
  }

  body += '\nขอบคุณครับ/ค่ะ';

  try {
    GmailApp.sendEmail(examinerEmail, subject, body);
    return { ok: true, message: 'ส่งอีเมลแจ้งเตือนเรียบร้อยแล้ว' };
  } catch (e) {
    return { ok: false, error: 'ส่งอีเมลไม่สำเร็จ: ' + e.message };
  }
}

// และเพิ่ม case นี้ใน function doGet หรือ handleRequest ที่มีอยู่แล้ว:
/*
  else if (action === 'sendCheckNotification') {
    var payload = JSON.parse(params.payload || '{}');
    var result = sendCheckNotification(payload);
    return jsonResponse_(result);
  }
*/
