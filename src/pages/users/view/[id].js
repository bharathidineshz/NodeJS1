import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UsersProjectListTable from 'src/views/apps/user/view/UsersProjectListTable'

const UserDetail = ({ id }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  const _id = id == null ? router.query : id
  const store = useSelector(state => state.user)
  const user = store.users.find(o => o.id === _id)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft user={user} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UsersProjectListTable />
      </Grid>
    </Grid>
  )
}

export default UserDetail
