import { useEffect } from 'react'
import AnalyticsDashboard from './dashboards/analytics'
import { useRouter } from 'next/router'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (window.location.pathname == '/') {
      if (accessToken != null) {
        router.replace({ pathname: '/timesheets' })
      } else {
        router.replace({ pathname: '/login' })
      }
    }
  }, [])

  return <></>
}

Home.getLayout = page => <BlankLayout>{page}</BlankLayout>
export default Home
