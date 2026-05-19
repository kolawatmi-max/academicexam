import { useEffect, useMemo, useState } from 'react'
import { defaultConfig, initialSubmitForm, normalizeEmail, stripEmailDomain } from '../data/constants'
import examApi from '../services/examApi'

function useExamWorkflow() {
  const [activeTab, setActiveTab] = useState('submit')
  const [submitForm, setSubmitForm] = useState(initialSubmitForm)
  const [requests, setRequests] = useState([])
  const [config, setConfig] = useState(defaultConfig)
  const [courseOptions, setCourseOptions] = useState([])
  const [personnelOptions, setPersonnelOptions] = useState([])
  const [editingId, setEditingId] = useState('')
  const [receiveSearch, setReceiveSearch] = useState('')
  const [receiveFilter, setReceiveFilter] = useState('')
  const [mcqSearch, setMcqSearch] = useState('')
  const [mcqFilter, setMcqFilter] = useState('')
  const [checkSearch, setCheckSearch] = useState('')
  const [checkFilter, setCheckFilter] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [popupOpen, setPopupOpen] = useState(false)
  const [receiveDrafts, setReceiveDrafts] = useState({})
  const [mcqDrafts, setMcqDrafts] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [statusByPanel, setStatusByPanel] = useState({
    submit: { message: '', type: '' },
    receive: { message: '', type: '' },
    mcq: { message: '', type: '' },
    check: { message: '', type: '' },
    database: { message: '', type: '' },
  })

  useEffect(() => {
    let mounted = true

    async function loadBootstrap() {
      setIsLoading(true)
      setLoadError('')

      try {
        const data = await examApi.getBootstrapData()
        if (!mounted) return
        hydrateBootstrapData(data)
        setStatus('submit', 'พร้อมใช้งาน', 'success')
      } catch (error) {
        if (!mounted) return
        setLoadError(error instanceof Error ? error.message : 'โหลดข้อมูลเริ่มต้นไม่สำเร็จ')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadBootstrap()

    return () => {
      mounted = false
    }
  }, [])

  const receiveItems = useMemo(
    () =>
      requests.filter((item) => {
        const query = receiveSearch.trim().toLowerCase()
        const matchesQuery = !query || `${item.courseCode} ${item.senderName}`.toLowerCase().includes(query)
        const matchesStatus = !receiveFilter || item.requestStatus === receiveFilter
        return matchesQuery && matchesStatus
      }),
    [receiveFilter, receiveSearch, requests],
  )

  const mcqItems = useMemo(
    () =>
      requests.filter((item) => {
        const allowed = ['รับข้อสอบแล้ว', 'ส่งข้อสอบปรนัยแล้ว', 'ตรวจข้อสอบปรนัยแล้ว']
        const query = mcqSearch.trim().toLowerCase()
        const matchesQuery = !query || item.courseCode.toLowerCase().includes(query)
        const matchesStatus = !mcqFilter || item.requestStatus === mcqFilter
        return allowed.includes(item.requestStatus) && matchesQuery && matchesStatus
      }),
    [mcqFilter, mcqSearch, requests],
  )

  const checkItems = useMemo(
    () =>
      requests.filter((item) => {
        const allowed = ['ส่งข้อสอบปรนัยแล้ว', 'ตรวจข้อสอบปรนัยแล้ว']
        const query = checkSearch.trim().toLowerCase()
        const matchesQuery = !query || item.courseCode.toLowerCase().includes(query)
        const matchesStatus = !checkFilter || item.requestStatus === checkFilter
        return allowed.includes(item.requestStatus) && matchesQuery && matchesStatus
      }),
    [checkFilter, checkSearch, requests],
  )

  function hydrateBootstrapData(data) {
    setConfig(data?.config || defaultConfig)
    setCourseOptions(data?.courses || [])
    setPersonnelOptions(data?.personnel || [])
    setRequests(data?.requests || [])
  }

  function openPopup(message) {
    setPopupMessage(message)
    setPopupOpen(true)
  }

  function closePopup() {
    setPopupOpen(false)
  }

  function setStatus(panel, message, type = '') {
    setStatusByPanel((current) => ({
      ...current,
      [panel]: { message, type },
    }))
  }

  function updateSubmitForm(field, value) {
    setSubmitForm((current) => ({ ...current, [field]: value }))
  }

  function resetSubmitForm() {
    setSubmitForm(initialSubmitForm)
    setEditingId('')
  }

  async function saveRequest() {
    if (
      !submitForm.courseCode ||
      !submitForm.term ||
      !submitForm.examType ||
      !submitForm.courseCategory ||
      !submitForm.sectionType ||
      !submitForm.productionMethod ||
      !submitForm.examArrangement ||
      !submitForm.submittedDate ||
      !submitForm.contactPhone ||
      !submitForm.senderName
    ) {
      openPopup('กรุณากรอกข้อมูลส่งข้อสอบให้ครบ')
      return
    }

    try {
      setStatus('submit', editingId ? 'กำลังบันทึกการแก้ไข...' : 'กำลังบันทึกข้อมูลส่งข้อสอบ...')
      const data = editingId
        ? await examApi.updateExamRequest({ requestId: editingId, ...submitForm })
        : await examApi.submitExamRequest(submitForm)
      hydrateBootstrapData(data)
      resetSubmitForm()
      setStatus('submit', editingId ? 'แก้ไขข้อมูลเรียบร้อยแล้ว' : 'บันทึกข้อมูลส่งข้อสอบเรียบร้อยแล้ว', 'success')
      openPopup(editingId ? 'แก้ไขข้อมูลเรียบร้อยแล้ว' : 'บันทึกข้อมูลส่งข้อสอบเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('submit', error instanceof Error ? error.message : 'บันทึกข้อมูลไม่สำเร็จ', 'error')
    }
  }

  function editRequest(requestId) {
    const item = requests.find((row) => row.requestId === requestId)
    if (!item) return
    setEditingId(requestId)
    setSubmitForm({
      courseCode: item.courseCode,
      term: item.term,
      examType: item.examType,
      courseCategory: item.courseCategory,
      sectionType: item.sectionType,
      productionMethod: item.productionMethod,
      examArrangement: item.examArrangement,
      submittedDate: item.submittedDate,
      contactPhone: item.contactPhone,
      senderName: item.senderName,
    })
    setActiveTab('submit')
  }

  async function deleteRequest(requestId) {
    try {
      setStatus('submit', 'กำลังลบข้อมูล...')
      const data = await examApi.deleteExamRequest(requestId)
      hydrateBootstrapData(data)
      setStatus('submit', 'ลบข้อมูลเรียบร้อยแล้ว', 'success')
      setStatus('database', 'ลบรายการคำขอสอบเรียบร้อยแล้ว', 'success')
      openPopup('ลบข้อมูลเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('submit', error instanceof Error ? error.message : 'ลบข้อมูลไม่สำเร็จ', 'error')
    }
  }

  function updateReceiveDraft(requestId, field, value) {
    setReceiveDrafts((current) => ({
      ...current,
      [requestId]: {
        receivedBy: current[requestId]?.receivedBy ?? '',
        envelopeCount: current[requestId]?.envelopeCount ?? '',
        [field]: value,
      },
    }))
  }

  async function saveReceive(requestId) {
    const draft = receiveDrafts[requestId] || {}
    if (!draft.receivedBy || !draft.envelopeCount) {
      openPopup('กรุณากรอกชื่อผู้รับและจำนวนซองข้อสอบ')
      return
    }

    try {
      setStatus('receive', 'กำลังบันทึกรับข้อสอบ...')
      const data = await examApi.receiveExam({
        requestId,
        receivedBy: draft.receivedBy,
        envelopeCount: draft.envelopeCount,
      })
      hydrateBootstrapData(data)
      setStatus('receive', 'บันทึกรับข้อสอบเรียบร้อยแล้ว', 'success')
      openPopup('บันทึกรับข้อสอบเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('receive', error instanceof Error ? error.message : 'บันทึกรับข้อสอบไม่สำเร็จ', 'error')
    }
  }

  function updateMcqDraft(requestId, field, value) {
    setMcqDrafts((current) => ({
      ...current,
      [requestId]: {
        mcqType: current[requestId]?.mcqType ?? '',
        sheetCount: current[requestId]?.sheetCount ?? '',
        sheetCountA: current[requestId]?.sheetCountA ?? '',
        sheetCountB: current[requestId]?.sheetCountB ?? '',
        questionCount: current[requestId]?.questionCount ?? '',
        scoreCount: current[requestId]?.scoreCount ?? '',
        hasFreeQuestion: current[requestId]?.hasFreeQuestion ?? false,
        freeQuestionCount: current[requestId]?.freeQuestionCount ?? '',
        examFormat: current[requestId]?.examFormat ?? '',
        submittedDate: current[requestId]?.submittedDate ?? '',
        mcqPersonnelName: current[requestId]?.mcqPersonnelName ?? '',
        senderEmail: stripEmailDomain(current[requestId]?.senderEmail ?? ''),
        [field]: value,
      },
    }))
  }

  async function saveMcq(requestId) {
    const draft = mcqDrafts[requestId] || {}
    const sheetCountValid = draft.mcqType === 'ชุด A และชุด B'
      ? (draft.sheetCountA && draft.sheetCountB)
      : draft.sheetCount
    if (
      !draft.mcqType ||
      !sheetCountValid ||
      !draft.questionCount ||
      !draft.scoreCount ||
      !draft.examFormat ||
      !draft.submittedDate ||
      !draft.mcqPersonnelName ||
      !draft.senderEmail
    ) {
      openPopup('กรุณากรอกข้อมูลส่งตรวจข้อสอบปรนัยให้ครบ')
      return
    }

    try {
      setStatus('mcq', 'กำลังบันทึกข้อมูลส่งตรวจข้อสอบปรนัย...')
      const data = await examApi.submitMcq({
        requestId,
        ...draft,
        senderEmail: normalizeEmail(draft.senderEmail),
      })
      hydrateBootstrapData(data)
      setStatus('mcq', 'บันทึกส่งตรวจข้อสอบปรนัยเรียบร้อยแล้ว', 'success')
      openPopup('บันทึกส่งตรวจข้อสอบปรนัยเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('mcq', error instanceof Error ? error.message : 'บันทึกส่งตรวจข้อสอบปรนัยไม่สำเร็จ', 'error')
    }
  }

  async function markChecked(requestId) {
    try {
      setStatus('check', 'กำลังอัปเดตสถานะตรวจข้อสอบ...')
      const data = await examApi.markMcqChecked(requestId)
      hydrateBootstrapData(data)
      setStatus('check', 'อัปเดตสถานะตรวจข้อสอบเรียบร้อยแล้ว', 'success')
      openPopup('อัปเดตสถานะตรวจข้อสอบเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('check', error instanceof Error ? error.message : 'อัปเดตสถานะตรวจข้อสอบไม่สำเร็จ', 'error')
    }
  }

  async function sendCheckNotification(payload) {
    try {
      setStatus('check', 'กำลังส่งอีเมลแจ้งเตือน...')
      const result = await examApi.sendCheckNotification(payload)
      setStatus('check', 'ส่งอีเมลแจ้งเตือนเรียบร้อยแล้ว', 'success')
      openPopup(result?.message || 'ส่งอีเมลแจ้งเตือนเรียบร้อยแล้ว')
      return true
    } catch (error) {
      setStatus('check', error instanceof Error ? error.message : 'ส่งอีเมลไม่สำเร็จ', 'error')
      return false
    }
  }

  async function createCourse(value) {
    try {
      setStatus('database', 'กำลังเพิ่มรายวิชา...')
      const data = await examApi.createCourse({ value })
      hydrateBootstrapData(data)
      setStatus('database', 'เพิ่มรายวิชาเรียบร้อยแล้ว', 'success')
      openPopup('เพิ่มรายวิชาเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('database', error instanceof Error ? error.message : 'เพิ่มรายวิชาไม่สำเร็จ', 'error')
    }
  }

  async function updateCourse(oldValue, newValue) {
    try {
      setStatus('database', 'กำลังแก้ไขรายวิชา...')
      const data = await examApi.updateCourse({ oldValue, newValue })
      hydrateBootstrapData(data)
      setStatus('database', 'แก้ไขรายวิชาเรียบร้อยแล้ว', 'success')
      openPopup('แก้ไขรายวิชาเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('database', error instanceof Error ? error.message : 'แก้ไขรายวิชาไม่สำเร็จ', 'error')
    }
  }

  async function deleteCourse(value) {
    try {
      setStatus('database', 'กำลังลบรายวิชา...')
      const data = await examApi.deleteCourse(value)
      hydrateBootstrapData(data)
      setStatus('database', 'ลบรายวิชาเรียบร้อยแล้ว', 'success')
      openPopup('ลบรายวิชาเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('database', error instanceof Error ? error.message : 'ลบรายวิชาไม่สำเร็จ', 'error')
    }
  }

  async function createPersonnel(value) {
    try {
      setStatus('database', 'กำลังเพิ่มบุคลากร...')
      const data = await examApi.createPersonnel({ value })
      hydrateBootstrapData(data)
      setStatus('database', 'เพิ่มบุคลากรเรียบร้อยแล้ว', 'success')
      openPopup('เพิ่มบุคลากรเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('database', error instanceof Error ? error.message : 'เพิ่มบุคลากรไม่สำเร็จ', 'error')
    }
  }

  async function updatePersonnel(oldValue, newValue) {
    try {
      setStatus('database', 'กำลังแก้ไขบุคลากร...')
      const data = await examApi.updatePersonnel({ oldValue, newValue })
      hydrateBootstrapData(data)
      setStatus('database', 'แก้ไขบุคลากรเรียบร้อยแล้ว', 'success')
      openPopup('แก้ไขบุคลากรเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('database', error instanceof Error ? error.message : 'แก้ไขบุคลากรไม่สำเร็จ', 'error')
    }
  }

  async function deletePersonnel(value) {
    try {
      setStatus('database', 'กำลังลบบุคลากร...')
      const data = await examApi.deletePersonnel(value)
      hydrateBootstrapData(data)
      setStatus('database', 'ลบบุคลากรเรียบร้อยแล้ว', 'success')
      openPopup('ลบบุคลากรเรียบร้อยแล้ว')
    } catch (error) {
      setStatus('database', error instanceof Error ? error.message : 'ลบบุคลากรไม่สำเร็จ', 'error')
    }
  }

  return {
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
    deleteExamRequest: deleteRequest,
    deletePersonnel,
    editRequest,
    editingId,
    isLoading,
    loadError,
    markChecked,
    mcqDrafts,
    mcqFilter,
    mcqItems,
    mcqSearch,
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
  }
}

export default useExamWorkflow
