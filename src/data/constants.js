export const termOptions = ['ภาค 2/2568', 'ภาค S/2568']
export const examTypeOptions = ['สอบปลายภาค', 'สอบชดเชย', 'สอบแก้ตัว']
export const courseCategoryOptions = ['รายวิชาในแผน', 'รายวิชานอกแผน']
export const sectionTypeOptions = ['ปกติ', 'เสาร์-อาทิตย์']
export const productionMethodOptions = ['ผลิตเอง', 'วิชาการผลิต']
export const examArrangementOptions = ['จัดสอบเอง', 'วิชาการจัดสอบ']
export const mcqTypeOptions = ['ปกติ', 'ชุด A และชุด B']
export const examFormatOptions = ['ในตาราง', 'นอกตาราง']
export const emailDomain = '@spumail.ac.th'

export const defaultConfig = {
  termOptions,
  examTypeOptions,
  courseCategoryOptions,
  sectionTypeOptions,
  productionMethodOptions,
  examArrangementOptions,
  mcqTypeOptions,
  examFormatOptions,
  emailDomain,
}

export const requestStatusOptions = [
  'ส่งข้อสอบแล้ว',
  'รับข้อสอบแล้ว',
  'ส่งข้อสอบปรนัยแล้ว',
  'ตรวจข้อสอบปรนัยแล้ว',
]

export const initialSubmitForm = {
  courseCode: '',
  term: '',
  examType: '',
  courseCategory: '',
  sectionType: '',
  productionMethod: '',
  examArrangement: '',
  submittedDate: '',
  contactPhone: '',
  senderName: '',
}

export function normalizeEmail(value) {
  const cleaned = String(value || '').trim()
  if (!cleaned) return ''
  if (cleaned.includes('@')) return cleaned
  return `${cleaned}${emailDomain}`
}

export function stripEmailDomain(value) {
  return String(value || '').replace(emailDomain, '')
}
