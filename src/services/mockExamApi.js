import { defaultConfig } from '../data/constants'

const mockCourseOptions = [
  'BUS208 วิทยาการจัดการเชิงนวัตกรรม',
  'BUS211 พื้นฐานวิทยาการข้อมูล',
  'COM111 เทคนิคการนำเสนอ 1',
  'COM112 เทคนิคการนำเสนอข้อมูล 2',
  'MKT201 หลักการตลาด',
  'ACC101 การบัญชีเบื้องต้น',
]

const mockPersonnelOptions = [
  'ชาลิสา พรมแสง',
  'อรินชัย ทิพย์บำรุง',
  'สุภฤกษ์ พลาศิทธิ์ดีฉนวน',
  'ธมลวรรณ เทพา',
  'กลวัชร มินทร์',
]

let mockRequests = [
  {
    requestId: 'req-001',
    createdAt: '2026-05-13T10:00:00',
    updatedAt: '2026-05-13T10:00:00',
    courseCode: 'BUS208 วิทยาการจัดการเชิงนวัตกรรม',
    term: 'ภาค 2/2568',
    examType: 'สอบปลายภาค',
    courseCategory: 'รายวิชาในแผน',
    sectionType: 'ปกติ',
    productionMethod: 'ผลิตเอง',
    examArrangement: 'จัดสอบเอง',
    submittedDate: '2026-05-13',
    contactPhone: '0812345678',
    senderName: 'ชาลิสา พรมแสง',
    senderEmail: '',
    mcqPersonnelName: '',
    requestStatus: 'ส่งข้อสอบแล้ว',
    receivedBy: '',
    envelopeCount: '',
    receivedAt: '',
    mcqType: '',
    sheetCount: '',
    questionCount: '',
    scoreCount: '',
    hasFreeQuestion: false,
    freeQuestionCount: '',
    examFormat: '',
    mcqSubmittedAt: '',
    mcqStatus: 'ยังไม่ส่งตรวจข้อสอบปรนัย',
    mcqCheckedAt: '',
  },
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function delay(value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(clone(value)), 80)
  })
}

function getBootstrapPayload() {
  return {
    config: defaultConfig,
    personnel: mockPersonnelOptions,
    courses: mockCourseOptions,
    requests: mockRequests,
    diagnostics: [],
    sheetDiagnostics: null,
  }
}

function updateRequestInStore(requestId, updater) {
  mockRequests = mockRequests.map((item) => (item.requestId === requestId ? updater(item) : item))
}

export async function getBootstrapData() {
  return delay(getBootstrapPayload())
}

export async function submitExamRequest(payload) {
  const now = new Date().toISOString()
  const newRequest = {
    requestId: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...payload,
    senderEmail: '',
    mcqPersonnelName: '',
    requestStatus: 'ส่งข้อสอบแล้ว',
    receivedBy: '',
    envelopeCount: '',
    receivedAt: '',
    mcqType: '',
    sheetCount: '',
    questionCount: '',
    scoreCount: '',
    hasFreeQuestion: false,
    freeQuestionCount: '',
    examFormat: '',
    mcqSubmittedAt: '',
    mcqStatus: 'ยังไม่ส่งตรวจข้อสอบปรนัย',
    mcqCheckedAt: '',
  }

  mockRequests = [newRequest, ...mockRequests]
  return getBootstrapData()
}

export async function updateExamRequest(payload) {
  updateRequestInStore(payload.requestId, (item) => ({
    ...item,
    ...payload,
    updatedAt: new Date().toISOString(),
  }))

  return getBootstrapData()
}

export async function deleteExamRequest(requestId) {
  mockRequests = mockRequests.filter((item) => item.requestId !== requestId)
  return getBootstrapData()
}

export async function receiveExam(payload) {
  updateRequestInStore(payload.requestId, (item) => ({
    ...item,
    receivedBy: payload.receivedBy,
    envelopeCount: payload.envelopeCount,
    receivedAt: new Date().toISOString(),
    requestStatus: 'รับข้อสอบแล้ว',
    updatedAt: new Date().toISOString(),
  }))

  return getBootstrapData()
}

