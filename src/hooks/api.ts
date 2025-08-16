import axios from "axios"
import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session?.accessToken) {
      config.headers.Authorization = `${session.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Admin stats
export async function fetchAdminStats() {
  const res = await api.get("/user/admin-stats")
  return res.data
}

// Payment stats
export async function fetchPaymentStats() {
  const res = await api.get("/payment/stats")
  return res.data
}

// Category stats
export async function fetchCategoryStats() {
  const res = await api.get("/payment/category-stats")
  return res.data
}
