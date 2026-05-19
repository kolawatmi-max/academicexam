import { useState } from 'react'
import Pagination, { PAGE_SIZE } from './Pagination'

function DatabasePanel({
  active,
  courseOptions,
  createCourse,
  createPersonnel,
  deleteCourse,
  deletePersonnel,
  deleteRequest,
  editRequest,
  personnelOptions,
  requests,
  status,
  updateCourse,
  updatePersonnel,
}) {
  const [requestSearch, setRequestSearch] = useState('')
  const [masterSearch, setMasterSearch] = useState('')
  const [newCourse, setNewCourse] = useState('')
  const [newPersonnel, setNewPersonnel] = useState('')
  const [editingCourse, setEditingCourse] = useState('')
  const [editingCourseValue, setEditingCourseValue] = useState('')
  const [editingPersonnel, setEditingPersonnel] = useState('')
  const [editingPersonnelValue, setEditingPersonnelValue] = useState('')
  const [requestPage, setRequestPage] = useState(1)
  const [coursePage, setCoursePage] = useState(1)
  const [personnelPage, setPersonnelPage] = useState(1)

  const filteredRequests = requests.filter((item) => {
    const query = requestSearch.trim().toLowerCase()
    if (!query) return true
    return `${item.courseCode} ${item.senderName} ${item.term} ${item.requestStatus}`.toLowerCase().includes(query)
  })

  const filteredCourses = courseOptions.filter((item) => {
    const query = masterSearch.trim().toLowerCase()
    if (!query) return true
    return item.toLowerCase().includes(query)
  })

  const filteredPersonnel = personnelOptions.filter((item) => {
    const query = masterSearch.trim().toLowerCase()
    if (!query) return true
    return item.toLowerCase().includes(query)
  })

  const pagedRequests = filteredRequests.slice(0, requestPage * PAGE_SIZE)
  const pagedCourses = filteredCourses.slice(0, coursePage * PAGE_SIZE)
  const pagedPersonnel = filteredPersonnel.slice(0, personnelPage * PAGE_SIZE)

  async function handleCreateCourse() {
    await createCourse(newCourse)
    setNewCourse('')
  }

  async function handleCreatePersonnel() {
    await createPersonnel(newPersonnel)
    setNewPersonnel('')
  }

  async function handleUpdateCourse() {
    await updateCourse(editingCourse, editingCourseValue)
    setEditingCourse('')
    setEditingCourseValue('')
  }

  async function handleUpdatePersonnel() {
    await updatePersonnel(editingPersonnel, editingPersonnelValue)
    setEditingPersonnel('')
    setEditingPersonnelValue('')
  }

  return (
    <section className={`panel ${active ? 'active' : ''}`}>
      <div className="database-summary">
        <article className="summary-card">
          <span className="summary-label">คำขอสอบ</span>
          <strong>{requests.length}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">รายวิชา</span>
          <strong>{courseOptions.length}</strong>
        </article>
        <article className="summary-card">
          <span className="summary-label">บุคลากร</span>
          <strong>{personnelOptions.length}</strong>
        </article>
      </div>

      <div className="database-section">
        <div className="section-head">
          <div>
            <h2>ฐานข้อมูลคำขอสอบ</h2>
            <p className="muted">ดึงจาก Google Sheet ชีต ExamRequests</p>
          </div>
          <input
            value={requestSearch}
            onChange={(event) => setRequestSearch(event.target.value)}
            placeholder="ค้นหารหัสวิชา ผู้ส่ง ภาคการศึกษา หรือสถานะ"
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>รหัสวิชา</th>
                <th>ภาคการศึกษา</th>
                <th>ผู้ส่ง</th>
                <th>ผู้รับ</th>
                <th>สถานะ</th>
                <th>MCQ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pagedRequests.length ? (
                pagedRequests.map((item) => (
                  <tr key={item.requestId}>
                    <td><strong>{item.courseCode}</strong></td>
                    <td>{item.term}</td>
                    <td>{item.senderName}</td>
                    <td>{item.receivedBy || '-'}</td>
                    <td>
                      <span className={item.requestStatus === 'ตรวจข้อสอบปรนัยแล้ว' ? 'badge done' : 'badge waiting'}>
                        {item.requestStatus}
                      </span>
                    </td>
                    <td>{item.mcqStatus || '-'}</td>
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
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination items={filteredRequests} page={requestPage} setPage={setRequestPage} />
        </div>
      </div>

      <div className="database-section">
        <div className="section-head">
          <div>
            <h2>ข้อมูลอ้างอิงจาก Google Sheet</h2>
            <p className="muted">รายวิชาและรายชื่อบุคลากรจาก master sheet พร้อม CRUD</p>
          </div>
          <input
            value={masterSearch}
            onChange={(event) => setMasterSearch(event.target.value)}
            placeholder="ค้นหารายวิชา หรือรายชื่อบุคลากร"
          />
        </div>

        <div className="database-masters">
          <article className="card">
            <div className="card-head">
              <div className="card-title">รายวิชา</div>
              <span className="badge done">{filteredCourses.length} รายการ</span>
            </div>
            <div className="master-form">
              <input value={newCourse} onChange={(event) => setNewCourse(event.target.value)} placeholder="เพิ่มรายวิชาใหม่" />
              <button className="primary" type="button" onClick={handleCreateCourse}>
                เพิ่ม
              </button>
            </div>
            <div className="master-list">
              {pagedCourses.length ? (
                pagedCourses.map((item) => {
                  const isEditing = editingCourse === item
                  return (
                    <div className="master-row" key={item}>
                      {isEditing ? (
                        <>
                          <input value={editingCourseValue} onChange={(event) => setEditingCourseValue(event.target.value)} />
                          <div className="master-actions">
                            <button className="primary" type="button" onClick={handleUpdateCourse}>
                              บันทึก
                            </button>
                            <button className="secondary" type="button" onClick={() => setEditingCourse('')}>
                              ยกเลิก
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span>{item}</span>
                          <div className="master-actions">
                            <button
                              className="secondary"
                              type="button"
                              onClick={() => {
                                setEditingCourse(item)
                                setEditingCourseValue(item)
                              }}
                            >
                              แก้ไข
                            </button>
                            <button className="danger" type="button" onClick={() => deleteCourse(item)}>
                              ลบ
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="master-row" style={{ justifyContent: 'center', color: 'var(--text-muted)' }}>
                  ไม่พบข้อมูล
                </div>
              )}
            </div>
            <Pagination items={filteredCourses} page={coursePage} setPage={setCoursePage} />
          </article>

          <article className="card">
            <div className="card-head">
              <div className="card-title">บุคลากร</div>
              <span className="badge done">{filteredPersonnel.length} รายการ</span>
            </div>
            <div className="master-form">
              <input value={newPersonnel} onChange={(event) => setNewPersonnel(event.target.value)} placeholder="เพิ่มรายชื่อบุคลากรใหม่" />
              <button className="primary" type="button" onClick={handleCreatePersonnel}>
                เพิ่ม
              </button>
            </div>
            <div className="master-list">
              {pagedPersonnel.length ? (
                pagedPersonnel.map((item) => {
                  const isEditing = editingPersonnel === item
                  return (
                    <div className="master-row" key={item}>
                      {isEditing ? (
                        <>
                          <input value={editingPersonnelValue} onChange={(event) => setEditingPersonnelValue(event.target.value)} />
                          <div className="master-actions">
                            <button className="primary" type="button" onClick={handleUpdatePersonnel}>
                              บันทึก
                            </button>
                            <button className="secondary" type="button" onClick={() => setEditingPersonnel('')}>
                              ยกเลิก
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span>{item}</span>
                          <div className="master-actions">
                            <button
                              className="secondary"
                              type="button"
                              onClick={() => {
                                setEditingPersonnel(item)
                                setEditingPersonnelValue(item)
                              }}
                            >
                              แก้ไข
                            </button>
                            <button className="danger" type="button" onClick={() => deletePersonnel(item)}>
                              ลบ
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="master-row" style={{ justifyContent: 'center', color: 'var(--text-muted)' }}>
                  ไม่พบข้อมูล
                </div>
              )}
            </div>
            <Pagination items={filteredPersonnel} page={personnelPage} setPage={setPersonnelPage} />
          </article>
        </div>
        <div className={`status-bar ${status?.type || ''}`}>{status?.message || ''}</div>
      </div>
    </section>
  )
}

export default DatabasePanel
