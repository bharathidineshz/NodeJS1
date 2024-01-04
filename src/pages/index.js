import { useEffect } from 'react'
import AppTimeSheets from './apps/timesheets'
import AnalyticsDashboard from './dashboards/analytics'
import { useRouter } from 'next/router'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Home = () => {
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (window.location.pathname == '/') {
      if (accessToken != null) {
        router.replace({ pathname: '/absence-management/leaves' })
      } else {
        router.replace({ pathname: '/login' })
      }
    }
  }, [])

  return <></>
}

Home.getLayout = page => <BlankLayout>{page}</BlankLayout>
export default Home
