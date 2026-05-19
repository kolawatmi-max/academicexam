import { useState } from 'react'

function CheckNotificationPopup({ item, emailDomain, onClose, onSend }) {
  const [sheetCount, setSheetCount] = useState('')
  const [questionCount, setQuestionCount] = useState('')
  const [scoreCount, setScoreCount] = useState('')
  const [file, setFile] = useState(null)
  const [sending, setSending] = useState(false)

  const examinerEmail = item.senderEmail || ''

  async function handleSend() {
    if (!sheetCount || !questionCount || !scoreCount) {
      alert('กรุณากรอกจำนวนแผ่นเอกสาร จำนวนข้อ และจำนวนคะแนนให้ครบ')
      return
    }
    if (!examinerEmail) {
      alert('ไม่พบอีเมลของผู้ส่งตรวจข้อสอบ')
      return
    }

    setSending(true)
    const success = await onSend({
      requestId: item.requestId,
      courseCode: item.courseCode,
      sheetCount,
      questionCount,
      scoreCount,
      examinerEmail,
      fileName: file?.name || '',
    })
    setSending(false)
    if (success) {
      onClose()
    }
  }

  return (
    <div className="popup-backdrop active" onClick={onClose}>
      <div className="popup-card" onClick={(event) => event.stopPropagation()} style={{ width: 480, maxWidth: '100%', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>📧 แจ้งผู้ส่งตรวจข้อสอบ</h3>
          <button className="secondary" type="button" onClick={onClose} style={{ padding: '4px 10px', fontSize: 12 }}>✕</button>
        </div>

        <div className="check-notif-info">
          <div><strong>รายวิชา:</strong> {item.courseCode}</div>
          <div><strong>ผู้ส่งตรวจ:</strong> {item.mcqPersonnelName || '-'}</div>
          <div><strong>อีเมล:</strong> {examinerEmail || '-'}</div>
        </div>

        <div className="check-notif-form">
          <div>
            <label>จำนวนแผ่นเอกสาร</label>
            <input
              type="number"
              value={sheetCount}
              onChange={(e) => setSheetCount(e.target.value)}
              placeholder="กรอกจำนวนแผ่น"
            />
          </div>
          <div>
            <label>จำนวนข้อ</label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder="กรอกจำนวนข้อ"
            />
          </div>
          <div>
            <label>จำนวนคะแนน</label>
            <input
              type="number"
              value={scoreCount}
              onChange={(e) => setScoreCount(e.target.value)}
              placeholder="กรอกจำนวนคะแนน"
            />
          </div>
          <div>
            <label>แนบไฟล์เอกสาร (ถ้ามี)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            {file && (
              <div className="check-notif-file">
                📎 {file.name}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="primary"
            type="button"
            disabled={sending}
            onClick={handleSend}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {sending ? 'กำลังส่ง...' : '📧 ส่งแจ้งเตือน'}
          </button>
          <button className="secondary" type="button" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckNotificationPopup
