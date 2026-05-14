import { useEffect } from 'react'
import Field from './Field'
import SelectOptions from './SelectOptions'

function SubmitPanel({
  active,
  courseCategoryOptions,
  courseOptions,
  deleteRequest,
  editRequest,
  examArrangementOptions,
  examTypeOptions,
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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ภาคการศึกษา</th>
              <th>ประเภท</th>
              <th>วันที่มาส่ง</th>
              <th>ผู้ส่ง</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {requests.length ? (
              requests.map((item) => (
                <tr key={item.requestId}>
                  <td><strong>{item.courseCode}</strong></td>
                  <td>{item.term}</td>
                  <td>{item.examType}</td>
                  <td>{item.submittedDate}</td>
                  <td>{item.senderName}</td>
                  <td>
                    <span className={item.requestStatus === 'ตรวจข้อสอบปรนัยแล้ว' ? 'badge done' : 'badge waiting'}>
                      {item.requestStatus}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button className="secondary" type="button" onClick={() => editRequest(item.requestId)}>
                      แก้ไข
                    </button>
                    <button className="danger" type="button" onClick={() => deleteRequest(item.requestId)}>
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  ยังไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
