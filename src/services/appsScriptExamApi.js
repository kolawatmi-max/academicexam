async function requestApi(url, action, payload) {
  const params = new URLSearchParams()
  params.set('action', action)
  if (payload !== undefined && payload !== null) {
    params.set('payload', JSON.stringify(payload))
  }

  const response = await fetch(`${url}?${params.toString()}`, { redirect: 'follow' })

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
    sendCheckNotification(payload) {
      return requestApi(baseUrl, 'sendCheckNotification', payload)
    },
  }
}

export default createAppsScriptExamApi
