import { useState } from 'react'
import Field from './Field'
import SelectOptions from './SelectOptions'
import Pagination, { PAGE_SIZE } from './Pagination'

function McqPanel({
  active,
  emailDomain,
  examFormatOptions,
  items,
  isAdmin,
  mcqDrafts,
  mcqFilter,
  mcqSearch,
  mcqTypeOptions,
  personnelOptions,
  saveMcq,
  saveMcqEdit,
  setMcqFilter,
  setMcqSearch,
  status,
  updateMcqDraft,
}) {
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const pagedItems = items.slice(0, page * PAGE_SIZE)

  function handleEdit(item) {
    setEditingId(item.requestId)
    updateMcqDraft(item.requestId, 'mcqType', item.mcqType || '')
    updateMcqDraft(item.requestId, 'sheetCount', item.sheetCount || '')
    updateMcqDraft(item.requestId, 'sheetCountA', item.sheetCountA || '')
    updateMcqDraft(item.requestId, 'sheetCountB', item.sheetCountB || '')
    updateMcqDraft(item.requestId, 'questionCount', item.questionCount || '')
    updateMcqDraft(item.requestId, 'scoreCount', item.scoreCount || '')
    updateMcqDraft(item.requestId, 'hasFreeQuestion', item.hasFreeQuestion || false)
    updateMcqDraft(item.requestId, 'freeQuestionCount', item.freeQuestionCount || '')
    updateMcqDraft(item.requestId, 'examFormat', item.examFormat || '')
    updateMcqDraft(item.requestId, 'submittedDate', item.mcqSubmittedAt || '')
    updateMcqDraft(item.requestId, 'mcqPersonnelName', item.mcqPersonnelName || '')
    updateMcqDraft(item.requestId, 'senderEmail', item.senderEmail ? item.senderEmail.replace(emailDomain, '') : '')
    updateMcqDraft(item.requestId, 'ccEmail', item.ccEmail ? item.ccEmail.replace(emailDomain, '') : '')
    updateMcqDraft(item.requestId, '_expectedUpdatedAt', item.updatedAt || '')
  }

  function handleSaveEdit(requestId) {
    saveMcqEdit(requestId)
    setEditingId(null)
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  return (
    <section className={`panel ${active ? 'active' : ''}`}>
      <div className="search-row">
        <input
          value={mcqSearch}
          onChange={(event) => setMcqSearch(event.target.value)}
          placeholder="🔍 ค้นหารายวิชาที่รับข้อสอบแล้ว"
        />
        <select value={mcqFilter} onChange={(event) => setMcqFilter(event.target.value)}>
          <option value="">ทุกสถานะ</option>
          <option value="รับข้อสอบแล้ว">พร้อมส่งตรวจ</option>
          <option value="ส่งข้อสอบปรนัยแล้ว">ส่งตรวจแล้ว</option>
          <option value="ตรวจข้อสอบปรนัยแล้ว">ตรวจแล้ว</option>
        </select>
      </div>

      <div className="card-list">
        {pagedItems.length ? (
          pagedItems.map((item) => {
            const draft = mcqDrafts[item.requestId] || {
              mcqType: item.mcqType,
              sheetCount: item.sheetCount,
              sheetCountA: item.sheetCountA || '',
              sheetCountB: item.sheetCountB || '',
              questionCount: item.questionCount,
              scoreCount: item.scoreCount,
              hasFreeQuestion: item.hasFreeQuestion,
              freeQuestionCount: item.freeQuestionCount,
              examFormat: item.examFormat,
              submittedDate: item.mcqSubmittedAt,
              mcqPersonnelName: item.mcqPersonnelName,
              senderEmail: item.senderEmail.replace(emailDomain, ''),
              ccEmail: item.ccEmail ? item.ccEmail.replace(emailDomain, '') : '',
            }
            const statusDisabled = item.requestStatus !== 'รับข้อสอบแล้ว'
            const isEditing = editingId === item.requestId
            const formDisabled = !isAdmin || (statusDisabled && !isEditing)

            return (
              <article className="card" key={item.requestId}>
                <div className="card-head">
                  <div>
                    <div className="card-title">{item.courseCode}</div>
                    <p className="muted">
                      ผู้รับ: {item.receivedBy || '-'} · ซอง: {item.envelopeCount || '-'} · MCQ: {item.mcqStatus} · ประเภทกลุ่มเรียน: {item.sectionType || '-'}
                    </p>
                  </div>
                  <span className={`badge ${statusDisabled ? 'waiting' : 'done'}`}>{item.requestStatus}</span>
                </div>

                <div className="grid">
                  <Field label="ประเภทข้อสอบ">
                    <SelectOptions
                      options={mcqTypeOptions}
                      value={draft.mcqType}
                      disabled={formDisabled}
                      onChange={(value) => updateMcqDraft(item.requestId, 'mcqType', value)}
                    />
                  </Field>
                  {draft.mcqType === 'ชุด A และชุด B' ? (
                    <>
                      <Field label="จำนวนแผ่น ชุด A">
                        <input
                          type="number"
                          value={draft.sheetCountA || ''}
                          disabled={formDisabled}
                          onChange={(event) => updateMcqDraft(item.requestId, 'sheetCountA', event.target.value)}
                        />
                      </Field>
                      <Field label="จำนวนแผ่น ชุด B">
                        <input
                          type="number"
                          value={draft.sheetCountB || ''}
                          disabled={formDisabled}
                          onChange={(event) => updateMcqDraft(item.requestId, 'sheetCountB', event.target.value)}
                        />
                      </Field>
                    </>
                  ) : (
                    <Field label="จำนวนแผ่น">
                      <input
                        type="number"
                        value={draft.sheetCount}
                        disabled={formDisabled}
                        onChange={(event) => updateMcqDraft(item.requestId, 'sheetCount', event.target.value)}
                      />
                    </Field>
                  )}
                  <Field label="จำนวนข้อ">
                    <input
                      type="number"
                      value={draft.questionCount}
                      disabled={formDisabled}
                      onChange={(event) => updateMcqDraft(item.requestId, 'questionCount', event.target.value)}
                    />
                  </Field>
                  <Field label="จำนวนคะแนน">
                    <input
                      type="number"
                      value={draft.scoreCount}
                      disabled={formDisabled}
                      onChange={(event) => updateMcqDraft(item.requestId, 'scoreCount', event.target.value)}
                    />
                  </Field>
                  <Field label="รูปแบบการสอบ">
                    <SelectOptions
                      options={examFormatOptions}
                      value={draft.examFormat}
                      disabled={formDisabled}
                      onChange={(value) => updateMcqDraft(item.requestId, 'examFormat', value)}
                    />
                  </Field>
                  <Field label="วันที่มาส่ง">
                    <input
                      type="date"
                      value={draft.submittedDate}
                      disabled={formDisabled}
                      onChange={(event) => updateMcqDraft(item.requestId, 'submittedDate', event.target.value)}
                    />
                  </Field>
                  <Field label="ชื่อผู้ส่งตรวจ">
                    <input
                      list="personnel-list-mcq"
                      value={draft.mcqPersonnelName}
                      disabled={formDisabled}
                      onChange={(event) => updateMcqDraft(item.requestId, 'mcqPersonnelName', event.target.value)}
                      placeholder="พิมพ์เพื่อค้นหารายชื่อ"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      value={draft.senderEmail}
                      disabled={formDisabled}
                      onChange={(event) => {
                        const cleaned = event.target.value.replace(/[^\x00-\x7F]/g, '')
                        updateMcqDraft(item.requestId, 'senderEmail', cleaned)
                      }}
                      placeholder="username@spu.ac.th"
                    />
                  </Field>
                  <Field label="CC Email">
                    <input
                      value={draft.ccEmail}
                      disabled={formDisabled}
                      onChange={(event) => {
                        const cleaned = event.target.value.replace(/[^\x00-\x7F]/g, '')
                        updateMcqDraft(item.requestId, 'ccEmail', cleaned)
                      }}
                      placeholder="username@spu.ac.th (ไม่บังคับ)"
                    />
                  </Field>
                  <Field label="มีข้อฟรี" full>
                    <div className="inline">
                      <input
                        type="checkbox"
                        checked={Boolean(draft.hasFreeQuestion)}
                        disabled={formDisabled}
                        onChange={(event) => updateMcqDraft(item.requestId, 'hasFreeQuestion', event.target.checked)}
                      />
                      <input
                        type="number"
                        value={draft.freeQuestionCount}
                        disabled={formDisabled || !draft.hasFreeQuestion}
                        onChange={(event) => updateMcqDraft(item.requestId, 'freeQuestionCount', event.target.value)}
                        placeholder="จำนวนข้อฟรี"
                      />
                    </div>
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
                        <button className="primary" type="button" disabled={statusDisabled} onClick={() => saveMcq(item.requestId)}>
                          📤 บันทึกส่งตรวจข้อสอบปรนัย
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

      <datalist id="personnel-list-mcq">
        {personnelOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </section>
  )
}

export default McqPanel
