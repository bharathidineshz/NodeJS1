import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

// ** Fetch Users
export const fetchUsers = createAsyncThunk('appUsers/fetchData', async params => {
  try {
    const response = await instance.get(endpoints.allUsers)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

export const fetchSkills = createAsyncThunk('fetchSkills/Skills', async params => {
  try {
    const response = await instance.get(endpoints.skills)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.post(endpoints.adduser, data)
      dispatch(fetchUsers(getState().user.params))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)
// ** update User
export const updateUser = createAsyncThunk(
  'appUsers/updateUser',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.put(endpoints.Updateuser, data)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { getState, dispatch }) => {
    try {
      const response = await instance.delete(endpoints.Deleteuser(id))
      dispatch(fetchUsers(getState().user.params))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const activateUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { getState, dispatch }) => {
    try {
      const response = await instance.patch(endpoints.Activateuser(id))
      dispatch(fetchUsers(getState().user.params))

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
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
    userRoleId: 0
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload
    },
    setUserId: (state, { payload }) => {
      state.userId = payload
    },
    setUserRoleId: (state, { payload }) => {
      state.userRoleId = payload ? Number(payload) : 0
    },
    setUsers: (state, { payload }) => {
      state.users = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      const users = [...action.payload.result]
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

export const { setUsers, setLoggedInUser, setUserId, setUserRoleId } = appUsersSlice.actions

export default appUsersSlice.reducer
