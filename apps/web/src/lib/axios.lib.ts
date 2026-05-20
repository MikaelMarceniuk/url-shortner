import axios from 'axios'

const isDevelopment = process.env.NODE_ENV === 'development'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

if (isDevelopment) {
  api.interceptors.request.use(async (config) => {
    const delay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
    await new Promise((resolve) => setTimeout(resolve, delay))
    return config
  })
}
