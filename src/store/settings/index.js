import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'
import { fetchRequiredSkills } from '../apps/projects'

export const fetchConfig = createAsyncThunk('appConfig/fetchConfig', async params => {
  const response = await instance.get(endpoints.getConfig)
  console.log(response)

  return response.data
})

export const fetchHRApprovals = createAsyncThunk('appConfig/fetchHRApprovals', async params => {
  const response = await instance.get(endpoints.HRApprovals)
  console.log(response)

  return response.data
})

//** Add Configuration */
export const addConfig = createAsyncThunk(
  'appConfig/addConfig',
  async (data, { getState, dispatch }) => {
    const response = await instance.post(endpoints.createConfig, data)

    return response
  }
)

export const postHRApproval = createAsyncThunk(
  'appConfig/postHRApproval',
  async (data, { getState, dispatch }) => {
    const response = await instance.post(endpoints.HRApprovals, data)

    return response
  }
)

export const postSkill = createAsyncThunk(
  'appConfig/postSkill',
  async (data, { getState, dispatch }) => {
    const response = await instance.post(endpoints.skills, data)
    dispatch(fetchRequiredSkills())

    return response
  }
)

//** Update Configuration */
export const putSkill = createAsyncThunk(
  'appConfig/putSkill',
  async (data, { getState, dispatch }) => {
    const response = await instance.put(endpoints.skills, data)
    dispatch(fetchRequiredSkills())

    return response
  }
)

export const putConfig = createAsyncThunk(
  'appConfig/putConfig',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.put(endpoints.updateConfig, data)

      return response
    } catch (error) {
      throw error
    }
  }
)

export const fetchOrgHrApprove = createAsyncThunk('appConfig/fetchOrgHrApprove', async params => {
  const response = await instance.get(endpoints.OrgLeaveHrApproval)

  return response.data
})

export const addOrgHrApprove = createAsyncThunk(
  'appConfig/addOrgHrApprove',
  async (data, { getState, dispatch }) => {
    const response = await instance.post(endpoints.OrgLeaveHrApproval, data)
    dispatch(fetchOrgHrApprove())

    return response
  }
)
//** Delete Configuration */
export const deleteSkill = createAsyncThunk(
  'appConfig/deleteSkill',
  async (data, { getState, dispatch }) => {
    const response = await instance.delete(endpoints.deleteSkill, data)
    dispatch(fetchRequiredSkills())

    return response
  }
)

export const deleteHRApproval = createAsyncThunk(
  'appConfig/deleteSkill',
  async (data, { getState, dispatch }) => {
    const response = await instance.delete(endpoints.deleteHRApproval(data))

    return response
  }
)

export const appConfigSlice = createSlice({
  name: 'settings',
  initialState: {
    configuration: {},
    OrgHrApprove: {},
    HrApprovals: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      state.configuration = action.payload.result
    })
    builder.addCase(fetchOrgHrApprove.fulfilled, (state, action) => {
      state.OrgHrApprove = action.payload
    })
    builder.addCase(fetchHRApprovals.fulfilled, (state, action) => {
      state.HrApprovals = action.payload
    })
  }
})

export default appConfigSlice.reducer
