import { useMemo, useState } from 'react'
import Pagination, { PAGE_SIZE } from './Pagination'

function DatabasePanel({
  active,
  courseOptions,
  courseSummary,
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
  const [masterSearch, setMasterSearch] = useState('')
  const [newCourse, setNewCourse] = useState('')
  const [newPersonnel, setNewPersonnel] = useState('')
  const [editingCourse, setEditingCourse] = useState('')
  const [editingCourseValue, setEditingCourseValue] = useState('')
  const [editingPersonnel, setEditingPersonnel] = useState('')
  const [editingPersonnelValue, setEditingPersonnelValue] = useState('')
  const [coursePage, setCoursePage] = useState(1)
  const [personnelPage, setPersonnelPage] = useState(1)

  const statusCounts = useMemo(() => {
    const counts = {
      'ส่งข้อสอบแล้ว': 0,
      'รับข้อสอบแล้ว': 0,
      'ส่งข้อสอบปรนัยแล้ว': 0,
      'ตรวจข้อสอบปรนัยแล้ว': 0,
    }
    for (const item of requests) {
      if (counts[item.requestStatus] !== undefined) {
        counts[item.requestStatus]++
      }
    }
    return counts
  }, [requests])

  const statusLabels = {
    'ส่งข้อสอบแล้ว': 'ส่งข้อสอบแล้ว',
    'รับข้อสอบแล้ว': 'รับข้อสอบแล้ว',
    'ส่งข้อสอบปรนัยแล้ว': 'ส่งตรวจแล้ว',
    'ตรวจข้อสอบปรนัยแล้ว': 'ตรวจแล้ว',
  }

  const statusColors = {
    'ส่งข้อสอบแล้ว': '#f59e0b',
    'รับข้อสอบแล้ว': '#3b82f6',
    'ส่งข้อสอบปรนัยแล้ว': '#8b5cf6',
    'ตรวจข้อสอบปรนัยแล้ว': '#22c55e',
  }

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
      <div className="database-section">
        <div className="section-head">
          <div>
            <h2>📊 Dashboard สถานะข้อสอบ</h2>
            <p className="muted">ภาพรวมสถานะข้อสอบทั้งหมด</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {Object.entries(statusCounts).map(([key, count]) => (
            <article className="dashboard-card" key={key} style={{ borderLeft: `4px solid ${statusColors[key]}` }}>
              <div className="dashboard-count" style={{ color: statusColors[key] }}>{count}</div>
              <div className="dashboard-label">{statusLabels[key]}</div>
            </article>
          ))}
        </div>

        <div className="dashboard-bar" style={{ marginTop: 16 }}>
          {Object.entries(statusCounts).map(([key, count]) => {
            const total = requests.length || 1
            const pct = Math.round((count / total) * 100)
            return (
              <div key={key} className="dashboard-bar-segment" style={{ width: `${pct}%`, background: statusColors[key] }} title={`${statusLabels[key]}: ${count} (${pct}%)`}>
                {pct >= 10 ? <span>{count}</span> : null}
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap', fontSize: 12 }}>
          {Object.entries(statusCounts).map(([key, count]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: statusColors[key], display: 'inline-block' }}></span>
              {statusLabels[key]}: {count}
            </div>
          ))}
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
