import axios from 'axios'
import { useUserStore } from '@/stores/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
})

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API,
})

apiAuth.interceptors.request.use((config) => {
  const user = useUserStore()
  // console.log('🚀 Axios Request Headers:', config.headers) // 檢查標頭
  // console.log('🚀 Token in Store:', user.token) // 檢查 token 是否存在
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})

apiAuth.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response) {
      if (error.response.data.message === '登入過期' && error.config.url !== '/user/refresh') {
        const user = useUserStore()
        try {
          const { data } = await apiAuth.patch('/user/refresh')
          user.token = data.result
          error.config.headers.Authorization = 'Bearer ' + user.token
          return axios(error.config)
        } catch (error) {
          console.log('composables.axios.response', error)
          user.logout()
        }
      }
    }
    return Promise.reject(error)
  },
)

export const useAxios = () => {
  return { api, apiAuth }
}
