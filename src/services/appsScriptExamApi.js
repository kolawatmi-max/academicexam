async function requestApi(url, action, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      payload,
    }),
  })

  if (!response.ok) {
    throw new Error(`Apps Script API error: ${response.status}`)
  }

  const result = await response.json()
  if (!result.ok) {
    throw new Error(result.error || 'Apps Script request failed')
  }

  return result.data
}

function createAppsScriptExamApi(baseUrl) {
  return {
    getBootstrapData() {
      return requestApi(baseUrl, 'getInitialData')
    },
    submitExamRequest(payload) {
      return requestApi(baseUrl, 'submitExamRequest', payload)
    },
    updateExamRequest(payload) {
      return requestApi(baseUrl, 'updateExamRequest', payload)
    },
    deleteExamRequest(requestId) {
      return requestApi(baseUrl, 'deleteExamRequest', requestId)
    },
    receiveExam(payload) {
      return requestApi(baseUrl, 'receiveExam', payload)
    },
    submitMcq(payload) {
      return requestApi(baseUrl, 'submitMcq', payload)
    },
    markMcqChecked(requestId) {
      return requestApi(baseUrl, 'markMcqChecked', requestId)
    },
    createCourse(payload) {
      return requestApi(baseUrl, 'createCourse', payload)
    },
    updateCourse(payload) {
      return requestApi(baseUrl, 'updateCourse', payload)
    },
    deleteCourse(value) {
      return requestApi(baseUrl, 'deleteCourse', value)
    },
    createPersonnel(payload) {
      return requestApi(baseUrl, 'createPersonnel', payload)
    },
    updatePersonnel(payload) {
      return requestApi(baseUrl, 'updatePersonnel', payload)
    },
    deletePersonnel(value) {
      return requestApi(baseUrl, 'deletePersonnel', value)
    },
  }
}

export default createAppsScriptExamApi
