// ** Third Party Imports
import axios from 'axios'
import FallbackSpinner from 'src/layouts/components/LogoSpinner'
import LeaveManagement from 'src/pages/absence-management'

// ** Demo Components Imports

const LeaveManagementTab = ({ tab, data }) => {
  return tab ? <LeaveManagement tab={tab} data={data} /> : <FallbackSpinner />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'leaves' } },
      { params: { tab: 'approval' } },
      { params: { tab: 'reports' } },
      { params: { tab: 'leave_policy' } },
      { params: { tab: 'holidays' } }
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default LeaveManagementTab
