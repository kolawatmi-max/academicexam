import { useState } from 'react'
import Pagination, { PAGE_SIZE } from './Pagination'
import CheckNotificationPopup from './CheckNotificationPopup'

function CheckPanel({ active, checkFilter, checkSearch, items, isAdmin, markChecked, sendCheckNotification, setCheckFilter, setCheckSearch, status, emailDomain }) {
  const [page, setPage] = useState(1)
  const pagedItems = items.slice(0, page * PAGE_SIZE)
  const [notifItem, setNotifItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)

  return (
    <section className={`panel ${active ? 'active' : ''}`}>
      <div className="search-row">
        <input
          value={checkSearch}
          onChange={(event) => setCheckSearch(event.target.value)}
          placeholder="🔍 ค้นหารายวิชาที่ส่งตรวจแล้ว"
        />
        <select value={checkFilter} onChange={(event) => setCheckFilter(event.target.value)}>
          <option value="">ทุกสถานะ</option>
          <option value="ส่งข้อสอบปรนัยแล้ว">รอตรวจ</option>
          <option value="ตรวจข้อสอบปรนัยแล้ว">ตรวจแล้ว</option>
        </select>
      </div>

      <div className="card-list">
        {pagedItems.length ? (
          pagedItems.map((item) => {
            const disabled = item.requestStatus !== 'ส่งข้อสอบปรนัยแล้ว'
            return (
              <article className="card card-clickable" key={item.requestId} onClick={() => setDetailItem(item)} style={{ cursor: 'pointer' }}>
                <div className="card-head">
                  <div>
                    <div className="card-title">{item.courseCode}</div>
                    <p className="muted">
                      ประเภท: {item.mcqType || '-'} · จำนวนข้อ: {item.questionCount || '-'} · วันที่ส่งตรวจ: {item.mcqSubmittedAt || '-'} · ประเภทกลุ่มเรียน: {item.sectionType || '-'}
                    </p>
                  </div>
                  <span className={`badge ${disabled ? 'waiting' : 'done'}`}>{item.requestStatus}</span>
                </div>
                {isAdmin && (
                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <button className="primary" type="button" disabled={disabled} onClick={() => markChecked(item.requestId)}>
                      ✓ ตรวจข้อสอบเรียบร้อยแล้ว
                    </button>
                    <button className="secondary" type="button" onClick={() => { console.table(item); console.log('mcqPersonnelName =', JSON.stringify(item.mcqPersonnelName)); console.log('senderEmail =', JSON.stringify(item.senderEmail)); setNotifItem(item); }}>
                      📧 แจ้งผู้ส่งตรวจ
                    </button>
                  </div>
                )}
              </article>
            )
          })
        ) : (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
            ไม่พบข้อมูล
          </div>
        )}
      </div>

      <Pagination items={items} page={page} setPage={setPage} />

      <div className={`status-bar ${status?.type || ''}`}>{status?.message || ''}</div>

      {notifItem && (
        <CheckNotificationPopup
          item={notifItem}
          emailDomain={emailDomain}
          onClose={() => setNotifItem(null)}
          onSend={async (payload) => {
            const success = await sendCheckNotification(payload)
            return success
          }}
        />
      )}

      {detailItem && (
        <div className="popup-backdrop active" onClick={() => setDetailItem(null)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()} style={{ width: 520, maxWidth: '95%', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>📋 รายละเอียดข้อสอบ</h3>
              <button className="secondary" type="button" onClick={() => setDetailItem(null)} style={{ padding: '4px 10px', fontSize: 12 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 14 }}>
              <div><strong>รหัสวิชา:</strong> {detailItem.courseCode}</div>
              <div><strong>ภาคการศึกษา:</strong> {detailItem.term}</div>
              <div><strong>ประเภทการสอบ:</strong> {detailItem.examType}</div>
              <div><strong>รายวิชา:</strong> {detailItem.courseCategory}</div>
              <div><strong>ประเภทกลุ่มเรียน:</strong> {detailItem.sectionType || '-'}</div>
              <div><strong>วิธีการผลิต:</strong> {detailItem.productionMethod}</div>
              <div><strong>การจัดสอบ:</strong> {detailItem.examArrangement}</div>
              <div><strong>วันที่มาส่ง:</strong> {detailItem.submittedDate}</div>
              <div><strong>เบอร์โทร:</strong> {detailItem.contactPhone}</div>
              <div><strong>ผู้ส่ง:</strong> {detailItem.senderName}</div>
              <div><strong>สถานะ:</strong> <span className={detailItem.requestStatus === 'ตรวจข้อสอบปรนัยแล้ว' ? 'badge done' : 'badge waiting'}>{detailItem.requestStatus}</span></div>
              <div><strong>อีเมล:</strong> {detailItem.senderEmail || '-'}</div>
              <div><strong>CC:</strong> {detailItem.ccEmail || '-'}</div>
              <div><strong>ผู้รับข้อสอบ:</strong> {detailItem.receivedBy || '-'}</div>
              <div><strong>จำนวนซอง:</strong> {detailItem.envelopeCount || '-'}</div>
              <div><strong>วันที่รับ:</strong> {detailItem.receivedAt || '-'}</div>
              <div><strong>ประเภท MCQ:</strong> {detailItem.mcqType || '-'}</div>
              <div><strong>จำนวนแผ่น:</strong> {detailItem.sheetCount || (detailItem.sheetCountA && detailItem.sheetCountB ? `ชุด A: ${detailItem.sheetCountA} / ชุด B: ${detailItem.sheetCountB}` : '-')}</div>
              <div><strong>จำนวนข้อ:</strong> {detailItem.questionCount || '-'}</div>
              <div><strong>จำนวนคะแนน:</strong> {detailItem.scoreCount || '-'}</div>
              <div><strong>รูปแบบการสอบ:</strong> {detailItem.examFormat || '-'}</div>
              <div><strong>วันที่ส่งตรวจ:</strong> {detailItem.mcqSubmittedAt || '-'}</div>
              <div><strong>ผู้ส่งตรวจ:</strong> {detailItem.mcqPersonnelName || '-'}</div>
              <div><strong>สถานะ MCQ:</strong> {detailItem.mcqStatus || '-'}</div>
              <div><strong>วันที่ตรวจ:</strong> {detailItem.mcqCheckedAt || '-'}</div>
              <div><strong>ข้อฟรี:</strong> {detailItem.hasFreeQuestion ? `มี (${detailItem.freeQuestionCount} ข้อ)` : 'ไม่มี'}</div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="secondary" type="button" onClick={() => setDetailItem(null)}>ปิด</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default CheckPanel
