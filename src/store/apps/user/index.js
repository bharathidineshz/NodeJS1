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
// ** update User
export const updateUser = createAsyncThunk(
  'appUsers/updateUser',
  async (data, { getState, dispatch }) => {
    const response = await instance.put(endpoints.Updateuser, data)

    return response
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { getState, dispatch }) => {
    const response = await instance.delete(endpoints.Deleteuser(id))
    dispatch(fetchUsers(getState().user.params))

    return response.data
  }
)

export const activateUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { getState, dispatch }) => {
    const response = await instance.patch(endpoints.Activateuser(id))
    dispatch(fetchUsers(getState().user.params))

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
    skills: [],
    userId: 0,
    userRoleId: 0,
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload
    },
    setUserId: (state, { payload }) => {
      state.userId = payload
    },
    setUserRoleId: (state,{payload})=>{
      state.userRoleId = payload ? Number(payload) : 0

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

export const { setLoggedInUser, setUserId,setUserRoleId } = appUsersSlice.actions

export default appUsersSlice.reducer
