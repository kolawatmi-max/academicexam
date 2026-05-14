# Migration Notes

## Source of Truth

ฐานที่ใช้ย้ายล่าสุดคือ:

- [Index.html](C:\Users\kolawat.mi\exam-paper-gas\Index.html)
- [Code.gs](C:\Users\kolawat.mi\exam-paper-gas\Code.gs)
- [PROJECT_NOTES.md](C:\Users\kolawat.mi\exam-paper-gas\PROJECT_NOTES.md)

ไม่ใช้ `Desktop\index.html` แล้ว

## Current Stage

React frontend ในโฟลเดอร์:

- [exam-paper-react](C:\Users\kolawat.mi\exam-paper-react)

สถานะตอนนี้:

1. มีโครงหน้า 4 หน้าเหมือน Apps Script ล่าสุด
2. ใช้ mock state ภายในแอปก่อน
3. data model ถูกปรับให้ตรงกับ Apps Script ล่าสุดมากขึ้นแล้ว
4. build ผ่าน

## Features mirrored from Apps Script

1. ส่งข้อสอบ
2. รับข้อสอบ
3. ส่งตรวจข้อสอบปรนัย
4. สถานะตรวจข้อสอบปรนัย

รองรับฟิลด์สำคัญแล้ว:

- `courseCode`
- `term`
- `examType`
- `courseCategory`
- `sectionType`
- `productionMethod`
- `examArrangement`
- `submittedDate`
- `contactPhone`
- `senderName`
- `senderEmail`
- `mcqPersonnelName`
- `receivedBy`
- `envelopeCount`
- `mcqType`
- `sheetCount`
- `questionCount`
- `scoreCount`
- `hasFreeQuestion`
- `freeQuestionCount`
- `examFormat`

## Important behavior

- ภาคการศึกษาใช้:
  - `ภาค 2/2568`
  - `ภาค S/2568`
- รหัสวิชาเป็นค้นหาแบบพิมพ์ได้
- รายชื่อบุคลากรเป็นค้นหาแบบพิมพ์ได้
- popup ยืนยันหลัง action สำคัญ

## Next Steps

1. แยก component ออกจาก `src/App.jsx`
2. สร้าง service layer สำหรับ backend
3. เลือก backend แทน Apps Script
4. ผูก GitHub remote
5. deploy ขึ้น Netlify

## Commands

```powershell
cd C:\Users\kolawat.mi\exam-paper-react
npm install
npm run dev
npm run build
```
