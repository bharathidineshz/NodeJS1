import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Configuration from 'src/pages/settings'

const ConfigurationTab = ({ tab }) => {
  const router = useRouter()

  useEffect(() => {
    if (tab != '[tab]') {
      localStorage.setItem('tab', tab)
    } else {
      tab = localStorage.getItem('tab')
    }
    router.replace({ pathname: `/settings/${tab}` })
  }, [tab])

  return <Configuration tab={tab} />
}

// export const getStaticPaths = () => {
//   return {
//     paths: [
//       { params: { tab: 'Department' } },
//       { params: { tab: 'Skills' } },
//       { params: { tab: 'Settings' } }
//     ],
//     fallback: true
//   }
// }

// export const getStaticProps = async ({ params }) => {
//   return {
//     props: {
//       tab: params?.tab
//     }
//   }
// }

export const getServerSideProps = async ({ params }) => {
  const tab = params.tab

  return {
    props: {
      tab
    }
  }
}

export default ConfigurationTab
