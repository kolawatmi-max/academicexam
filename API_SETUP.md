# React to Apps Script API Setup

1. ใช้ source Apps Script ใน `C:\Users\kolawat.mi\exam-paper-gas\Code.gs`
2. อัปเดต Apps Script project ให้มี `doPost()` และ helper API ตามไฟล์ local ล่าสุด
3. Deploy Apps Script ใหม่เป็น `Web app`
4. ตั้งค่า `Execute as: Me`
5. ตั้งค่า `Who has access` ให้ครอบคลุมผู้ใช้เว็บ React
6. คัดลอก Web App URL ที่ deploy ล่าสุด
7. สร้างไฟล์ `.env` ในโปรเจกต์ React จาก `.env.example`
8. ใส่ค่า `VITE_EXAM_API_URL=<web-app-url>`
9. รัน `npm run dev` หรือ deploy ขึ้น Netlify

หมายเหตุ:
- ถ้าไม่ได้ตั้ง `VITE_EXAM_API_URL` ระบบ React จะ fallback ไปใช้ mock API อัตโนมัติ
- หลังแก้ Apps Script ต้อง deploy version ใหม่ทุกครั้ง ไม่เช่นนั้น React จะยังเรียก endpoint เก่า
