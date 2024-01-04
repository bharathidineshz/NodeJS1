import { Grid } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBackdrop from 'src/@core/components/spinner'
import { fetchUsers } from 'src/store/apps/user'
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UsersProjectListTable from 'src/views/apps/user/view/UsersProjectListTable'

const UserDetail = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rpm, setRpm] = useState(null)
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    updateUser()
  }, [])

  const updateUser = () => {
    dispatch(fetchUsers()).then(res => {
      const id = window.location.pathname.split('/')[3]
      const _user = isNaN(id) ? null : res.payload.result?.find(o => o.id == id)
      const _rpm = isNaN(id)
        ? null
        : res.payload.result?.find(o => o.id == _user.reportingManagerId)
      const _index = isNaN(id)
        ? null
        : res.payload.result?.findIndex(o => o.id == _user.reportingManagerId)
      setUser(_user)
      setRpm(_rpm)
      setIndex(_index)
    })
  }

  return (
    <Grid container spacing={6}>
      {user == null || loading ? <SimpleBackdrop /> : <></>}
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft
          user={user}
          rpm={rpm}
          index={index}
          updateUserData={updateUser}
          setLoading={setLoading}
        />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        {user != null && <UsersProjectListTable />}
      </Grid>
    </Grid>
  )
}

export default UserDetail
