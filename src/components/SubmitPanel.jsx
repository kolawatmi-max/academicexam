import { useEffect, useMemo, useState } from 'react'
import Field from './Field'
import SelectOptions from './SelectOptions'
import Pagination, { PAGE_SIZE } from './Pagination'

function SubmitPanel({
  active,
  courseCategoryOptions,
  courseOptions,
  deleteRequest,
  editRequest,
  examArrangementOptions,
  examTypeOptions,
  isAdmin,
  onSave,
  onUpdateField,
  productionMethodOptions,
  requests,
  resetSubmitForm,
  sectionTypeOptions,
  status,
  submitForm,
  termOptions,
  editingId,
  personnelOptions,
}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [detailItem, setDetailItem] = useState(null)

  const filteredRequests = useMemo(
    () =>
      requests.filter((item) => {
        const query = search.trim().toLowerCase()
        const matchesQuery = !query || `${item.courseCode} ${item.senderName}`.toLowerCase().includes(query)
        const matchesStatus = !filter || item.requestStatus === filter
        return matchesQuery && matchesStatus
      }),
    [filter, search, requests],
  )

  const pagedRequests = filteredRequests.slice(0, page * PAGE_SIZE)

  useEffect(() => {
    if (!active) return
  }, [active])

  return (
    <section className={`panel ${active ? 'active' : ''}`}>
      <div className="grid">
        <Field label="รหัสวิชา" wide>
          <input
            list="course-list-submit"
            value={submitForm.courseCode}
            onChange={(event) => onUpdateField('courseCode', event.target.value)}
            placeholder="พิมพ์เพื่อค้นหารหัสวิชา"
          />
        </Field>
        <Field label="ภาคการศึกษา">
          <SelectOptions options={termOptions} value={submitForm.term} onChange={(value) => onUpdateField('term', value)} />
        </Field>
        <Field label="ประเภทการสอบ">
          <SelectOptions
            options={examTypeOptions}
            value={submitForm.examType}
            onChange={(value) => onUpdateField('examType', value)}
          />
        </Field>
        <Field label="รายวิชา">
          <SelectOptions
            options={courseCategoryOptions}
            value={submitForm.courseCategory}
            onChange={(value) => onUpdateField('courseCategory', value)}
          />
        </Field>
        <Field label="ประเภทกลุ่มเรียน">
          <SelectOptions
            options={sectionTypeOptions}
            value={submitForm.sectionType}
            onChange={(value) => onUpdateField('sectionType', value)}
          />
        </Field>
        <Field label="วิธีการผลิต">
          <SelectOptions
            options={productionMethodOptions}
            value={submitForm.productionMethod}
            onChange={(value) => onUpdateField('productionMethod', value)}
          />
        </Field>
        <Field label="การจัดสอบ">
          <SelectOptions
            options={examArrangementOptions}
            value={submitForm.examArrangement}
            onChange={(value) => onUpdateField('examArrangement', value)}
          />
        </Field>
        <Field label="วันที่มาส่ง">
          <input
            type="date"
            value={submitForm.submittedDate}
            onChange={(event) => onUpdateField('submittedDate', event.target.value)}
          />
        </Field>
        <Field label="เบอร์โทรติดต่อกลับ">
          <input value={submitForm.contactPhone} onChange={(event) => onUpdateField('contactPhone', event.target.value)} />
        </Field>
        <Field label="ชื่อผู้ส่งข้อสอบ" wide>
          <input
            list="personnel-list-submit"
            value={submitForm.senderName}
            onChange={(event) => onUpdateField('senderName', event.target.value)}
            placeholder="พิมพ์เพื่อค้นหารายชื่อ"
          />
        </Field>
      </div>

      <div className="actions">
        <button className="primary" type="button" onClick={onSave}>
          {editingId ? '💾 บันทึกการแก้ไข' : '➕ บันทึกข้อมูลส่งข้อสอบ'}
        </button>
        {editingId ? (
          <button className="secondary" type="button" onClick={resetSubmitForm}>
            ✕ ยกเลิกการแก้ไข
          </button>
        ) : null}
      </div>

      <div className={`status-bar ${status?.type || ''}`}>{status?.message || ''}</div>

      <div className="search-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ค้นหารายวิชา หรือชื่อผู้ส่ง"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">ทุกสถานะ</option>
          <option value="ส่งข้อสอบแล้ว">ส่งข้อสอบแล้ว</option>
          <option value="รับข้อสอบแล้ว">รับข้อสอบแล้ว</option>
          <option value="ส่งข้อสอบปรนัยแล้ว">ส่งตรวจแล้ว</option>
          <option value="ตรวจข้อสอบปรนัยแล้ว">ตรวจแล้ว</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ภาคการศึกษา</th>
              <th>ประเภท</th>
              <th>ประเภทกลุ่มเรียน</th>
              <th>วันที่มาส่ง</th>
              <th>ผู้ส่ง</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pagedRequests.length ? (
              pagedRequests.map((item) => (
                <tr
                  key={item.requestId}
                  onClick={() => setDetailItem(item)}
                  style={{ cursor: 'pointer' }}
                  className="clickable-row"
                >
                  <td><strong>{item.courseCode}</strong></td>
                  <td>{item.term}</td>
                  <td>{item.examType}</td>
                  <td>{item.sectionType || '-'}</td>
                  <td>{item.submittedDate}</td>
                  <td>{item.senderName}</td>
                  <td>
                    <span className={item.requestStatus === 'ตรวจข้อสอบปรนัยแล้ว' ? 'badge done' : 'badge waiting'}>
                      {item.requestStatus}
                    </span>
                  </td>
                  <td className="table-actions" onClick={(e) => e.stopPropagation()}>
                    {isAdmin && (
                      <>
                        <button className="secondary" type="button" onClick={() => editRequest(item.requestId)}>
                          แก้ไข
                        </button>
                        <button className="danger" type="button" onClick={() => deleteRequest(item.requestId)}>
                          ลบ
                        </button>
                      </>
                    )}
                    {!isAdmin && <span className="muted" style={{ fontSize: 12 }}>—</span>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination items={filteredRequests} page={page} setPage={setPage} />
      </div>

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

      <datalist id="course-list-submit">
        {courseOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <datalist id="personnel-list-submit">
        {personnelOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </section>
  )
}

export default SubmitPanel
