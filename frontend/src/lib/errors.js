export const normalizeError = (err) => {
  const status = err?.response?.status
  const data = err?.response?.data

  let message = 'Something went wrong.'

  // Laravel validation error (422)
  if (status === 422 && data?.errors) {
    message = Object.values(data.errors).flat().join(' ')
  }
  // API message string
  else if (typeof data === 'string') {
    message = data
  }
  // API message object
  else if (data?.message) {
    message = data.message
  }
  // Fallback JS error
  else if (err?.message) {
    message = err.message
  }

  return { status, message }
}
