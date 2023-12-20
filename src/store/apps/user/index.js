import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// ** Fetch Users
export const fetchUsers = createAsyncThunk('appUsers/fetchData', async params => {
  const response = await instance.get(endpoints.allUsers)

  return response.data
})
export const fetchSkills = createAsyncThunk('fetchSkills/Skills', async params => {
  const response = await instance.get(endpoints.getSkills)

  return response.data
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data, { getState, dispatch }) => {
    const response = await instance.post(endpoints.adduser, data)
    dispatch(fetchUsers(getState().user.params))

    return response
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { getState, dispatch }) => {
    console.log(id)
    const response = await instance.delete(endpointURL(endpoints.Deleteuser(id)))
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    loggedInUser: {},
    users: [],
    total: 1,
    params: {},
    allData: [],
    skills: []
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const users = [...action.payload]
      users.map(u => {
        u.fullName = `${u.firstName} ${u.lastName}`
      })
      state.users = users
    })
    builder.addCase(fetchSkills.fulfilled, (state, action) => {
      state.skills = action.payload
    })
  }
})

export const { setLoggedInUser } = appUsersSlice.actions

export default appUsersSlice.reducer
