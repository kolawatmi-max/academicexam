import {
  createCourse,
  createPersonnel,
  deleteCourse,
  deleteExamRequest,
  deletePersonnel,
  getBootstrapData,
  markMcqChecked,
  receiveExam,
  submitExamRequest,
  submitMcq,
  updateCourse,
  updateExamRequest,
  updatePersonnel,
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
    }

export default examApi
