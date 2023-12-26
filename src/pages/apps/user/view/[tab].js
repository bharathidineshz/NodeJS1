// ** Third Party Imports
import axios from 'axios'
import { useSelector } from 'react-redux'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ tab }) => {
  const store = useSelector(state => state.user)
  const user = store.users.find(o => o.id === store?.userId)

  return <UserViewPage tab={tab} id={store?.userId} user={user} />
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
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default UserView
