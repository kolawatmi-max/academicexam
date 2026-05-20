import { useState } from 'react'

const MAX_FILES = 6

function CheckNotificationPopup({ item, emailDomain, onClose, onSend }) {
  const [sheetCount, setSheetCount] = useState(item.notifSheetCount || '')
  const [questionCount, setQuestionCount] = useState(item.notifQuestionCount || '')
  const [scoreCount, setScoreCount] = useState(item.notifScoreCount || '')
  const [files, setFiles] = useState([])
  const [sending, setSending] = useState(false)

  const examinerEmail = item.senderEmail || ''
  const hasNotifHistory = !!item.notifAt

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return
    setFiles((prev) => {
      const combined = [...prev, ...selected]
      if (combined.length > MAX_FILES) {
        alert(`แนบได้สูงสุด ${MAX_FILES} ไฟล์เท่านั้น`)
        return combined.slice(0, MAX_FILES)
      }
      return combined
    })
    e.target.value = ''
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

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

    const attachments = []
    for (const file of files) {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          const base64Data = result.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      attachments.push({
        data: base64,
        mimeType: file.type,
        filename: file.name,
      })
    }

    const success = await onSend({
      requestId: item.requestId,
      courseCode: item.courseCode,
      mcqPersonnelName: item.mcqPersonnelName || '',
      sectionType: item.sectionType || '',
      sheetCount,
      questionCount,
      scoreCount,
      examinerEmail,
      ccEmail: item.ccEmail || '',
      attachments,
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
          <div><strong>ผู้ส่งตรวจ:</strong> {item.mcqPersonnelName?.trim() || '-'}</div>
          <div><strong>อีเมล:</strong> {examinerEmail || '-'}</div>
          <div><strong>CC:</strong> {item.ccEmail || '-'}</div>
        </div>

        {hasNotifHistory && (
          <div className="check-notif-history" style={{ background: '#f0f7ff', border: '1px solid #b3d9ff', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: '#1a6fc4' }}>📋 ข้อมูลที่แจ้งไปล่าสุด ({item.notifAt})</div>
            <div>จำนวนแผ่นเอกสาร: {item.notifSheetCount} แผ่น</div>
            <div>จำนวนข้อ: {item.notifQuestionCount} ข้อ</div>
            <div>จำนวนคะแนน: {item.notifScoreCount} คะแนน</div>
          </div>
        )}

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
            <label>แนบไฟล์เอกสาร (สูงสุด {MAX_FILES} ไฟล์)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <div className="check-notif-files" style={{ marginTop: 6 }}>
                {files.map((f, i) => (
                  <div key={i} className="check-notif-file" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span>📎 {f.name}</span>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => removeFile(i)}
                      style={{ padding: '2px 8px', fontSize: 11 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
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
