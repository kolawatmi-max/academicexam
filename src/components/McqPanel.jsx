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
  setMcqFilter,
  setMcqSearch,
  status,
  updateMcqDraft,
}) {
  const [page, setPage] = useState(1)
  const pagedItems = items.slice(0, page * PAGE_SIZE)

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
              questionCount: item.questionCount,
              scoreCount: item.scoreCount,
              hasFreeQuestion: item.hasFreeQuestion,
              freeQuestionCount: item.freeQuestionCount,
              examFormat: item.examFormat,
              submittedDate: item.mcqSubmittedAt,
              mcqPersonnelName: item.mcqPersonnelName,
              senderEmail: item.senderEmail.replace(emailDomain, ''),
            }
            const statusDisabled = item.requestStatus !== 'รับข้อสอบแล้ว'
            const formDisabled = !isAdmin || statusDisabled

            return (
              <article className="card" key={item.requestId}>
                <div className="card-head">
                  <div>
                    <div className="card-title">{item.courseCode}</div>
                    <p className="muted">
                      ผู้รับ: {item.receivedBy || '-'} · ซอง: {item.envelopeCount || '-'} · MCQ: {item.mcqStatus}
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
                  <Field label="จำนวนแผ่น">
                    <input
                      type="number"
                      value={draft.sheetCount}
                      disabled={formDisabled}
                      onChange={(event) => updateMcqDraft(item.requestId, 'sheetCount', event.target.value)}
                    />
                  </Field>
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
                  <Field label="รายชื่อบุคลากร">
                    <input
                      list="personnel-list-mcq"
                      value={draft.mcqPersonnelName}
                      disabled={formDisabled}
                      onChange={(event) => updateMcqDraft(item.requestId, 'mcqPersonnelName', event.target.value)}
                      placeholder="พิมพ์เพื่อค้นหารายชื่อ"
                    />
                  </Field>
                  <Field label="Email">
                    <div className="inline">
                      <input
                        value={draft.senderEmail}
                        disabled={formDisabled}
                        onChange={(event) => updateMcqDraft(item.requestId, 'senderEmail', event.target.value)}
                        placeholder="username"
                      />
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{emailDomain}</span>
                    </div>
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
                    <button className="primary" type="button" disabled={statusDisabled} onClick={() => saveMcq(item.requestId)}>
                      📤 บันทึกส่งตรวจข้อสอบปรนัย
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

      <datalist id="personnel-list-mcq">
        {personnelOptions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </section>
  )
}

export default McqPanel
