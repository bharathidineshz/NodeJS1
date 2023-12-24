// ** Third Party Imports
import axios from 'axios'
import { useSelector } from 'react-redux'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ tab, invoiceData }) => {
  const store = useSelector(state => state.user)
  const user = store.users.find(o => o.id === store?.userId)

  return <UserViewPage tab={tab} id={store?.userId} user={user} invoiceData={invoiceData} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'overview' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing-plan' } },
      { params: { tab: 'notification' } },
      { params: { tab: 'connection' } }
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default UserView
