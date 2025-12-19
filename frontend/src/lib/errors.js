export const normalizeError = (err) => {
  const status = err?.response?.status
  const data = err?.response?.data
  const message =
    (typeof data === 'string' && data) ||
    data?.message ||
    (typeof data === 'object' ? Object.values(data)[0]?.[0] : null) ||
    err?.message ||
    'Terjadi kesalahan.'

  return { status, message }
}
