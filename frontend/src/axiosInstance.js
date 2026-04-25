import axios from 'axios'

const rawBaseURL = import.meta.env.VITE_BACKEND_BASE_API || 'http://127.0.0.1:8000/'
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, '')
export const baseURL = `${normalizedBaseURL}/`
export const apiUrl = (path) => `${normalizedBaseURL}/${String(path).replace(/^\/+/, '')}`

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const statusCode = error?.response?.status

    if (statusCode === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${baseURL}token/refresh/`, { refresh: refreshToken })
        localStorage.setItem('accessToken', response.data.access)
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.dispatchEvent(new Event('storage'))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
