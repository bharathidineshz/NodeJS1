// Import necessary dependencies from Redux Toolkit and Axios
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { baseURL, endpointURL, endpoints } from '../endpoints/endpoints'
import instance, { base, identifyURL } from '../endpoints/interceptor'

// Create a Redux-thunk action for signup
export const signUpUser = createAsyncThunk('auth/signUpUser', async params => {
  const response = await axios.post(base.dev + endpoints.tenant, params)

  return response
})

// Create a slice for authentication
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    isLoading: false
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.error = null
      state.isLoading = false
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    setLoading: state => {
      state.isLoading = true
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signUpUser.pending, state => {
        state.isLoading = true
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload.result
        state.error = null
        state.isLoading = false
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.error = action.error.message
        state.isLoading = false
      })
  }
})

export const { setUser, setError, setLoading } = authSlice.actions

export default authSlice.reducer
