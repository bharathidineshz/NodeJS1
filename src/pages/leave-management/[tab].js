// ** Third Party Imports
import axios from 'axios'
import LeaveManagement from 'src/pages/leave-management/'
import { endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'
import { fetchPolicies } from 'src/store/leave-management'

// ** Demo Components Imports

const LeaveManagementTab = ({ tab, data }) => {
  return <LeaveManagement tab={tab} data={data} />
}

export const getStaticPaths = () => {
  return {
    paths:  [
      { params: { tab: 'my leaves' } },
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
      tab: params?.tab,
    },
  }
}

export default LeaveManagementTab
