import { useState } from 'react'
import Pagination, { PAGE_SIZE } from './Pagination'
import CheckNotificationPopup from './CheckNotificationPopup'

function CheckPanel({ active, checkFilter, checkSearch, items, isAdmin, markChecked, sendCheckNotification, setCheckFilter, setCheckSearch, status, emailDomain }) {
  const [page, setPage] = useState(1)
  const pagedItems = items.slice(0, page * PAGE_SIZE)
  const [notifItem, setNotifItem] = useState(null)

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
              <article className="card" key={item.requestId}>
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
                  <div className="actions">
                    <button className="primary" type="button" disabled={disabled} onClick={() => markChecked(item.requestId)}>
                      ✓ ตรวจข้อสอบเรียบร้อยแล้ว
                    </button>
                    <button className="secondary" type="button" onClick={() => setNotifItem(item)}>
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
    </section>
  )
}

export default CheckPanel
