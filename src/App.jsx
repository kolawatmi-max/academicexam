import './App.css'
import { useAdmin } from './contexts/AdminContext'
import CheckPanel from './components/CheckPanel'
import DatabasePanel from './components/DatabasePanel'
import Hero from './components/Hero'
import McqPanel from './components/McqPanel'
import ReceivePanel from './components/ReceivePanel'
import SubmitPanel from './components/SubmitPanel'
import SuccessPopup from './components/SuccessPopup'
import TabButton from './components/TabButton'
import { defaultConfig } from './data/constants'
import useExamWorkflow from './hooks/useExamWorkflow'
import useDarkMode from './hooks/useDarkMode'

function App() {
  const { isAdmin, requestLogin, logout } = useAdmin()
  const { isDark, toggleDark } = useDarkMode()
  const {
    activeTab,
    config,
    courseOptions,
    createCourse,
    createPersonnel,
    checkFilter,
    checkItems,
    checkSearch,
    closePopup,
    courseSummary,
    deleteCourse,
    deleteExamRequest,
    deletePersonnel,
    editRequest,
    editingId,
    markChecked,
    mcqDrafts,
    mcqFilter,
    mcqItems,
    mcqSearch,
    isLoading,
    loadError,
    personnelOptions,
    popupMessage,
    popupOpen,
    receiveDrafts,
    receiveFilter,
    receiveItems,
    receiveSearch,
    requests,
    resetSubmitForm,
    saveMcq,
    saveMcqEdit,
    saveReceive,
    saveReceiveEdit,
    saveRequest,
    sendCheckNotification,
    setActiveTab,
    setCheckFilter,
    setCheckSearch,
    setMcqFilter,
    setMcqSearch,
    setReceiveFilter,
    setReceiveSearch,
    statusByPanel,
    submitForm,
    updateCourse,
    updateMcqDraft,
    updatePersonnel,
    updateReceiveDraft,
    updateSubmitForm,
  } = useExamWorkflow()

  return (
    <div className="shell">
      <Hero />

      {/* Admin bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, margin: '8px 0' }}>
        <button className="secondary" type="button" onClick={toggleDark} style={{ padding: '5px 12px', fontSize: 12 }}>
          {isDark ? '☀️ สว่าง' : '🌙 มืด'}
        </button>
        {isAdmin ? (
          <>
            <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>🔓 Admin</span>
            <button className="secondary" type="button" onClick={logout} style={{ padding: '5px 12px', fontSize: 12 }}>
              ออกจากระบบ
            </button>
          </>
        ) : (
          <button className="secondary" type="button" onClick={requestLogin} style={{ padding: '5px 12px', fontSize: 12 }}>
            🔐 เข้าสู่ระบบ Admin
          </button>
        )}
      </div>

      {loadError ? <section className="notice error">{loadError}</section> : null}
      {isLoading ? <section className="notice">กำลังโหลดข้อมูล...</section> : null}

      <div className="tabs">
        <TabButton active={activeTab} tab="submit" setActiveTab={setActiveTab}>
          1. ส่งข้อสอบ
        </TabButton>
        <TabButton active={activeTab} tab="receive" setActiveTab={setActiveTab}>
          2. รับข้อสอบ
        </TabButton>
        <TabButton active={activeTab} tab="mcq" setActiveTab={setActiveTab}>
          3. ส่งตรวจข้อสอบปรนัย
        </TabButton>
        <TabButton active={activeTab} tab="check" setActiveTab={setActiveTab}>
          4. สถานะตรวจข้อสอบปรนัย
        </TabButton>
        {isAdmin && (
          <TabButton active={activeTab} tab="database" setActiveTab={setActiveTab}>
            5. Database
          </TabButton>
        )}
      </div>

      <SubmitPanel
        active={activeTab === 'submit'}
        courseCategoryOptions={config.courseCategoryOptions || defaultConfig.courseCategoryOptions}
        courseOptions={courseOptions}
        deleteRequest={deleteExamRequest}
        editRequest={editRequest}
        editingId={editingId}
        examArrangementOptions={config.examArrangementOptions || defaultConfig.examArrangementOptions}
        examTypeOptions={config.examTypeOptions || defaultConfig.examTypeOptions}
        isAdmin={isAdmin}
        onSave={saveRequest}
        onUpdateField={updateSubmitForm}
        personnelOptions={personnelOptions}
        productionMethodOptions={config.productionMethodOptions || defaultConfig.productionMethodOptions}
        requests={requests}
        resetSubmitForm={resetSubmitForm}
        sectionTypeOptions={config.sectionTypeOptions || defaultConfig.sectionTypeOptions}
        status={statusByPanel.submit}
        submitForm={submitForm}
        termOptions={config.termOptions || defaultConfig.termOptions}
      />

      <ReceivePanel
        active={activeTab === 'receive'}
        items={receiveItems}
        personnelOptions={personnelOptions}
        receiveDrafts={receiveDrafts}
        receiveFilter={receiveFilter}
        receiveSearch={receiveSearch}
        saveReceive={saveReceive}
        saveReceiveEdit={saveReceiveEdit}
        setReceiveFilter={setReceiveFilter}
        setReceiveSearch={setReceiveSearch}
        status={statusByPanel.receive}
        updateReceiveDraft={updateReceiveDraft}
        isAdmin={isAdmin}
      />

      <McqPanel
        active={activeTab === 'mcq'}
        emailDomain={config.emailDomain || defaultConfig.emailDomain}
        examFormatOptions={config.examFormatOptions || defaultConfig.examFormatOptions}
        items={mcqItems}
        mcqDrafts={mcqDrafts}
        mcqFilter={mcqFilter}
        mcqSearch={mcqSearch}
        mcqTypeOptions={config.mcqTypeOptions || defaultConfig.mcqTypeOptions}
        personnelOptions={personnelOptions}
        saveMcq={saveMcq}
        saveMcqEdit={saveMcqEdit}
        setMcqFilter={setMcqFilter}
        setMcqSearch={setMcqSearch}
        status={statusByPanel.mcq}
        updateMcqDraft={updateMcqDraft}
        isAdmin={isAdmin}
      />

      <CheckPanel
        active={activeTab === 'check'}
        checkFilter={checkFilter}
        checkSearch={checkSearch}
        items={checkItems}
        markChecked={markChecked}
        sendCheckNotification={sendCheckNotification}
        setCheckFilter={setCheckFilter}
        setCheckSearch={setCheckSearch}
        status={statusByPanel.check}
        isAdmin={isAdmin}
        emailDomain={config.emailDomain || defaultConfig.emailDomain}
      />

      <DatabasePanel
        active={activeTab === 'database'}
        courseOptions={courseOptions}
        courseSummary={courseSummary}
        createCourse={createCourse}
        createPersonnel={createPersonnel}
        deleteCourse={deleteCourse}
        deletePersonnel={deletePersonnel}
        deleteRequest={deleteExamRequest}
        editRequest={editRequest}
        personnelOptions={personnelOptions}
        requests={requests}
        status={statusByPanel.database}
        updateCourse={updateCourse}
        updatePersonnel={updatePersonnel}
      />

      <SuccessPopup message={popupMessage} onClose={closePopup} open={popupOpen} />
    </div>
  )
}

export default App
