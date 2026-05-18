export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function apiFetch(input, init) {
  if (typeof input === 'string' && input.startsWith('/api')) {
    input = `${API_BASE}${input}`
  }
  return fetch(input, init)
}
