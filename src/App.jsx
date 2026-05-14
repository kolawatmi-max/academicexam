import './App.css'
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

function App() {
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
    saveReceive,
    saveRequest,
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
        <TabButton active={activeTab} tab="database" setActiveTab={setActiveTab}>
          5. Database
        </TabButton>
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
        setReceiveFilter={setReceiveFilter}
        setReceiveSearch={setReceiveSearch}
        status={statusByPanel.receive}
        updateReceiveDraft={updateReceiveDraft}
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
        setMcqFilter={setMcqFilter}
        setMcqSearch={setMcqSearch}
        status={statusByPanel.mcq}
        updateMcqDraft={updateMcqDraft}
      />

      <CheckPanel
        active={activeTab === 'check'}
        checkFilter={checkFilter}
        checkSearch={checkSearch}
        items={checkItems}
        markChecked={markChecked}
        setCheckFilter={setCheckFilter}
        setCheckSearch={setCheckSearch}
        status={statusByPanel.check}
      />

      <DatabasePanel
        active={activeTab === 'database'}
        courseOptions={courseOptions}
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
