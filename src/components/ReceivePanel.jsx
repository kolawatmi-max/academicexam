import { useState } from 'react'
import Field from './Field'
import Pagination, { PAGE_SIZE } from './Pagination'

function ReceivePanel({
  active,
  items,
  isAdmin,
  personnelOptions,
  receiveFilter,
  receiveSearch,
  saveReceive,
  saveReceiveEdit,
  setReceiveFilter,
  setReceiveSearch,
  status,
  updateReceiveDraft,
  receiveDrafts,
}) {
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const pagedItems = items.slice(0, page * PAGE_SIZE)

  function handleEdit(item) {
    setEditingId(item.requestId)
    // Pre-fill draft with existing data
    updateReceiveDraft(item.requestId, 'receivedBy', item.receivedBy || '')
    updateReceiveDraft(item.requestId, 'envelopeCount', item.envelopeCount || '')
  }

  function handleSaveEdit(requestId) {
    saveReceiveEdit(requestId)
    setEditingId(null)
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  return (
    <section className={`panel ${active ? 'active' : ''}`}>
      <div className="search-row">
        <input
          value={receiveSearch}
          onChange={(event) => setReceiveSearch(event.target.value)}
          placeholder="🔍 ค้นหารายวิชา หรือชื่อผู้ส่ง"
        />
        <select value={receiveFilter} onChange={(event) => setReceiveFilter(event.target.value)}>
          <option value="">ทุกสถานะ</option>
          <option value="ส่งข้อสอบแล้ว">ยังไม่ได้รับข้อสอบ</option>
          <option value="รับข้อสอบแล้ว">รับข้อสอบแล้ว</option>
          <option value="ส่งข้อสอบปรนัยแล้ว">ส่งตรวจแล้ว</option>
          <option value="ตรวจข้อสอบปรนัยแล้ว">ตรวจแล้ว</option>
        </select>
      </div>

      <div className="card-list">
        {pagedItems.length ? (
          pagedItems.map((item) => {
            const draft = receiveDrafts[item.requestId] || {
              receivedBy: item.receivedBy,
              envelopeCount: item.envelopeCount,
            }
            const statusDisabled = item.requestStatus !== 'ส่งข้อสอบแล้ว'
            const isEditing = editingId === item.requestId
            const formDisabled = !isAdmin || (statusDisabled && !isEditing)

            return (
              <article className="card" key={item.requestId}>
                <div className="card-head">
                  <div>
                    <div className="card-title">{item.courseCode}</div>
                    <p className="muted">
                      ผู้ส่ง: {item.senderName} · โทร: {item.contactPhone} · ประเภทการสอบ: {item.examType || '-'} · ประเภทกลุ่มเรียน: {item.sectionType || '-'}
                    </p>
                  </div>
                  <span className={`badge ${statusDisabled ? 'waiting' : 'done'}`}>{item.requestStatus}</span>
                </div>
                <div className="grid">
                  <Field label="ชื่อผู้รับข้อสอบ" wide>
                    <input
                      list="personnel-list-receive"
                      value={draft.receivedBy}
                      disabled={formDisabled}
                      onChange={(event) => updateReceiveDraft(item.requestId, 'receivedBy', event.target.value)}
                      placeholder="พิมพ์เพื่อค้นหารายชื่อ"
                    />
                  </Field>
                  <Field label="จำนวนซองข้อสอบที่รับ">
                    <input
                      type="number"
                      value={draft.envelopeCount}
                      disabled={formDisabled}
                      onChange={(event) => updateReceiveDraft(item.requestId, 'envelopeCount', event.target.value)}
                    />
                  </Field>
                </div>
                {isAdmin && (
                  <div className="actions">
                    {isEditing ? (
                      <>
                        <button className="primary" type="button" onClick={() => handleSaveEdit(item.requestId)}>
                          💾 บันทึกแก้ไข
                        </button>
                        <button className="secondary" type="button" onClick={handleCancelEdit}>
                          ยกเลิก
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="primary" type="button" disabled={statusDisabled} onClick={() => saveReceive(item.requestId)}>
                          📥 บันทึกรับข้อสอบ
                        </button>
                        <button className="secondary" type="button" onClick={() => handleEdit(item)}>
                          ✏️ แก้ไข
                        </button>
                      </>
                    )}
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

      <datalist id="personnel-list-receive">
        {personnelOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </section>
  )
}

export default ReceivePanel
