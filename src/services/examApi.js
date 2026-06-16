import {
  createCourse,
  createPersonnel,
  createTerm,
  deleteCourse,
  deleteExamRequest,
  deletePersonnel,
  deleteTerm,
  getBootstrapData,
  markMcqChecked,
  receiveExam,
  sendCheckNotification,
  submitExamRequest,
  submitMcq,
  updateCourse,
  updateExamRequest,
  updatePersonnel,
  updateTerm,
} from './mockExamApi'
import createAppsScriptExamApi from './appsScriptExamApi'

const appsScriptUrl = import.meta.env.VITE_EXAM_API_URL

const examApi = appsScriptUrl
  ? createAppsScriptExamApi(appsScriptUrl)
  : {
      getBootstrapData,
      submitExamRequest,
      updateExamRequest,
      deleteExamRequest,
      receiveExam,
      submitMcq,
      markMcqChecked,
      createCourse,
      updateCourse,
      deleteCourse,
      createPersonnel,
      updatePersonnel,
      deletePersonnel,
      createTerm,
      updateTerm,
      deleteTerm,
      sendCheckNotification,
    }

export default examApi
