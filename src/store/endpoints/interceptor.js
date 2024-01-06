import axios from 'axios'
import { endpointURL, endpoints } from './endpoints'
import dayjs from 'dayjs'
import authConfig from 'src/configs/auth'
import jwt from 'jsonwebtoken'

export const base = {
  uat: 'https://lp-webapi-uat.azurewebsites.net/',
  dev: 'https://lp-webapi-dev.azurewebsites.net/',
  local: 'http://localhost:3000/'
}

export const identifyURL = () => {
  const isDev =
    location.origin.toLowerCase().includes('localhost') ||
    location.origin.toLowerCase().includes('dev')
  const isUat = window.location.origin.toLowerCase().includes('uat')

  if (isDev) {
    return base.dev
  }
  if (isUat) {
    return base.uat
  }
}

const instance = axios.create({
  // Your API base URL
  baseURL: base.dev
})

const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}

instance.interceptors.request.use(
  async config => {
    const accessToken = localStorage.getItem('accessToken')
    config.headers.Authorization = `Bearer ${accessToken}`

    if (accessToken != null) {
      const oldTokenDecoded = jwt.decode(accessToken, { complete: true })
      const user = oldTokenDecoded.payload
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

      if (isExpired) {
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
    }

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default instance
