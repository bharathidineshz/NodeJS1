import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import { endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'
import { fetchRequiredSkills } from '../apps/projects'

export const fetchConfig = createAsyncThunk('appConfig/fetchConfig', async params => {
  try {
    const response = await instance.get(endpoints.getConfig)

    return response.data
  } catch (error) {
    const { response } = error

    return response.data
  }
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
    try {
      const response = await instance.post(endpoints.createConfig, data)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const postHRApproval = createAsyncThunk(
  'appConfig/postHRApproval',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.post(endpoints.HRApprovals, data)

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
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

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
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
  'appConfig/deleteHRApproval',
  async (data, { getState, dispatch }) => {
    try {
      const response = await instance.delete(endpoints.deleteHRApproval, { data: data })

      return response.data
    } catch (error) {
      const { response } = error

      return response.data
    }
  }
)

export const appConfigSlice = createSlice({
  name: 'settings',
  initialState: {
    configuration: null,
    OrgHrApprove: {},
    HrApprovals: null
  },
  reducers: {
    setConfigs: (state, { payload }) => {
      state.configuration = payload
    },
    setHRApprovals: (state, { payload }) => {
      state.HrApprovals = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchConfig.fulfilled, (state, action) => {
      state.configuration = action.payload?.result
      state.HrApprovals = action.payload.result?.organizationLeaveHRApprovals
    })
    builder.addCase(fetchOrgHrApprove.fulfilled, (state, action) => {
      state.OrgHrApprove = action.payload
    })
    builder.addCase(fetchHRApprovals.fulfilled, (state, action) => {
      state.HrApprovals = action.payload.result
    })
  }
})
export const { setConfigs, setHRApprovals } = appConfigSlice.actions

export default appConfigSlice.reducer