export async function submitMcq(payload) {
  updateRequestInStore(payload.requestId, (item) => ({
    ...item,
    mcqType: payload.mcqType,
    sheetCount: payload.sheetCount,
    questionCount: payload.questionCount,
    scoreCount: payload.scoreCount,
    hasFreeQuestion: Boolean(payload.hasFreeQuestion),
    freeQuestionCount: payload.hasFreeQuestion ? payload.freeQuestionCount : '',
    examFormat: payload.examFormat,
    mcqSubmittedAt: payload.submittedDate,
    mcqPersonnelName: payload.mcqPersonnelName,
    senderEmail: payload.senderEmail,
    mcqStatus: 'ส่งข้อสอบปรนัยแล้ว',
    requestStatus: 'ส่งข้อสอบปรนัยแล้ว',
    updatedAt: new Date().toISOString(),
  }))

  return getBootstrapData()
}

export async function markMcqChecked(requestId) {
  updateRequestInStore(requestId, (item) => ({
    ...item,
    mcqStatus: 'ตรวจข้อสอบปรนัยแล้ว',
    mcqCheckedAt: new Date().toISOString(),
    requestStatus: 'ตรวจข้อสอบปรนัยแล้ว',
    updatedAt: new Date().toISOString(),
  }))

  return getBootstrapData()
}

export async function createCourse(payload) {
  const value = String(payload?.value || '').trim()
  if (!value) throw new Error('กรุณากรอกรายวิชา')
  if (mockCourseOptions.includes(value)) throw new Error('มีรายวิชานี้อยู่แล้ว')
  mockCourseOptions.push(value)
  return getBootstrapData()
}

export async function updateCourse(payload) {
  const oldValue = String(payload?.oldValue || '').trim()
  const newValue = String(payload?.newValue || '').trim()
  if (!oldValue || !newValue) throw new Error('ข้อมูลรายวิชาไม่ครบ')
  const index = mockCourseOptions.indexOf(oldValue)
  if (index === -1) throw new Error('ไม่พบรายวิชาที่ต้องการแก้ไข')
  if (oldValue !== newValue && mockCourseOptions.includes(newValue)) throw new Error('มีรายวิชานี้อยู่แล้ว')
  mockCourseOptions[index] = newValue
  return getBootstrapData()
}

export async function deleteCourse(value) {
  const index = mockCourseOptions.indexOf(String(value || '').trim())
  if (index === -1) throw new Error('ไม่พบรายวิชาที่ต้องการลบ')
  mockCourseOptions.splice(index, 1)
  return getBootstrapData()
}

export async function createPersonnel(payload) {
  const value = String(payload?.value || '').trim()
  if (!value) throw new Error('กรุณากรอกรายชื่อบุคลากร')
  if (mockPersonnelOptions.includes(value)) throw new Error('มีรายชื่อนี้อยู่แล้ว')
  mockPersonnelOptions.push(value)
  return getBootstrapData()
}

export async function updatePersonnel(payload) {
  const oldValue = String(payload?.oldValue || '').trim()
  const newValue = String(payload?.newValue || '').trim()
  if (!oldValue || !newValue) throw new Error('ข้อมูลบุคลากรไม่ครบ')
  const index = mockPersonnelOptions.indexOf(oldValue)
  if (index === -1) throw new Error('ไม่พบบุคลากรที่ต้องการแก้ไข')
  if (oldValue !== newValue && mockPersonnelOptions.includes(newValue)) throw new Error('มีรายชื่อนี้อยู่แล้ว')
  mockPersonnelOptions[index] = newValue
  return getBootstrapData()
}

export async function deletePersonnel(value) {
  const index = mockPersonnelOptions.indexOf(String(value || '').trim())
  if (index === -1) throw new Error('ไม่พบบุคลากรที่ต้องการลบ')
  mockPersonnelOptions.splice(index, 1)
  return getBootstrapData()
}

export async function sendCheckNotification(payload) {
  console.log('Mock sendCheckNotification:', payload)
  return { ok: true, message: 'ส่งอีเมลแจ้งเตือนเรียบร้อยแล้ว (mock)' }
}
