// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { baseURL, endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import { origin } from 'src/store/endpoints/interceptor'
import { useDispatch, useSelector } from 'react-redux'
import { setLoggedInUser } from 'src/store/apps/user'
import jwt from 'jsonwebtoken'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const store = useSelector(state => state.user)
  const dispatch = useDispatch()
  console.log(loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({
              id: 1,
              email: params.email,
              fullName: 'Naveenkumar Mounasamy',
              username: 'naveen',
              role: 'admin'
            })
            dispatch(
              setLoggedInUser({
                data: {
                  id: 1,
                  email: params.email,
                  fullName: 'Naveenkumar Mounasamy',
                  username: 'naveen',
                  role: 'admin'
                }
              })
            )

            const returnUrl = router.query.returnUrl
              ? router.query.returnUrl
              : '/dashboards/analytics'
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL)
          })
          .catch(() => {
            // localStorage.removeItem('userData')
            // localStorage.removeItem('refreshToken')
            // localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    delete params.rememberMe
    axios
      .post(endpointURL(endpoints.login), params)
      .then(async response => {
        console.log(response)
        debugger
        const oldTokenDecoded = jwt.decode(accessToken, { complete: true })
        const user = oldTokenDecoded?.payload

        dispatch(setLoggedInUser(response.data))

        // params.rememberMe
        //   ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        //   : null

        window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.access)
        window.localStorage.setItem(authConfig.onTokenExpiration, response.data.refresh)

        axios.defaults.baseURL = baseURL
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
        axios.defaults.headers.post['Content-Type'] = 'application/json'

        // function parseJwt(token) {
        //   var base64Url = token.split('.')[1]
        //   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

        //   var jsonPayload = decodeURIComponent(
        //     window
        //       .atob(base64)
        //       .split('')
        //       .map(function (c) {
        //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        //       })
        //       .join('')
        //   )

        //   return JSON.parse(jsonPayload)
        // }

        if (user.org == 'true') {
          const returnUrl = router.query.returnUrl
            ? router.query.returnUrl
            : '/dashboards/analytics'
          setUser({ ...response.data.userData })

          // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
          window.localStorage.setItem('userData', JSON.stringify(response.data.userData))
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL)
        } else if (user.org == 'false') {
          const returnUrl = router.query.returnUrl
            ? router.query.returnUrl
            : '/organizational-setup'
          setUser({ ...response.data.userData })

          // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
          window.localStorage.setItem('userData', JSON.stringify(response.data.userData))
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
