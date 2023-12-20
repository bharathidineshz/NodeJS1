// ** Third Party Imports
import axios from 'axios'
import LeaveManagement from 'src/pages/leave-management/'

// ** Demo Components Imports

const LeaveManagementTab = ({ tab, data }) => {
  return <LeaveManagement tab={tab} data={data} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'my leaves' } },
      // { params: { tab: 'all requests' } },
      { params: { tab: 'approval' } },
      { params: { tab: 'reports' } },
      { params: { tab: 'leave_policy' } },
      { params: { tab: 'settings' } }
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
