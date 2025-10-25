import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
})

// --- Token helpers ---
export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('token', access)
  if (refresh) localStorage.setItem('refresh', refresh)
  // set default header immediately so first requests after login include it
  if (access) api.defaults.headers.common['Authorization'] = `Bearer ${access}`
}

export function clearTokens() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh')
  delete api.defaults.headers.common['Authorization']
}

// --- Initialize header on first load if a token already exists ---
const saved = localStorage.getItem('token')
if (saved) {
  api.defaults.headers.common['Authorization'] = `Bearer ${saved}`
}

// --- Always attach latest token before each request ---
api.interceptors.request.use((config) => {
  const tok = localStorage.getItem('token')
  if (tok) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${tok}`
  }
  return config
})

// --- Auto refresh on 401 using refresh token ---
let isRefreshing = false
let pending = []

function onRefreshed(newAccess) {
  pending.forEach(cb => cb(newAccess))
  pending = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response && error.response.status === 401 && !original._retry) {
      const refresh = localStorage.getItem('refresh')
      if (!refresh) {
        clearTokens()
        return Promise.reject(error)
      }
      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise((resolve, reject) => {
          pending.push((newAccess) => {
            original.headers = original.headers ?? {}
            original.headers.Authorization = `Bearer ${newAccess}`
            resolve(api(original))
          })
        })
      }
      original._retry = True = true
      try {
        isRefreshing = true
        const r = await axios.post('http://localhost:5000/api/auth/refresh', null, {
          headers: { Authorization: `Bearer ${refresh}` },
          withCredentials: true,
        })
        const newAccess = r.data.access_token
        setTokens({ access: newAccess })
        isRefreshing = false
        onRefreshed(newAccess)
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      } catch (e) {
        isRefreshing = false
        clearTokens()
        return Promise.reject(e)
      }
    }
    return Promise.reject(error)
  }
)

export default api
