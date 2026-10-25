export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed'

export function normalizeStatus(raw: unknown): JobStatus {
  const value = String(raw ?? '').trim().toLowerCase()
  switch (value) {
    case 'co': case 'completed': return 'completed'
    case 'pr': case 'processing': return 'processing'
    case 'fa': case 'failed': return 'failed'
    case 'qu': case 'queued': case '': return 'queued'
    default:
      console.warn('[status] Unrecognised status code from backend:', raw)
      return 'queued'
  }
}

export function isTerminal(status: JobStatus): boolean {
  return status === 'completed' || status === 'failed'
}